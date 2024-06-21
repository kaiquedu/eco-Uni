import { View, Text, TouchableOpacity, StyleSheet, Alert, Modal, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import jsPDF from 'jspdf';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Asset } from 'expo-asset';
import React, { useRef, useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

const GerarRelatorios = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedColetas } = route.params;
  const chartRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewType, setViewType] = useState('day');

  const handleBack = () => {
    navigation.goBack();
  };

  const [mediaLibraryPermission, setMediaLibraryPermission] = useState(null);

  useEffect(() => {
    const getPermission = async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setMediaLibraryPermission(status === 'granted');
    };

    getPermission();
  }, []);

  if (mediaLibraryPermission === null) {
    return null; 
  }

  if (!mediaLibraryPermission) {
    return (
      <View style={styles.container}>
        <Text>Você precisa permitir acesso à biblioteca de mídia para gerar o PDF.</Text>
      </View>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatMonthYear = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${year}`;
  };

  const generatePDF = async (groupedData, isMonthly) => {
    const doc = new jsPDF();

    const imgPath = require('../assets/images/ecouni.png');
    const imgAsset = Asset.fromModule(imgPath);
    await imgAsset.downloadAsync();
    const imgWidth = 50;
    const imgHeight = (imgAsset.height * imgWidth) / imgAsset.width;
    const imgData = `data:image/png;base64,${await FileSystem.readAsStringAsync(imgAsset.localUri, {
      encoding: FileSystem.EncodingType.Base64,
    })}`;
    doc.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);

    doc.setFontSize(18);
    doc.text('Relatório de Registro das Coletas', doc.internal.pageSize.width / 2, imgHeight + 20, { align: 'center' });

    doc.setFontSize(14);
    doc.text('Data do Registro', 15, imgHeight + 45);
    doc.text('Tipo de Resíduo', doc.internal.pageSize.width / 2 - 30, imgHeight + 45);
    doc.text('Quantidade (L)', doc.internal.pageSize.width - 50, imgHeight + 45);

    let rowIndex = 1;
    let tableHeight = 0;
    Object.keys(groupedData).sort((a, b) => {
      const [dayA, monthA, yearA] = a.split('/').map(Number);
      const [dayB, monthB, yearB] = b.split('/').map(Number);
      return new Date(yearA, monthA - 1, dayA) - new Date(yearB, monthB - 1, dayB);
    }).forEach(data => {
      Object.keys(groupedData[data]).forEach(tipoResiduo => {
        const quantidadeLitros = groupedData[data][tipoResiduo].toString();
        const yPosition = imgHeight + 45 + (rowIndex * 10);
        doc.text(data, 15, yPosition);
        doc.text(tipoResiduo, doc.internal.pageSize.width / 2 - 30, yPosition);
        doc.text(quantidadeLitros, doc.internal.pageSize.width - 50, yPosition);
        rowIndex++;
      });
    });
    tableHeight = (rowIndex - 1) * 10 + 20;

    doc.setLineWidth(0.5);
    doc.rect(10, imgHeight + 35, doc.internal.pageSize.width - 20, tableHeight);

    const footerText = 'Centro Universitário UNIFAAT - Estr. Mun. Jucá Sanches, 1050 - Boa Vista, Atibaia - SP, 12952-560';
    const footerText2 = '2024 © EcoUni';
    const footerFontSize = 10;
    doc.setFontSize(footerFontSize);
    const footerX = (doc.internal.pageSize.width - doc.getStringUnitWidth(footerText) * footerFontSize / doc.internal.scaleFactor) / 2;
    const footerX2 = (doc.internal.pageSize.width - doc.getStringUnitWidth(footerText2) * footerFontSize / doc.internal.scaleFactor) / 2;
    const footerY = doc.internal.pageSize.height - 10;
    doc.text(footerText, footerX, footerY);
    doc.text(footerText2, footerX2, footerY + 5);

    const coletasComObservacoes = selectedColetas.filter(coleta => coleta.Observacoes);
    const observacoesText = coletasComObservacoes.length > 0
      ? coletasComObservacoes.map(coleta => `${formatDate(coleta.DataRegistro)}: ${coleta.Observacoes}`).join('\n')
      : 'Nenhuma observação registrada';
    const observacoesLines = doc.splitTextToSize(observacoesText, doc.internal.pageSize.width - 20);
    const observacoesHeight = observacoesLines.length * 10;
    doc.text(observacoesLines, 10, doc.internal.pageSize.height - observacoesHeight - 20);

    const pdfOutput = doc.output('datauristring').split(',')[1];
    const pdfUri = `${FileSystem.documentDirectory}Relatorio_Coletas.pdf`;
    await FileSystem.writeAsStringAsync(pdfUri, pdfOutput, { encoding: FileSystem.EncodingType.Base64 });

    const asset = await MediaLibrary.createAssetAsync(pdfUri);
    await MediaLibrary.createAlbumAsync('Download', asset, false);

    Alert.alert('PDF Gerado', 'O relatório em PDF foi gerado com sucesso.');
  };

  const handleGeneratePDFPorDia = async () => {
    const groupedData = {};

    selectedColetas.forEach(coleta => {
      const data = formatDate(coleta.DataRegistro);
      const tipoResiduo = coleta.TipoResiduo || 'Desconhecido';
      if (!groupedData[data]) {
        groupedData[data] = {};
      }
      if (!groupedData[data][tipoResiduo]) {
        groupedData[data][tipoResiduo] = 0;
      }
      groupedData[data][tipoResiduo] += coleta.Quantidade * coleta.TamanhoSaco;
    });

    await generatePDF(groupedData, false);
  };

  const handleGeneratePDFPorMes = async () => {
    const groupedData = {};

    selectedColetas.forEach(coleta => {
      const data = formatMonthYear(coleta.DataRegistro);
      const tipoResiduo = coleta.TipoResiduo || 'Desconhecido';
      if (!groupedData[data]) {
        groupedData[data] = {};
      }
      if (!groupedData[data][tipoResiduo]) {
        groupedData[data][tipoResiduo] = 0;
      }
      groupedData[data][tipoResiduo] += coleta.Quantidade * coleta.TamanhoSaco;
    });

    await generatePDF(groupedData, true);
  };

  const processChartData = () => {
    const groupedData = {};

    selectedColetas.forEach(coleta => {
      const date = viewType === 'day' ? formatDate(coleta.DataRegistro) : formatMonthYear(coleta.DataRegistro);
      const quantidadeLitros = coleta.Quantidade * coleta.TamanhoSaco;
      if (!groupedData[date]) {
        groupedData[date] = {};
      }
      if (!groupedData[date][coleta.TipoResiduo]) {
        groupedData[date][coleta.TipoResiduo] = 0;
      }
      groupedData[date][coleta.TipoResiduo] += quantidadeLitros;
    });

    const labels = Object.keys(groupedData).sort((a, b) => {
      const [dayA, monthA, yearA] = a.split('/').map(Number);
      const [dayB, monthB, yearB] = b.split('/').map(Number);
      return new Date(yearA, monthA - 1, dayA) - new Date(yearB, monthB - 1, dayB);
    });

    const datasets = [];

    const tipoResiduos = Array.from(new Set(selectedColetas.map(coleta => coleta.TipoResiduo)));
    const cores = {
      'Material Reciclável': '#F0B828',
      'Material Não Reciclável': '#000000',
      'Papel Reciclável': '#668CF0',
    };
    tipoResiduos.forEach(tipoResiduo => {
      const data = labels.map(label => groupedData[label][tipoResiduo] || 0);
      const color = cores[tipoResiduo] || '#000000';
      datasets.push({
        data,
        color: () => color,
        name: tipoResiduo,
      });
    });

    return { labels, datasets };
  };

  const chartData = processChartData();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-left" size={20} color="#0F334D" />
      </TouchableOpacity>
      <View style={styles.chartContainer} ref={chartRef}>
        <LineChart
          data={chartData}
          width={350}
          height={350}
          chartConfig={{
            backgroundColor: '#FFFFFF',
            backgroundGradientFrom: '#FFFFFF',
            backgroundGradientTo: '#FFFFFF',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '5',
              strokeWidth: '10',
            },
            propsForLabels: {
              fontFamily: 'Montserrat_700Bold',
              fontSize: 12,
              rotation: 0,
              textAnchor: 'end',
            },
            propsForVerticalLabels: {
              fontFamily: 'Montserrat_700Bold',
              fontSize: 10,
              rotation: -45,
              textAnchor: 'end',
            },
          }}
          style={{
            paddingTop: 10,
            marginVertical: 5,
            borderRadius: 16,
          }}
          bezier
          fromZero
          withInnerLines={false}
        />
      </View>
      <View style={styles.legendContainer}>
        {chartData.datasets.map((dataset, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: dataset.color() }]} />
            <Text style={styles.legendText}>{dataset.name}</Text>
          </View>
        ))}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.buttonText}>Gerar Relatório em PDF</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Exibição por:</Text>
        <View style={styles.viewTypeButtons}>
          <TouchableOpacity
            style={[styles.viewTypeButton, viewType === 'day' && styles.selectedViewTypeButton]}
            onPress={() => setViewType('day')}
          >
            <Text style={styles.viewTypeButtonText}>Dia</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewTypeButton, viewType === 'month' && styles.selectedViewTypeButton]}
            onPress={() => setViewType('month')}
          >
            <Text style={styles.viewTypeButtonText}>Mês</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Escolha uma opção:</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleGeneratePDFPorDia}
            >
              <Text style={styles.modalButtonText}>Relatório por Dia</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleGeneratePDFPorMes}
            >
              <Text style={styles.modalButtonText}>Relatório por Mês</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: 'red' }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
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
    paddingTop: 20,
    position: 'absolute',
    top: 20,
    left: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#0F334D',
    paddingHorizontal: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 10,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 20,
    marginTop: 100,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 5,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 5,
  },
  legendText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
  },
  buttonContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#0F334D',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontFamily: 'Montserrat_700Bold',
    color: '#FFFFFF',
    fontSize: 16,
  },
  footer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  footerText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
    marginBottom: 10,
  },
  viewTypeButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  viewTypeButton: {
    backgroundColor: '#0F334D',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  selectedViewTypeButton: {
    backgroundColor: '#0C2534',
  },
  viewTypeButtonText: {
    fontFamily: 'Montserrat_700Bold',
    color: '#FFFFFF',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#0F334D',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    fontFamily: 'Montserrat_700Bold',
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default GerarRelatorios;
