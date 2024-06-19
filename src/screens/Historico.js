import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFonts, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../AuthContext';
import { useColeta } from '../../ColetaContext';
import { API_URL } from '@env';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Historico = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { selectedColeta, selectColeta, clearColeta } = useColeta();
  const [coletas, setColetas] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      let endpoint;
      if (user.Email === 'admteste@gmail.com') {
        endpoint = `${API_URL}/api/coleta/ObterTodasColetas`;
      } else {
        endpoint = `${API_URL}/api/coleta/ObterColetas/${user.Cadastrarid}`;
      }
      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        data.sort((a, b) => new Date(b.DataRegistro) - new Date(a.DataRegistro));
        setColetas(data);
      } else {
        console.error('Falha ao buscar coletas');
      }
    } catch (error) {
      console.error('Erro ao buscar coletas:', error);
    }
    setLoading(false);
  };
  
  useEffect(() => {
    fetchData();
  }, [user.Email, user.Cadastrarid]);
  
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const [fontsLoaded] = useFonts({ Montserrat_700Bold });

  if (!fontsLoaded) {
    return null;
  }

  const formatarDataHora = (data) => {
    const dataObj = new Date(data);
    if (isNaN(dataObj.getTime())) {
      return "Data Inválida";
    }
    return dataObj.toLocaleDateString('pt-BR') + ' às ' + dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const handleDelete = (coletaId) => {
    Alert.alert(
      "Confirmar Deleção",
      "Tem certeza de que deseja deletar esta coleta?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Deletar", onPress: async () => {
            try {
              const response = await fetch(`${API_URL}/api/coleta/DeletarColeta/${user.Cadastrarid}/${coletaId}`, { method: 'DELETE' });
              if (response.ok) {
                setColetas(coletas.filter(coleta => coleta.Id !== coletaId));
                clearColeta();
              } else {
                console.error('Falha ao deletar coleta');
              }
            } catch (error) {
              console.error('Erro ao deletar coleta:', error);
            }
          }
        }
      ]
    );
  };

  const handleEdit = (coleta) => {
    selectColeta(coleta);
    navigation.navigate('EditarColeta', { coletaId: coleta.Id });
  };

  const handleSelectColeta = (coleta) => {
    console.log(`Coleta selecionada: ${coleta.Id}`);
    selectColeta(coleta);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={20} color="#0F334D" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Histórico de Coletas</Text>
      </View>
      <ScrollView>
        {coletas.map((coleta, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.coletaItem, selectedColeta && selectedColeta.Id === coleta.Id && styles.coletaItemSelected]}
            onPress={() => handleSelectColeta(coleta)}
          >
            <Text style={styles.coletaText}>{formatarDataHora(coleta.DataRegistro)}</Text>
            <Text style={styles.coletaQuantidade}>{coleta.TamanhoSaco * coleta.Quantidade}L de {coleta.TipoResiduo}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {selectedColeta && user.Email !== 'admteste@gmail.com' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(selectedColeta)}>
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(selectedColeta.Id)}>
            <Text style={styles.buttonText}>Deletar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => clearColeta()}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 40,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Centraliza o texto do cabeçalho horizontalmente
    marginBottom: 20, // Adiciona margem inferior para mover o cabeçalho um pouco mais para baixo
  },
  backButton: {
    position: 'absolute',
    left: 0,
  },
  headerText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
    color: '#0F334D',
  },
  coletaItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderColor: '#E0E0E0',
    borderWidth: 1,
    marginBottom: 10,
  },
  coletaItemSelected: {
    backgroundColor: '#D3D3D3',
  },
  coletaText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 13,
    color: '#0F334D',
    flex: 1,
  },
  coletaQuantidade: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    color:
    '#7F7F7F',
    textAlign: 'right',
    },
    actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    },
    editButton: {
    backgroundColor: '#0F334D',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginRight: 5,
    },
    deleteButton: {
    backgroundColor: '#F44336',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginLeft: 5,
    },
    cancelButton: {
    backgroundColor: '#B0B0B0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginLeft: 5,
    },
    buttonText: {
    fontFamily: 'Montserrat_700Bold',
    color: '#FFFFFF',
    fontSize: 16,
    },
    });
    
    export default Historico;
