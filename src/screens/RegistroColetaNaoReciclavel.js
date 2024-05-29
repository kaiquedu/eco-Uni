import React, { useState } from 'react';
import { View, Text, TextInput, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFonts, Montserrat_700Bold, Montserrat_400Regular } from '@expo-google-fonts/montserrat';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../AuthContext'; // Importe o contexto de autenticação

const RegistroColetaNaoReciclavel = () => {
  const [saco, setSaco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const navigation = useNavigation();
  const { user } = useAuth(); // Use o contexto de autenticação para obter o usuário
  const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
    Montserrat_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleRegister = async () => {
    if (!saco || !quantidade) {
      setErrorModalVisible(true);
      return;
    }

    const coletaData = {
      TipoResiduo: "Não Reciclável",
      TamanhoSaco: parseInt(saco, 10),
      Quantidade: parseInt(quantidade, 10),
      Observacoes: observacoes,
      DataRegistro: new Date().toISOString(),
      Cadastrarid: user.Cadastrarid // Use o Cadastrarid do usuário
    };

    try {
      const response = await fetch('http://192.168.1.18:5000/api/coleta/RegistrarColeta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(coletaData)
      });

      if (response.ok) {
        setSuccessModalVisible(true);
      } else {
        setErrorModalVisible(true);
      }
    } catch (error) {
      setErrorModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de Coleta</Text>
      <Text style={styles.subtitle}>Material Não Reciclável</Text>
      <Text style={styles.label}>Tamanho do saco *</Text>
      <Picker
        selectedValue={saco}
        style={styles.picker}
        onValueChange={(itemValue) => setSaco(itemValue)}
      >
        <Picker.Item label="Selecione a opção" value="" />
        <Picker.Item label="1L" value="1" />
        <Picker.Item label="10L" value="10" />
        {/* Adicione outros valores conforme necessário */}
      </Picker>
      <Text style={styles.label}>Quantidade *</Text>
      <Picker
        selectedValue={quantidade}
        style={styles.picker}
        onValueChange={(itemValue) => setQuantidade(itemValue)}
      >
        <Picker.Item label="Selecione a opção" value="" />
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
        value={observacoes}
        onChangeText={setObservacoes}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, !saco || !quantidade ? styles.disabledButton : styles.registerButton]}
          onPress={handleRegister}
          disabled={!saco || !quantidade}
        >
          <Text style={styles.buttonText}>Registrar</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={successModalVisible}
        onRequestClose={() => setSuccessModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Coleta registrada com sucesso!</Text>
            <TouchableOpacity onPress={() => { setSuccessModalVisible(false); navigation.goBack(); }}>
              <Text style={[styles.modalText, styles.modalLink]}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={errorModalVisible}
        onRequestClose={() => setErrorModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Falha ao registrar coleta.</Text>
            <TouchableOpacity onPress={() => setErrorModalVisible(false)}>
              <Text style={[styles.modalText, styles.modalLink]}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#0F334D',
  },
  subtitle: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#000000',
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
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
    backgroundColor: '#0F334D',
  },
  cancelButton: {
    backgroundColor: '#808080',
  },
  registerButton: {
    backgroundColor: '#000080',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: '#0F334D',
  },
  modalLink: {
    color: '#007BFF',
  },
});

export default RegistroColetaNaoReciclavel;
