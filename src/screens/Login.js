import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_700Bold,
  Montserrat_900Black,
  Montserrat_300Light,
} from '@expo-google-fonts/montserrat';

const Login = () => {
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
    Montserrat_900Black,
    Montserrat_300Light,
  });

  const navigation = useNavigation();

  if (!fontsLoaded) {
    return null; 
  }

  const handleLoginUsuario = () => {
    navigation.navigate('LoginUsuario');
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logo.png')} style={styles.logo} />
      <Image source={require('../assets/images/nome.png')} style={styles.appName} />
      <TouchableOpacity style={[styles.button, styles.entrarButton]} onPress={handleLoginUsuario}>
        <Text style={[styles.buttonText, styles.entrarText]}>ENTRAR</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  appName: {
    width: 200,
    height: 50,
    marginBottom: 20,
  },
  button: {
    width: 300,
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Montserrat_700Bold',
    color: '#fff',
  },
  cadastrarButton: {
    backgroundColor: '#F0F0F0',
  },
  entrarButton: {
    backgroundColor: '#0F334D',
  },
  cadastrarText: {
    color: '#0F334D',
  },
  entrarText: {
    color: '#fff',
  },
});

export default Login;
