import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../../AuthContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import { API_URL } from '@env';

const EditarColeta = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const route = useRoute();
  const { coletaId } = route.params;

  const [coleta, setColeta] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchColeta = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/coleta/ObterColeta/${user.Cadastrarid}/${coletaId}`);
        if (response.ok) {
          const data = await response.json();
          setColeta(data);
        } else {
          console.error('Falha ao buscar coleta');
        }
      } catch (error) {
        console.error('Erro ao buscar coleta:', error);
      }
      setLoading(false);
    };

    fetchColeta();
  }, [user.Cadastrarid, coletaId]);

  const handleConfirmar = async () => {
    const coletaEditada = {
      ...coleta,
      TamanhoSaco: parseInt(coleta.TamanhoSaco, 10),
      Quantidade: parseInt(coleta.Quantidade, 10),
    };

    console.log('Dados enviados para edição:', coletaEditada);  
    try {
      const response = await fetch(`${API_URL}/api/coleta/EditarColeta/${user.Cadastrarid}/${coletaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(coletaEditada),
      });
      if (response.ok) {
        Alert.alert('Sucesso', 'Coleta editada com sucesso');
        navigation.goBack();
      } else {
        const errorData = await response.json();
        console.error('Falha ao editar coleta:', errorData);
        Alert.alert('Erro', 'Falha ao editar coleta');
      }
    } catch (error) {
      console.error('Erro ao editar coleta:', error);
      Alert.alert('Erro', 'Erro ao editar coleta');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!coleta) {
    return <Text>Carregando...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={20} color="#0F334D" />
        </TouchableOpacity>
        <Text style={styles.title}>Editar Coleta</Text>
      </View>
      <Text style={styles.label}>Tipo de Resíduo</Text>
      <Picker
        selectedValue={coleta.TipoResiduo}
        style={styles.picker}
        onValueChange={(itemValue) => setColeta({ ...coleta, TipoResiduo: itemValue })}
      >
        <Picker.Item label="Material Reciclável" value="Material Reciclável" />
        <Picker.Item label="Material Não Reciclável" value="Material Não Reciclável" />
        <Picker.Item label="Papel Reciclável" value="Papel Reciclável" />
      </Picker>
      <Text style={styles.label}>Tamanho do Saco</Text>
      <Picker
        selectedValue={coleta.TamanhoSaco}
        style={styles.picker}
        onValueChange={(itemValue) => setColeta({ ...coleta, TamanhoSaco: itemValue })}
      >
        <Picker.Item label="1L" value="1" />
        <Picker.Item label="10L" value="10" />
      </Picker>
      <Text style={styles.label}>Quantidade</Text>
      <Picker
        selectedValue={coleta.Quantidade}
        style={styles.picker}
        onValueChange={(itemValue) => setColeta({ ...coleta, Quantidade: itemValue })}
      >
        {[...Array(10).keys()].map((_, i) => (
          <Picker.Item key={i} label={`${i + 1}`} value={`${i + 1}`} />
        ))}
      </Picker>
      <Text style={styles.label}>Observações</Text>
      <TextInput
        style={styles.input}
        multiline
        maxLength={1000}
        placeholder="Escreva aqui suas observações"
        value={coleta.Observacoes}
        onChangeText={(text) => setColeta({ ...coleta, Observacoes: text })}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, !coleta.TamanhoSaco || !coleta.Quantidade ? styles.disabledButton : styles.registerButton]}
          onPress={handleConfirmar}
          disabled={!coleta.TamanhoSaco || !coleta.Quantidade}
        >
          <Text style={styles.buttonText}>Confirmar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 22,
    color: '#0F334D',
    marginLeft: 10,
  },
  label: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
    marginBottom: 10,
    color: '#0F334D',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
    borderRadius: 20,
  },
  input: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    textAlignVertical: 'top',
    marginBottom: 20,
    fontFamily: 'Montserrat_400Regular',
    borderRadius: 20,
    color: '#0F334D',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#0F334D',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginRight: 5,
  },
  cancelButton: {
    backgroundColor: '#808080',
  },
  registerButton: {
    backgroundColor: '#0F334D',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
  },
});

export default EditarColeta;
