import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFonts, Montserrat_700Bold, Montserrat_400Regular } from '@expo-google-fonts/montserrat';
import email from 'react-native-email'; 

const Contato = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [messageLength, setMessageLength] = useState(0);
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({ Montserrat_700Bold, Montserrat_400Regular });

  const handleSend = () => {
    if (messageLength > 0 && messageLength <= 1000) {
      const to = ['suporteecouni@gmail.com']; 
      email(to, {
        subject: subject,
        body: message,
      }).then(() => {
        Alert.alert('Sucesso', 'Email enviado com sucesso!');
        setSubject('');
        setMessage('');
        setMessageLength(0);
      }).catch(error => {
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={20} color="#0F334D" />
        </TouchableOpacity>
        <Text style={styles.title}>Contato</Text>
      </View>
      <Text style={styles.label}>Escreva sua mensagem</Text>
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
    marginRight: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 20,
  },
  title: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 22,
    color: '#0F334D',
    marginLeft: 10,
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
