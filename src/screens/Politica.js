import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useFonts, Montserrat_700Bold, Montserrat_400Regular } from '@expo-google-fonts/montserrat';
import { Ionicons } from '@expo/vector-icons';
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
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#0F334D" />
      </TouchableOpacity>
      <Text style={styles.header}>Política de Privacidade</Text>
      <ScrollView style={styles.content}>
        <Text style={styles.text}>
        Esta Política de Privacidade descreve como o Centro Universitário coleta, usa e protege as informações pessoais dos usuários de sua aplicação móvel. Ao utilizar nossa aplicação móvel, você concorda com os termos descritos nesta política.

        Informações Coletadas:

        Informações de Registro: Podemos coletar informações de registro quando você cria uma conta na aplicação móvel, incluindo seu nome, endereço de e-mail, senha e outras informações de contato.
        Informações de Uso: Podemos registrar informações sobre como você utiliza a aplicação móvel, como suas interações com as funcionalidades oferecidas.
        Informações de Dispositivo: Podemos coletar informações sobre o dispositivo móvel que você utiliza para acessar a aplicação, incluindo o modelo do dispositivo, sistema operacional, identificadores únicos do dispositivo e informações de rede.
        Uso das Informações:

        Utilizamos as informações coletadas para fornecer, manter, proteger e melhorar a aplicação móvel do Centro Universitário.
        Podemos utilizar as informações para personalizar sua experiência na aplicação móvel e para enviar comunicações relacionadas aos serviços oferecidos pelo Centro Universitário.
        Compartilhamento de Informações:

        Não compartilhamos suas informações pessoais com terceiros, exceto quando necessário para fornecer os serviços da aplicação móvel ou quando exigido por lei.
        Podemos compartilhar informações agregadas ou anonimizadas que não identifiquem pessoalmente os usuários da aplicação móvel.
        Proteção de Dados:

        Implementamos medidas de segurança adequadas para proteger as informações pessoais dos usuários contra acesso não autorizado, alteração, divulgação ou destruição.
        No entanto, nenhum método de transmissão pela internet ou método de armazenamento eletrônico é 100% seguro, e não podemos garantir a segurança absoluta das informações transmitidas através da aplicação móvel.
        Privacidade das Crianças:

        Nossa aplicação móvel não se destina a crianças menores de 13 anos, e não coletamos intencionalmente informações pessoais de crianças menores de 13 anos. Se você é pai ou responsável e acredita que seu filho nos forneceu informações pessoais, entre em contato conosco para que possamos remover essas informações.
        Alterações nesta Política:

        Podemos atualizar esta Política de Privacidade periodicamente, e quaisquer alterações serão publicadas nesta página.
        Recomendamos que você revise esta Política de Privacidade regularmente para estar ciente de quaisquer alterações.
        Contato:

        Se você tiver dúvidas ou preocupações sobre esta Política de Privacidade ou sobre o uso de suas informações pessoais, entre em contato conosco através dos canais de comunicação disponíveis na aplicação móvel.
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
});

export default Politica;
