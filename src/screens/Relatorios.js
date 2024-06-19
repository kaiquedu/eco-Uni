import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFonts, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';
import Checkbox from 'expo-checkbox';
import { useAuth } from '../../AuthContext';
import { API_URL } from '@env';

const Relatorios = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [fontsLoaded] = useFonts({ Montserrat_700Bold });
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [coletas, setColetas] = useState([]);
  const [filteredColetas, setFilteredColetas] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [selectedResidueTypes, setSelectedResidueTypes] = useState([]);
  const [selectedColetas, setSelectedColetas] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    if (user.Email !== 'admteste@gmail.com') {
      Alert.alert('Acesso Restrito', 'Seu perfil não possui acesso para este serviço. Entre em contato com o seu administrador para qualquer dúvida.');
      navigation.goBack();
      return;
    }
  
    const fetchData = async () => {
      try {
        const endpoint = user.Email === 'admteste@gmail.com'
          ? `${API_URL}/api/coleta/ObterTodasColetas`
          : `${API_URL}/api/coleta/ObterColetas/${user.Cadastrarid}`;
  
        const response = await fetch(endpoint);
        if (response.ok) {
          const data = await response.json();
          data.sort((a, b) => new Date(b.DataRegistro) - new Date(a.DataRegistro));
          setColetas(data);
          setFilteredColetas(data);
        } else {
          console.error('Falha ao buscar coletas');
        }
      } catch (error) {
        console.error('Erro ao buscar coletas:', error);
      }
    };
  
    fetchData();
  }, [user.Cadastrarid, user.Email]);

  useEffect(() => {
    filterColetas();
  }, [selectedFilter, startDate, endDate, selectedResidueTypes]);

  const filterColetas = () => {
    let filtered = [...coletas];

    if (selectedFilter === 'Data') {
      filtered = filtered.filter(coleta => {
        const coletaDate = new Date(coleta.DataRegistro);
        return coletaDate >= startDate && coletaDate <= endDate;
      });
    }

    if (selectedFilter === 'Tipo de Resíduo') {
      if (selectedResidueTypes.length > 0) {
        filtered = filtered.filter(coleta => selectedResidueTypes.includes(coleta.TipoResiduo));
      }
    }

    setFilteredColetas(filtered);
  };

  if (!fontsLoaded) {
    return null;
  }

  const handleBack = () => {
    navigation.goBack();
  };

  const toggleFilter = () => {
    setIsFilterVisible(!isFilterVisible);
    setSelectedFilter('');
  };

  const formatarData = (data) => {
    const dataObj = new Date(data);
    if (isNaN(dataObj.getTime())) {
      return "Data Inválida";
    }
    return dataObj.toLocaleDateString('pt-BR');
  };

  const onStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(false);
    setStartDate(currentDate);
  };

  const onEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(false);
    setEndDate(currentDate);
  };

  const applyFilter = () => {
    setIsFilterVisible(false);
    filterColetas();
  };

  const handleResidueTypeChange = (type) => {
    setSelectedResidueTypes(prevTypes =>
      prevTypes.includes(type)
        ? prevTypes.filter(t => t !== type)
        : [...prevTypes, type]
    );
  };

  const renderFilterOptions = () => {
    if (selectedFilter === 'Data') {
      return (
        <>
          <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.modalItem}>
            <Text style={styles.modalItemText}>Data Inicial: {formatarData(startDate)}</Text>
          </TouchableOpacity>
          {showStartDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={onStartDateChange}
            />
          )}
          <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={styles.modalItem}>
            <Text style={styles.modalItemText}>Data Final: {formatarData(endDate)}</Text>
          </TouchableOpacity>
          {showEndDatePicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display="default"
              onChange={onEndDateChange}
            />
          )}
        </>
      );
    }

    if (selectedFilter === 'Tipo de Resíduo') {
      return (
        <>
          <Text style={styles.modalItemText}>Tipos de Resíduo:</Text>
          <View style={styles.checkboxContainer}>
            {['Reciclável', 'Não Reciclável', 'Papel Reciclável'].map(type => (
              <View key={type} style={styles.checkbox}>
                <Checkbox
                  value={selectedResidueTypes.includes(type)}
                  onValueChange={() => handleResidueTypeChange(type)}
                  color={selectedResidueTypes.includes(type) ? '#0F334D' : undefined}
                />
                <Text style={styles.checkboxLabel}>{type}</Text>
              </View>
            ))}
          </View>
        </>
      );
    }

    return (
      <>
        <TouchableOpacity
          style={styles.modalItem}
          onPress={() => setSelectedFilter('Data')}
        >
          <Text style={styles.modalItemText}>Data</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.modalItem}
          onPress={() => setSelectedFilter('Tipo de Resíduo')}
        >
          <Text style={styles.modalItemText}>Tipo de Resíduo</Text>
        </TouchableOpacity>
      </>
    );
  };

  const handleCheckboxChange = (coletaId) => {
    setSelectedColetas(prevSelected =>
      prevSelected.includes(coletaId)
        ? prevSelected.filter(id => id !== coletaId)
        : [...prevSelected, coletaId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedColetas([]);
    } else {
      setSelectedColetas(filteredColetas.map(coleta => coleta.Id));
    }
    setSelectAll(!selectAll);
  };

  const handleGenerateReport = () => {
    const selectedData = filteredColetas.filter(coleta => selectedColetas.includes(coleta.Id));
    if (selectedData.length < 2) {
      Alert.alert('Seleção Insuficiente', 'Por favor, selecione pelo menos duas coletas para gerar um relatório.');
      return;
    }
    navigation.navigate('GerarRelatorios', { selectedColetas: selectedData });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={20} color="#0F334D" />
        </TouchableOpacity>
      <Text style={styles.headerText}>Relatórios</Text>
      
      <View style={styles.filterContainer}>
        <Text style={styles.filterText}>Filtro: {selectedFilter || 'Nenhum'}</Text>
        <TouchableOpacity style={styles.filterButton} onPress={toggleFilter}>
          <Text style={styles.filterButtonText}>Filtrar por</Text>
          <Icon name="filter" size={16} color="#0F334D" />
        </TouchableOpacity>
      </View>

      <View style={styles.selectAllContainer}>
        <Checkbox
          value={selectAll}
          onValueChange={handleSelectAll}
          color={selectAll ? '#0F334D' : undefined}
        />
        <Text style={styles.selectAllText}>Selecionar Todas</Text>
      </View>

      <ScrollView contentContainerStyle={styles.reportsContainer}>
        {filteredColetas.map((coleta, index) => (
          <View key={index} style={styles.reportItem}>
            <Checkbox
              value={selectedColetas.includes(coleta.Id)}
              onValueChange={() => handleCheckboxChange(coleta.Id)}
              color={selectedColetas.includes(coleta.Id) ? '#0F334D' : undefined}
            />
            <Text style={styles.reportDate}>{formatarData(coleta.DataRegistro)}</Text>
            <Text style={styles.reportText}>
              {coleta.TamanhoSaco && coleta.Quantidade ? `${coleta.TamanhoSaco * coleta.Quantidade}L de ${coleta.TipoResiduo}` : 'Dados incompletos'}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => setSelectedColetas([])}
        >
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.generateButton, selectedColetas.length < 2 && styles.disabledButton]}
          onPress={handleGenerateReport}
          disabled={selectedColetas.length < 2}
        >
          <Text style={styles.buttonText}>Próxima Página</Text>
        </TouchableOpacity>
      </View>

      <Modal isVisible={isFilterVisible} onBackdropPress={toggleFilter}>
        <View style={styles.modalContent}>
          {renderFilterOptions()}
          {(selectedFilter === 'Data' || selectedFilter === 'Tipo de Resíduo') && (
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity onPress={toggleFilter} style={styles.modalCancelButton}>
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={applyFilter} style={styles.modalConfirmButton}>
                <Text style={styles.modalButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  backButton: {
    paddingTop: 20,
    position: 'absolute',
    top: 20,
    left: 20,
  },
  headerText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
    color: '#0F334D',
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  filterText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
    color: '#0F334D',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButtonText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
    color: '#0F334D',
    marginRight: 5,
  },
  selectAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  selectAllText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
    color: '#0F334D',
    marginLeft: 10,
  },
  reportsContainer: {
    paddingBottom: 20,
  },
  reportItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  reportDate: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    color: '#0F334D',
    width: '30%',
  },
  reportText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#0F334D',
    flex: 1,
    width: '70%',
    textAlign: 'right',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
  },
  modalItem: {
    paddingVertical: 10,
  },
  modalItemText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
    color: '#0F334D',
  },
  selectedFilter: {
    backgroundColor: '#E0E0E0',
  },
  checkboxContainer: {
    flexDirection: 'column',
    marginVertical: 10,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  checkboxLabel: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
    color: '#0F334D',
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#FF5A5F',
    padding: 10,
    borderRadius: 5,
  },
  generateButton: {
    backgroundColor: '#0F334D',
    padding: 10,
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: '#A0A0A0',
  },
  buttonText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalCancelButton: {
    backgroundColor: '#FF5A5F',
    padding: 10,
    borderRadius: 5,
  },
  modalConfirmButton: {
    backgroundColor: '#0F334D',
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default Relatorios;
