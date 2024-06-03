import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useFonts, Montserrat_700Bold, Montserrat_400Regular } from '@expo-google-fonts/montserrat';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Termos = () => {
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
    Montserrat_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#0F334D" />
      </TouchableOpacity>
      <Text style={styles.header}>Termos e Condições</Text>
      <ScrollView style={styles.content}>
        <Text style={styles.text}>
          Bem-vindo aos Termos e Condições do EcoUni. Ao utilizar nossa aplicação móvel, você concorda com os seguintes termos e condições:
        </Text>
        <Text style={styles.subHeader}>1. Uso da Aplicação Móvel:</Text>
        <Text style={styles.text}>
          1.1. A aplicação móvel é destinada aos alunos, funcionários e demais membros da comunidade do Centro Universitário.
          {"\n"}1.2. Você concorda em utilizar a aplicação móvel apenas para fins educacionais e administrativos relacionados ao Centro Universitário.
        </Text>
        <Text style={styles.subHeader}>2. Conta de Usuário:</Text>
        <Text style={styles.text}>
          2.1. Você pode precisar criar uma conta de usuário para acessar determinadas funcionalidades da aplicação móvel.
          {"\n"}2.2. Você é responsável por manter a confidencialidade de suas credenciais de login e por todas as atividades que ocorram em sua conta.
        </Text>
        <Text style={styles.subHeader}>3. Privacidade e Proteção de Dados:</Text>
        <Text style={styles.text}>
          3.1. Ao utilizar a aplicação móvel, você concorda com a nossa Política de Privacidade, que descreve como coletamos, usamos e protegemos suas informações pessoais.
          {"\n"}3.2. Respeitamos sua privacidade e tomamos medidas para garantir a segurança de suas informações.
        </Text>
        <Text style={styles.subHeader}>4. Propriedade Intelectual:</Text>
        <Text style={styles.text}>
          4.1. Todo o conteúdo disponibilizado na aplicação móvel, incluindo textos, imagens, vídeos, logotipos e marcas registradas, é de propriedade do Centro Universitário ou de seus licenciadores.
          {"\n"}4.2. Você concorda em não reproduzir, distribuir ou modificar qualquer conteúdo da aplicação móvel sem autorização prévia por escrito.
        </Text>
        <Text style={styles.subHeader}>5. Responsabilidade:</Text>
        <Text style={styles.text}>
          5.1. O Centro Universitário não se responsabiliza por quaisquer danos diretos, indiretos, incidentais, especiais ou consequentes decorrentes do uso ou da incapacidade de usar a aplicação móvel.
          {"\n"}5.2. Você concorda em utilizar a aplicação móvel por sua própria conta e risco.
        </Text>
        <Text style={styles.subHeader}>6. Modificações dos Termos e Condições:</Text>
        <Text style={styles.text}>
          6.1. O Centro Universitário se reserva o direito de modificar estes Termos e Condições a qualquer momento, mediante aviso prévio.
          {"\n"}6.2. O seu uso contínuo da aplicação móvel após a modificação dos Termos e Condições constitui sua aceitação das alterações.
        </Text>
        <Text style={styles.subHeader}>7. Lei Aplicável:</Text>
        <Text style={styles.text}>
          7.1. Estes Termos e Condições são regidos pelas leis do Brasil.
          {"\n"}7.2. Qualquer disputa decorrente destes Termos e Condições será submetida à jurisdição exclusiva dos tribunais localizados no Brasil.
        </Text>
        <Text style={styles.text}>
          Ao utilizar o EcoUni, você concorda em cumprir estes Termos e Condições. Se você não concorda com estes termos, por favor, não utilize a aplicação móvel.
        </Text>
        <Text style={styles.text}>
          Última atualização: 28/05/2024.
        </Text>
      </ScrollView>
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
  content: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    fontFamily: 'Montserrat_400Regular',
    color: '#0F334D',
    lineHeight: 24,
  },
  subHeader: {
    fontSize: 18,
    fontFamily: 'Montserrat_700Bold',
    color: '#0F334D',
    marginTop: 20,
  },
});

export default Termos;
