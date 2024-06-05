import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFonts, Montserrat_700Bold } from '@expo-google-fonts/montserrat';

const Ajuda = () => {
  const [expanded, setExpanded] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({ Montserrat_700Bold });

  if (!fontsLoaded) {
    return null; 
  }

  const handlePress = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  const helpItems = [
    { title: 'Como cadastrar coleta?', content: 'Clique no botão " + " e selecione o tipo de resíduo que será cadastrado. Selecione o tamanho do saco, a quantidade e observação (caso haja). Clique em "CADASTRAR" e está feito.' },
    { title: 'Como emitir relatório?', content: 'Para emitir um relatório clique em "RELATÓRIOS", selecione as datas para serem emitidas e vá para a próxima página. Clique em "Gerar PDF" e o arquivo estará salvo na pasta "Documentos" do aparelho móvel.' },
    { title: 'Como editar coleta?', content: 'Clique em "Ver Histórico", selecione a coleta para ser editada e clique em "SALVAR".' },
    { title: 'Como excluir coleta?', content: 'Clique em "Ver Histórico", selecione a coleta para ser excluída e clique em "EXCLUIR".' },
  ];

  const filteredHelpItems = helpItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={20} color="#0F334D" />
        </TouchableOpacity>
        <Text style={styles.title}>Ajuda</Text>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar artigos de ajuda"
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
        />
        <Icon name="search" size={20} color="#000" style={styles.searchIcon} />
      </View>
      <ScrollView style={styles.scrollView}>
        {filteredHelpItems.map((item, index) => (
          <View key={index} style={styles.item}>
            <TouchableOpacity onPress={() => handlePress(index)} style={styles.itemHeader}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Icon name={expanded === index ? "chevron-up" : "chevron-down"} size={24} color="#000" />
            </TouchableOpacity>
            {expanded === index && (
              <View style={styles.itemContent}>
                <Text style={styles.itemText}>{item.content}</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
      <Text style={styles.notFoundText}>Não encontrou o que procurava?</Text>
      <Text style={styles.contactText}>
        Clique <Text style={styles.contactLink} onPress={() => navigation.navigate('Contato')}>aqui</Text> para entrar em contato.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
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
  backButton: {
    marginRight: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontFamily: 'Montserrat_700Bold',
  },
  searchIcon: {
    marginLeft: 10,
  },
  scrollView: {
    flex: 1,
  },
  item: {
    marginBottom: 10,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat_700Bold',
    color: '#0F334D',
  },
  itemContent: {
    paddingVertical: 10,
  },
  itemText: {
    fontFamily: 'Montserrat_400Regular',
  },
  notFoundText: {
    fontSize: 16,
    fontFamily: 'Montserrat_700Bold',
    color: '#0F334D',
    marginTop: 20,
    marginBottom: 10,
  },
  contactText: {
    fontSize: 16,
    fontFamily: 'Montserrat_400Regular',
    color: '#0F334D',
  },
  contactLink: {
    textDecorationLine: 'underline',
    color: '#007BFF',
  },
});

export default Ajuda;
