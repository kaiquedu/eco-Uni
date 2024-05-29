import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFonts, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import * as Animatable from 'react-native-animatable';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../AuthContext';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const HomeApp = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [coletas, setColetas] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://192.168.1.18:5000/api/coleta/ObterColetas/${user.Cadastrarid}`);
      if (response.ok) {
        const data = await response.json();
        // Ordenar coletas em ordem decrescente de data
        data.sort((a, b) => new Date(b.DataRegistro) - new Date(a.DataRegistro));
        setColetas(data.slice(0, 10)); // Pegando as últimas 10 coletas
      } else {
        console.error('Falha ao buscar coletas');
      }
    } catch (error) {
      console.error('Erro ao buscar coletas:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [user.Cadastrarid]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const [fontsLoaded] = useFonts({ Montserrat_700Bold });
  const [showAdditionalIcons, setShowAdditionalIcons] = useState(false);

  if (!fontsLoaded || loading) {
    return null;
  }

  const formatarDataHora = (data) => {
    const dataObj = new Date(data);
    if (isNaN(dataObj.getTime())) {
      return "Data Inválida";
    }
    return dataObj.toLocaleDateString('pt-BR') + ' às ' + dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Olá, {user.Nome}</Text>
      </View>
      <ScrollView style={styles.containerSection}>
        <View style={styles.sectionHeader}>
          <Icon name="clock-o" size={24} color="#0F334D" />
          <Text style={styles.sectionTitle}>Últimas coletas realizadas</Text>
        </View>
        {coletas.map((coleta, index) => (
          <View key={index} style={styles.coletaItem}>
            <Text style={styles.coletaText}>
              {formatarDataHora(coleta.DataRegistro)}
            </Text>
            <Text style={styles.coletaQuantidade}>
              {coleta.TamanhoSaco * coleta.Quantidade}L de {coleta.TipoResiduo}
            </Text>
          </View>
        ))}
        <TouchableOpacity style={styles.verHistoricoButton} onPress={() => navigation.navigate('Historico')}>
          <Text style={styles.verHistoricoText}>Ver Histórico</Text>
          <Icon name="arrow-right" size={16} color="#0F334D" />
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="home" size={26} color="#0F334D" />
          <Text style={styles.iconText}>Início</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Relatorios')}>
          <Icon name="table" size={26} color="#0F334D" />
          <Text style={styles.iconText}>Relatório</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.centerButton} onPress={() => setShowAdditionalIcons(!showAdditionalIcons)}>
          <Icon name="plus" size={24} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Opcoes')}>
          <Icon name="cog" size={26} color="#0F334D" />
          <Text style={styles.iconText}>Opções</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Perfil')}>
          <Icon name="user" size={26} color="#0F334D" />
          <Text style={styles.iconText}>Perfil</Text>
        </TouchableOpacity>
      </View>

      {showAdditionalIcons && (
        <Animatable.View animation="slideInUp" style={styles.additionalIconsContainer}>
          <TouchableOpacity style={[styles.additionalIconButton, { backgroundColor: '#F0B828' }]} onPress={() => navigation.navigate('RegistroColetaReciclavel')}>
            <Icon name="recycle" size={24} color="#0F334D" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.additionalIconButton, { backgroundColor: '#000' }]} onPress={() => navigation.navigate('RegistroColetaNaoReciclavel')}>
            <Icon name="trash" size={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.additionalIconButton, { backgroundColor: '#668CF0' }]} onPress={() => navigation.navigate('RegistroColetaPapelReciclavel')}>
            <Icon name="file" size={24} color="#0F334D" />
          </TouchableOpacity>
        </Animatable.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
  },
  headerText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
    color: '#0F334D',
    marginBottom: 20,
  },
  containerSection: {
    backgroundColor: '#F0F0F0',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
    color: '#0F334D',
    marginLeft: 10,
  },
  coletaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  coletaText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#0F334D',
    flex: 1,
  },
  coletaQuantidade: {
    fontFamily: 'Montserrat_700Bold',
    textAlign: 'right',
  },
  verHistoricoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'center',
  },
  verHistoricoText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    color: '#0F334D',
    marginRight: 5,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  iconButton: {
    alignItems: 'center',
    width: '20%',
  },
  iconText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 12,
    color: '#0F334D',
    marginTop: 5,
  },
  centerButton: {
    alignItems: 'center',
    backgroundColor: '#0F334D',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
  },
  additionalIconsContainer: {
    position: 'absolute',
    bottom: 70,
    alignSelf: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  additionalIconButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
});

export default HomeApp;