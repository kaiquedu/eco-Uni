import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import {
    useFonts,
    Montserrat_400Regular,
    Montserrat_700Bold,
    Montserrat_900Black,
    Montserrat_300Light,
} from '@expo-google-fonts/montserrat';
import { useNavigation } from '@react-navigation/native';

const EncontreConta = () => {
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
    Montserrat_900Black,
    Montserrat_300Light,
  });

  if (!fontsLoaded) {
    return null; 
  }
  const navigation = useNavigation();

  const handleAutenticacaoConta = () => {
    navigation.navigate('AutenticacaoConta');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Encontre sua conta</Text>
      <Text style={styles.subtitle}>Digite seu e-mail vinculado à sua conta para receber instruções para redefinir sua senha</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>E-mail</Text>
        <TextInput style={styles.input} placeholder="Digite seu e-mail" />
      </View>
      <TouchableOpacity style={[styles.button, styles.avancarButton]} onPress={handleAutenticacaoConta}>
        <Text style={[styles.buttonText, styles.avancarText]}>AVANÇAR</Text>
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
  title: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 24,
    color: '#0F334D',
    marginBottom: 20,
  },
  subtitle: {
    fontFamily: 'Montserrat_300Light',
    color: '#0F334D',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
    color: '#0F334D',
  },
  inputLabel: {
    fontFamily: 'Montserrat_300Light',
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
  avancarButton: {
    backgroundColor: '#0F334D',
  },
  avancarText: {
    color: '#fff',
  },
});

export default EncontreConta;
