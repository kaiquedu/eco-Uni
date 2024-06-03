import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFonts, Montserrat_700Bold, Montserrat_400Regular } from '@expo-google-fonts/montserrat';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../AuthContext'; // ajuste o caminho conforme necessário

const Opcoes = () => {
  const navigation = useNavigation();
  const { logout, user } = useAuth(); // Acessa o `user` do contexto de autenticação

  const [fontsLoaded] = useFonts({ Montserrat_700Bold, Montserrat_400Regular });

  if (!fontsLoaded) {
    return null;
  }

  console.log("Valor de user:", user); // Adiciona um log para verificar o valor de user

  const handleBack = () => {
    navigation.goBack(); // Função para retornar à tela anterior
  };

  const handleLogout = () => {
    logout();
    navigation.replace('Login'); // Redireciona para a tela de login
  };

  // Adiciona verificação para Cadastrarid
  const Cadastrarid = user ? user.Cadastrarid : null;
  console.log("Valor de Cadastrarid:", Cadastrarid);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Icon name="chevron-left" size={24} color="#0F334D" />
      </TouchableOpacity>
      <Text style={styles.headerText}>O que deseja fazer?</Text>
      <ScrollView contentContainerStyle={styles.optionsContainer}>
        <TouchableOpacity style={styles.optionItem} onPress={() => navigation.navigate('Perfil')}>
          <View>
            <Text style={styles.optionText}>Perfil</Text>
            <Text style={styles.subOptionText}>Editar minhas informações</Text>
          </View>
          <Icon name="chevron-right" size={16} color="#0F334D" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionItem} onPress={() => navigation.navigate('Ajuda')}>
          <View>
            <Text style={styles.optionText}>Ajuda</Text>
            <Text style={styles.subOptionText}>Tire suas dúvidas sobre como utilizar o ecoUni</Text>
          </View>
          <Icon name="chevron-right" size={16} color="#0F334D" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionItem} onPress={() => navigation.navigate('Contato')}>
          <View>
            <Text style={styles.optionText}>Contato</Text>
            <Text style={styles.subOptionText}>Entre em contato para obter suporte</Text>
          </View>
          <Icon name="chevron-right" size={16} color="#0F334D" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionItem} onPress={() => navigation.navigate('Politica')}>
          <Text style={styles.optionText}>Política de privacidade</Text>
          <Icon name="chevron-right" size={16} color="#0F334D" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionItem} onPress={() => navigation.navigate('Termos')}>
          <Text style={styles.optionText}>Termos de uso</Text>
          <Icon name="chevron-right" size={16} color="#0F334D" />
        </TouchableOpacity>
        {/* Usando Cadastrarid somente se user não for nulo */}
        {user && (
          <TouchableOpacity style={styles.optionItem} onPress={handleLogout}>
            <Text style={styles.optionText}>Sair</Text>
            <Icon name="chevron-right" size={16} color="#0F334D" />
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  headerText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
    color: '#0F334D',
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  optionsContainer: {
    paddingBottom: 20,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  optionText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
    color: '#0F334D',
  },
  subOptionText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#7F7F7F',
    marginTop: 2,
  },
});

export default Opcoes;
