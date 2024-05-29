import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
    useFonts,
    Montserrat_400Regular,
    Montserrat_700Bold,
    Montserrat_900Black,
    Montserrat_300Light,
} from '@expo-google-fonts/montserrat';
import { useNavigation } from '@react-navigation/native';

const ConfirmaSenha = () => {
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
    Montserrat_900Black,
    Montserrat_300Light,
  });

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  if (!fontsLoaded) {
    return null; 
  }
  const navigation = useNavigation();

  const handleLoginUsuario = () => {
    navigation.navigate('LoginUsuario');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Redefina sua senha</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Digite sua nova senha</Text>
        <View style={styles.passwordInputContainer}>
          <TextInput
            style={styles.passwordInput}
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
            placeholder="Digite sua nova senha"
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <Icon name={passwordVisible ? 'eye' : 'eye-slash'} size={24} color="#0F334D" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Confirme sua senha</Text>
        <View style={styles.passwordInputContainer}>
          <TextInput
            style={styles.passwordInput}
            secureTextEntry={!confirmPasswordVisible}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirme sua senha"
          />
          <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
            <Icon name={confirmPasswordVisible ? 'eye' : 'eye-slash'} size={24} color="#0F334D" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={[styles.button, styles.confirmButton]}>
        <Text style={[styles.buttonText, styles.confirmText]} onPress={handleLoginUsuario}>CONFIRMAR</Text>
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
    backgroundColor: '#fff',
  },
  title: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 24,
    color: '#0F334D',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  inputLabel: {
    fontFamily: 'Montserrat_300Light',
    fontSize: 18,
    marginBottom: 10,
    color: '#0F334D',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 60, 
  },
  passwordInput: {
    flex: 1,
    fontFamily: 'Montserrat_400Regular',
    fontSize: 16,
    color: '#0F334D',
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
  confirmButton: {
    backgroundColor: '#0F334D',
  },
  confirmText: {
    color: '#fff',
  },
});

export default ConfirmaSenha;
