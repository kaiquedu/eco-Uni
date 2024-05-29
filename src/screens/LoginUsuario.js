import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useAuth } from '../../AuthContext';

const LoginUsuario = () => {
  const [email, setEmail] = useState('');
  const [senha, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');

  const navigation = useNavigation();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !senha) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    try {
      console.log('Sending request with:', { Email: email, Senha: senha });
      const response = await axios.post('http://192.168.1.18:5000/api/auth/login', {
        Email: email,
        Senha: senha,
      });
      console.log('Response received:', response.data);
  
      const userData = response.data;
      login(userData);
      navigation.navigate('HomeApp');
    } catch (error) {
      console.error('Login error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Credenciais inválidas');
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/images/logo.png')} style={styles.logo} />
        <Image source={require('../assets/images/nome.png')} style={styles.appName} />
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.inputLabel}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Text style={styles.inputLabel}>Senha</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Digite sua senha"
            secureTextEntry={!passwordVisible}
            value={senha}
            onChangeText={(text) => setPassword(text)}
          />
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setPasswordVisible(!passwordVisible)}>
            <Icon name={passwordVisible ? 'eye-slash' : 'eye'} size={24} color="#0F334D" />
          </TouchableOpacity>
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
      <TouchableOpacity style={[styles.button, styles.entrarButton]} onPress={handleLogin}>
        <Text style={[styles.buttonText, styles.entrarText]}>ENTRAR</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.forgotPasswordButton} onPress={() => navigation.navigate('EncontreConta')}>
        <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
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
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    color: '#0F334D',
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
    fontSize: 16,
    color: '#fff',
  },
  entrarButton: {
    backgroundColor: '#0F334D',
    marginBottom: 10,
  },
  entrarText: {
    color: '#fff',
  },
  forgotPasswordText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#0F334D',
  },
  eyeIcon: {
    marginRight: 10, 
  },
  errorText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: 'red',
    marginBottom: 10,
  },
});

export default LoginUsuario;
