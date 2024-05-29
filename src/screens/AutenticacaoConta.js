import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import {
    useFonts,
    Montserrat_400Regular,
    Montserrat_700Bold,
    Montserrat_900Black,
    Montserrat_300Light,
} from '@expo-google-fonts/montserrat';
import { useNavigation } from '@react-navigation/native';

const AutenticacaoConta = () => {
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

  const handleConfirmaSenha = () => {
    navigation.navigate('ConfirmaSenha');
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Encontre sua conta</Text>
      </View>
      <View style={styles.codeContainer}>
        <Text style={styles.subtitle}>Digite o código enviado por e-mail</Text>
        <View style={styles.codeRow}>
          <TextInput style={styles.codeInput} maxLength={1} />
          <TextInput style={styles.codeInput} maxLength={1} />
          <TextInput style={styles.codeInput} maxLength={1} />
          <TextInput style={styles.codeInput} maxLength={1} />
        </View>
      </View>
      <TouchableOpacity style={styles.resendButton}>
        <Text style={styles.resendText}><Text style={styles.boldText}>Clique aqui</Text> para reenviar o código</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.verifyButton]}>
        <Text style={[styles.buttonText, styles.verifyText]} onPress={handleConfirmaSenha}>VERIFICAR</Text>
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
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
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
  codeContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: 20,
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  codeInput: {
    borderWidth: 1.5,
    borderColor: '#525252',
    width: 70,
    height: 80,
    textAlign: 'center',
    marginHorizontal: 10,
    borderRadius: 5,
    fontSize: 20,
  },
  resendButton: {
    marginBottom: 20,
  },
  resendText: {
    fontFamily: 'Montserrat_300Light',
    fontSize: 16,
    color: '#0F334D',
    textAlign: 'center',
  },
  boldText: {
    fontFamily: 'Montserrat_700Bold',
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
  verifyButton: {
    backgroundColor: '#0F334D',
  },
  verifyText: {
    color: '#fff',
  },
});

export default AutenticacaoConta;
