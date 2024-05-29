import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../AuthContext';
import Icon from 'react-native-vector-icons/FontAwesome';

const Perfil = () => {
  const { user, updateUser } = useAuth();
  const navigation = useNavigation();
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://192.168.1.18:5000/api/auth/user/${user.Cadastrarid}`, {
        headers: {
          Authorization: `Bearer ${user.Token}`
        }
      });
      const userData = response.data;
      console.log('Dados do usuário recuperados:', userData);
      setNome(userData.Nome);
      setTelefone(userData.Telefone);
      setEmail(userData.Email);
      setSenha(userData.Senha);
      setConfirmarSenha(userData.ConfirmarSenha);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Erro ao buscar dados do usuário:', error);
      // Tratar erros adequadamente
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await axios.put(`http://192.168.1.18:5000/api/auth/user/${user.Cadastrarid}`, {
        Nome: nome,
        Telefone: telefone,
        Email: email,
        Senha: senha,
        ConfirmarSenha: confirmarSenha
      }, {
        headers: {
          Authorization: `Bearer ${user.Token}`
        }
      });
      console.log('Perfil atualizado com sucesso!');
      setLoading(false);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso');
      // Atualizar os dados do usuário localmente após a atualização
      updateUser({ ...user, Nome: nome, Telefone: telefone, Email: email });
    } catch (error) {
      setLoading(false);
      console.error('Erro ao atualizar perfil:', error);
      // Tratar erros adequadamente
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Icon name="chevron-left" size={24} color="#0F334D" />
      </TouchableOpacity>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Text style={styles.profileImageText}>{nome.charAt(0)}</Text>
        </View>
        <Text style={styles.profileName}>{nome}</Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
        />
        <Text style={styles.label}>Telefone</Text>
        <TextInput
          style={styles.input}
          value={telefone}
          onChangeText={setTelefone}
          keyboardType="phone-pad"
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />
        <Text style={styles.label}>Confirmar Senha</Text>
        <TextInput
          style={styles.input}
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          secureTextEntry
        />
      </View>
      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonCancel} onPress={handleCancel}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonConfirm} onPress={handleSubmit} disabled={isLoading}>
          <Text style={styles.buttonText}>Confirmar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImageContainer: {
    backgroundColor: '#00ADEF',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImageText: {
    color: '#fff',
    fontSize: 40,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  form: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonCancel: {
    backgroundColor: '#ccc',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  buttonConfirm: {
    backgroundColor: '#0F334D',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Perfil;
