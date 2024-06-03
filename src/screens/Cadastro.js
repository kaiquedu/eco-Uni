import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { useNavigation } from '@react-navigation/native';

const Cadastro = () => {
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirma] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const navigation = useNavigation();

  const handleCadastro = async () => {
    try {
      const response = await fetch('http://192.168.1.84:5000/api/auth/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Nome: nome,
          Email: email,
          Telefone: telefone,
          Senha: senha,
          ConfirmarSenha: confirmarSenha,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Sucesso', 'Cadastro realizado com sucesso.');
        navigation.navigate('Login');
      } else {
        Alert.alert('Erro', data.message || 'Ocorreu um erro durante o cadastro.');
      }
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      Alert.alert('Erro', 'Ocorreu um erro durante o cadastro. Por favor, tente novamente mais tarde.');
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/images/logo.png')} style={styles.logo} />
        <Image source={require('../assets/images/nome.png')} style={styles.appName} />
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.inputLabel}>Nome completo</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu nome completo"
          value={nome}
          onChangeText={setNome}
        />
        <Text style={styles.inputLabel}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail"
          value={email}
          onChangeText={setEmail}
        />
        <Text style={styles.inputLabel}>Telefone</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu telefone"
          value={telefone}
          onChangeText={setTelefone}
        />
        <Text style={styles.inputLabel}>Senha</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Digite sua senha"
            secureTextEntry={!passwordVisible}
            value={senha}
            onChangeText={setSenha}
          />
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setPasswordVisible(!passwordVisible)}>
            <Icon name={passwordVisible ? 'eye-slash' : 'eye'} size={24} color="#0F334D" />
          </TouchableOpacity>
        </View>
        <Text style={styles.inputLabel}>Confirme sua senha</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirme sua senha"
            secureTextEntry={!confirmPasswordVisible}
            value={confirmarSenha}
            onChangeText={setConfirma}
          />
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
            <Icon name={confirmPasswordVisible ? 'eye-slash' : 'eye'} size={24} color="#0F334D" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={[styles.button, styles.cadastrarButton]} onPress={handleCadastro}>
        <Text style={[styles.buttonText, styles.cadastrarText]}>CADASTRAR-SE</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  appName: {
    width: 200,
    height: 50,
  },
  formContainer: {
    width: '100%',
    marginBottom: 20,
  },
  inputLabel: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
    marginBottom: 5,
    color: '#0F334D',
  },
  input: {
    fontFamily: 'Montserrat_400Regular',
    color: '#0F334D',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  passwordContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    fontFamily: 'Montserrat_400Regular',
    fontSize: 16,
    color: '#0F334D',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  button: {
    width: '100%',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#0F334D',
  },
  buttonText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
    color: '#fff',
  },
  cadastrarButton: {
    backgroundColor: '#0F334D',
  },
  cadastrarText: {
    color: '#fff',
  },
  eyeIcon: {
    marginRight: 10,
  },
});

export default Cadastro;
