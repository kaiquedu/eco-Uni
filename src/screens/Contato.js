import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFonts, Montserrat_700Bold, Montserrat_400Regular } from '@expo-google-fonts/montserrat';
import emailjs from '@emailjs/browser';

const Contato = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [messageLength, setMessageLength] = useState(0);
  const [userName, setUserName] = useState('');
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({ Montserrat_700Bold, Montserrat_400Regular });
  
  // useEffect(() => {
  //   fetchUserName();
  // }, []);

  // const fetchUserName = async () => {
  //   try {
  //     const response = await fetch(`http://localhost:5000/api/auth/usuarios/`);
  //     const data = await response.json();
  //     setUserName(data.Nome);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const handleSend = () => {
    if (messageLength > 0 && messageLength <= 1000) {
      const templateParams = {
        subject: subject,
        message: message,
        to_name: userName,
      };

      emailjs.send('service_43zwb4d', 'template_dxz1yob', templateParams, 'mM66eh7H9EHXsEIZ4')
        .then(response => {
          Alert.alert('Sucesso', 'Email enviado com sucesso!');
          setSubject('');
          setMessage('');
          setMessageLength(0);
        })
        .catch(error => {
          console.error(error);
          Alert.alert('Erro', 'Falha ao enviar email.');
        });
    } else {
      Alert.alert('Erro', 'A mensagem deve conter entre 1 e 1000 caracteres.');
    }
  };

  if (!fontsLoaded) {
    return null; 
  }
  
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-back" size={24} color="#0F334D" />
      </TouchableOpacity>
      <Text style={styles.header}>Contato</Text>
      <Text style={styles.label}>Assunto</Text>
      <TextInput
        style={styles.input}
        placeholder="Assunto"
        value={subject}
        onChangeText={text => setSubject(text)}
      />
      <TextInput
        style={styles.textArea}
        placeholder="Escreva sua mensagem..."
        value={message}
        onChangeText={text => {
          setMessage(text);
          setMessageLength(text.length);
        }}
        multiline={true}
        maxLength={1000}
      />
      <Text style={styles.charCount}>{messageLength} a 1000 caracteres</Text>
      <TouchableOpacity style={styles.button} onPress={handleSend}>
        <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    marginBottom: 10,
  },
  header: {
    fontSize: 24,
    fontFamily: 'Montserrat_700Bold',
    color: '#0F334D',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Montserrat_700Bold',
    color: '#0F334D',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontFamily: 'Montserrat_400Regular',
  },
  textArea: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontFamily: 'Montserrat_400Regular',
    textAlignVertical: 'top',
  },
  charCount: {
    textAlign: 'right',
    fontFamily: 'Montserrat_400Regular',
    color: '#0F334D',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#0F334D',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
  },
});

export default Contato;
