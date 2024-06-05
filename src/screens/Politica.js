import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useFonts, Montserrat_700Bold, Montserrat_400Regular } from '@expo-google-fonts/montserrat';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const Politica = () => {
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={20} color="#0F334D" />
        </TouchableOpacity>
        <Text style={styles.title}>Política de Privacidade</Text>
      </View>
      <ScrollView style={styles.content}>
        <Text style={styles.text}>
          Esta Política de Privacidade descreve como o Centro Universitário coleta, usa e protege as informações pessoais dos usuários de sua aplicação móvel. Ao utilizar nossa aplicação móvel, você concorda com os termos descritos nesta política.
        </Text>
        <Text style={styles.subHeader}>Informações Coletadas:</Text>
        <Text style={styles.text}>
          <Text style={styles.bold}>Informações de Registro:</Text> Podemos coletar informações de registro quando você cria uma conta na aplicação móvel, incluindo seu nome, endereço de e-mail, senha e outras informações de contato.
        </Text>
        <Text style={styles.text}>
          <Text style={styles.bold}>Informações de Uso:</Text> Podemos registrar informações sobre como você utiliza a aplicação móvel, como suas interações com as funcionalidades oferecidas.
        </Text>
        <Text style={styles.text}>
          <Text style={styles.bold}>Informações de Dispositivo:</Text> Podemos coletar informações sobre o dispositivo móvel que você utiliza para acessar a aplicação, incluindo o modelo do dispositivo, sistema operacional, identificadores únicos do dispositivo e informações de rede.
        </Text>
        <Text style={styles.subHeader}>Uso das Informações:</Text>
        <Text style={styles.text}>
          Utilizamos as informações coletadas para fornecer, manter, proteger e melhorar a aplicação móvel do Centro Universitário.
        </Text>
        <Text style={styles.text}>
          Podemos utilizar as informações para personalizar sua experiência na aplicação móvel e para enviar comunicações relacionadas aos serviços oferecidos pelo Centro Universitário.
        </Text>
        <Text style={styles.subHeader}>Compartilhamento de Informações:</Text>
        <Text style={styles.text}>
          Não compartilhamos suas informações pessoais com terceiros, exceto quando necessário para fornecer os serviços da aplicação móvel ou quando exigido por lei.
        </Text>
        <Text style={styles.text}>
          Podemos compartilhar informações agregadas ou anonimizadas que não identifiquem pessoalmente os usuários da aplicação móvel.
        </Text>
        <Text style={styles.subHeader}>Proteção de Dados:</Text>
        <Text style={styles.text}>
          Implementamos medidas de segurança adequadas para proteger as informações pessoais dos usuários contra acesso não autorizado, alteração, divulgação ou destruição.
        </Text>
        <Text style={styles.text}>
          No entanto, nenhum método de transmissão pela internet ou método de armazenamento eletrônico é 100% seguro, e não podemos garantir a segurança absoluta das informações transmitidas através da aplicação móvel.
        </Text>
        <Text style={styles.subHeader}>Privacidade das Crianças:</Text>
        <Text style={styles.text}>
          Nossa aplicação móvel não se destina a crianças menores de 13 anos, e não coletamos intencionalmente informações pessoais de crianças menores de 13 anos. Se você é pai ou responsável e acredita que seu filho nos forneceu informações pessoais, entre em contato conosco para que possamos remover essas informações.
        </Text>
        <Text style={styles.subHeader}>Alterações nesta Política:</Text>
        <Text style={styles.text}>
          Podemos atualizar esta Política de Privacidade periodicamente, e quaisquer alterações serão publicadas nesta página.
        </Text>
        <Text style={styles.text}>
          Recomendamos que você revise esta Política de Privacidade regularmente para estar ciente de quaisquer alterações.
        </Text>
        <Text style={styles.subHeader}>Contato:</Text>
        <Text style={styles.text}>
          Se você tiver dúvidas ou preocupações sobre esta Política de Privacidade ou sobre o uso de suas informações pessoais, entre em contato conosco através dos canais de comunicação disponíveis na aplicação móvel.
        </Text>
        <Text style={styles.text}>
          Esta Política de Privacidade foi atualizada pela última vez em 28/05/2024.
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
  bold: {
    fontFamily: 'Montserrat_700Bold',
  },
});

export default Politica;
