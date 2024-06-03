import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-picker/picker';
import { useFonts, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../../AuthContext';

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
        const response = await fetch(`http://192.168.1.84:5000/api/coleta/ObterColeta/${user.Cadastrarid}/${coletaId}`);
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
    // Implemente aqui a lógica para enviar as alterações da coleta para o servidor via método PUT
    try {
      const response = await fetch(`http://192.168.1.84:5000/api/coleta/EditarColeta/${user.Cadastrarid}/${coletaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(coleta),
      });
      if (response.ok) {
        // Coleta editada com sucesso
        Alert.alert('Sucesso', 'Coleta editada com sucesso!');
        navigation.goBack();
      } else {
        console.error('Falha ao editar coleta');
        Alert.alert('Erro', 'Falha ao editar coleta. Por favor, tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao editar coleta:', error);
      Alert.alert('Erro', 'Erro ao editar coleta. Por favor, tente novamente.');
    }
  };

  const handleCancelar = () => {
    navigation.goBack();
  };

  const handleChange = (field, value) => {
    setColeta({ ...coleta, [field]: value });
  };

  const renderLoading = () => {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0F334D" />
      </View>
    );
  };

  if (loading || !coleta) {
    return renderLoading();
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancelar} style={styles.backButton}>
          <Icon name="arrow-left" size={20} color="#0F334D" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Editar Coleta</Text>
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Tipo de Resíduo *</Text>
        <Picker
          selectedValue={coleta.TipoResiduo}
          style={styles.picker}
          onValueChange={(value) => handleChange('TipoResiduo', value)}
        >
          <Picker.Item label="Material Reciclável" value="Material Reciclável" />
          <Picker.Item label="Material Não Reciclável" value="Material Não Reciclável" />
          <Picker.Item label="Papel Reciclável" value="Papel Reciclável" />
        </Picker>
        <Text style={styles.label}>Quantidade *</Text>
        <Picker
          selectedValue={coleta.Quantidade}
          style={styles.picker}
          onValueChange={(value) => handleChange('Quantidade', value)}
        >
          {[...Array(10).keys()].map((_, i) => (
            <Picker.Item key={i} label={`${i + 1}`} value={`${i + 1}`} />
          ))}
        </Picker>
        <Text style={styles.label}>Tamanho do Saco *</Text>
        <Picker
          selectedValue={coleta.TamanhoSaco}
          style={styles.picker}
          onValueChange={(value) => handleChange('TamanhoSaco', value)}
        >
          <Picker.Item label="1L" value="1L" />
          <Picker.Item label="10L" value="10L" />
        </Picker>
        <Text style={styles.label}>Observações</Text>
        <TextInput
          style={styles.textInput}
          value={coleta.Observacoes}
          onChangeText={(value) => handleChange('Observacoes', value)}
          placeholder="Escreva aqui suas observações"
          multiline
          maxLength={1000}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.confirmarButton} onPress={handleConfirmar}>
          <Text style={styles.buttonText}>Confirmar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancelar}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 10,
  },
  headerText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
    color: '#0F334D',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
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
  textInput: {
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
    marginTop: 20,
  },
  confirmarButton: {
    backgroundColor: '#0F334D',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginRight: 5,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditarColeta;
