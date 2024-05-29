import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFonts, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../AuthContext';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Historico = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [coletas, setColetas] = useState([]);
  const [selectedColeta, setSelectedColeta] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://192.168.1.18:5000/api/coleta/ObterColetas/${user.Cadastrarid}`);
        if (response.ok) {
          const data = await response.json();
          // Ordenar coletas em ordem decrescente de data
          data.sort((a, b) => new Date(b.DataRegistro) - new Date(a.DataRegistro));
          setColetas(data);
        } else {
          console.error('Falha ao buscar coletas');
        }
      } catch (error) {
        console.error('Erro ao buscar coletas:', error);
      }
    };

    fetchData();
  }, [user.Cadastrarid]);

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
              const response = await fetch(`http://192.168.1.18:5000/api/coleta/DeletarColeta/${coletaId}`, { method: 'DELETE' });
              if (response.ok) {
                setColetas(coletas.filter(coleta => coleta.id !== coletaId));
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
    navigation.navigate('EditarColeta', { coleta });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Histórico de Coletas</Text>
      </View>
      <ScrollView style={styles.containerSection}>
        {coletas.map((coleta, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.coletaItem, selectedColeta === coleta.id && styles.coletaItemSelected]}
            onPress={() => setSelectedColeta(coleta.id)}
          >
            <Text style={styles.coletaText}>{formatarDataHora(coleta.DataRegistro)}</Text>
            <Text style={styles.coletaQuantidade}>{coleta.TamanhoSaco * coleta.Quantidade}L de {coleta.TipoResiduo}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {selectedColeta && (
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(coletas.find(coleta => coleta.id === selectedColeta))}>
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(selectedColeta)}>
            <Text style={styles.buttonText}>Deletar</Text>
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
    paddingTop: 20,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
  },
  headerText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
    color: '#0F334D',
    marginBottom: 20,
  },
  containerSection: {
    backgroundColor: '#F0F0F0',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 20,
  },
  coletaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
  },
  coletaItemSelected: {
    backgroundColor: '#E0E0E0',
  },
  coletaText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#0F334D',
    flex: 1,
  },
  coletaQuantidade: {
    fontFamily: 'Montserrat_700Bold',
    textAlign: 'right',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    backgroundColor: '#4CAF50',
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
  buttonText: {
    fontFamily: 'Montserrat_700Bold',
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default Historico;
