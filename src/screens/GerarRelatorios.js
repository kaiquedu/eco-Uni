import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import jsPDF from 'jspdf';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Asset } from 'expo-asset';
import { captureRef } from 'react-native-view-shot';

const GerarRelatorios = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedColetas } = route.params;
  const chartRef = useRef(null);
  const [chartImage, setChartImage] = useState(null);

  const handleBack = () => {
    navigation.goBack();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleGeneratePDF = async () => {
    const doc = new jsPDF();
  
    // Título e imagem
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
  
    // Cabeçalhos da tabela
    doc.setFontSize(14);
    doc.text('Data do Registro', 15, imgHeight + 45);
    doc.text('Tipo de Resíduo', doc.internal.pageSize.width / 2 - 30, imgHeight + 45);
    doc.text('Quantidade (L)', doc.internal.pageSize.width - 50, imgHeight + 45);
  
    // Organizar os dados agrupados por data e tipo de resíduo
    const groupedData = {};
    selectedColetas.forEach(coleta => {
      const data = formatDate(coleta.DataRegistro);
      const tipoResiduo = coleta.TipoResiduo || 'Desconhecido'; // Definir um valor padrão caso o tipo de resíduo esteja undefined
      if (!groupedData[data]) {
        groupedData[data] = {};
      }
      if (!groupedData[data][tipoResiduo]) {
        groupedData[data][tipoResiduo] = 0;
      }
      groupedData[data][tipoResiduo] += coleta.Quantidade * coleta.TamanhoSaco;
    });
  
    // Renderizar os dados agrupados na tabela
    let rowIndex = 1;
    let tableHeight = 0; // Inicializa a altura da tabela
    Object.keys(groupedData).forEach(data => {
      Object.keys(groupedData[data]).forEach(tipoResiduo => {
        const quantidadeLitros = groupedData[data][tipoResiduo].toString();
        const yPosition = imgHeight + 45 + (rowIndex * 10);
        doc.text(data, 15, yPosition);
        doc.text(tipoResiduo, doc.internal.pageSize.width / 2 - 30, yPosition);
        doc.text(quantidadeLitros, doc.internal.pageSize.width - 50, yPosition);
        rowIndex++;
      });
    });
    tableHeight = (rowIndex - 1) * 10 + 20; // Calcula a altura da tabela com base na quantidade de linhas de dados
  
    // Desenhar a tabela ao redor dos dados
    doc.setLineWidth(0.5);
    doc.rect(10, imgHeight + 35, doc.internal.pageSize.width - 20, tableHeight); // Define o retângulo da tabela com a altura calculada
  
    // Rodapé
    const footerText = 'Centro Universitário UNIFAAT - Estr. Mun. Jucá Sanches, 1050 - Boa Vista, Atibaia - SP, 12952-560';
    const footerText2 = '2024 © EcoUni';
    const footerFontSize = 10; // Reduzindo o tamanho da fonte do rodapé
    doc.setFontSize(footerFontSize);
    const footerX = (doc.internal.pageSize.width - doc.getStringUnitWidth(footerText) * footerFontSize / doc.internal.scaleFactor) / 2;
    const footerX2 = (doc.internal.pageSize.width - doc.getStringUnitWidth(footerText2) * footerFontSize / doc.internal.scaleFactor) / 2;
    const footerY = doc.internal.pageSize.height - 10;
    doc.text(footerText, footerX, footerY);
    doc.text(footerText2, footerX2, footerY + 5);
  
    // Filtrar as coletas para selecionar apenas aquelas que têm observações
    const coletasComObservacoes = selectedColetas.filter(coleta => coleta.Observacoes);

    // Adicionar observações apenas se houver coletas com observações
    const observacoesText = coletasComObservacoes.length > 0
      ? coletasComObservacoes.map(coleta => `${formatDate(coleta.DataRegistro)}: ${coleta.Observacoes}`).join('\n')
      : 'Nenhuma observação registrada';

    // Adicionar observações no final do documento
    const observacoesLines = doc.splitTextToSize(observacoesText, doc.internal.pageSize.width - 20);
    const observacoesHeight = observacoesLines.length * 10;
    doc.text(observacoesLines, 10, doc.internal.pageSize.height - observacoesHeight - 20);
  
    // Gerar e salvar o PDF
    const pdfOutput = doc.output('datauristring').split(',')[1];
    const pdfUri = `${FileSystem.documentDirectory}Relatorio_Coletas.pdf`;
    await FileSystem.writeAsStringAsync(pdfUri, pdfOutput, { encoding: FileSystem.EncodingType.Base64 });
  
    const asset = await MediaLibrary.createAssetAsync(pdfUri);
    await MediaLibrary.createAlbumAsync('Download', asset, false);
  
    Alert.alert('PDF Gerado', 'O relatório em PDF foi gerado com sucesso.');
  };
  
  
  

  const processChartData = () => {
    const groupedData = {};

    selectedColetas.forEach(coleta => {
      const date = formatDate(coleta.DataRegistro);
      const quantidadeLitros = coleta.Quantidade * coleta.TamanhoSaco;
      if (!groupedData[date]) {
        groupedData[date] = {};
      }
      if (!groupedData[date][coleta.TipoResiduo]) {
        groupedData[date][coleta.TipoResiduo] = 0;
      }
      groupedData[date][coleta.TipoResiduo] += quantidadeLitros;
    });

    const labels = Object.keys(groupedData);
    const datasets = [];

    const typesOfWaste = [...new Set(selectedColetas.map(coleta => coleta.TipoResiduo))];
    const colors = ['#F0B828', '#668CF0', '#000000', '#4BC0C0', '#9966FF'];

    typesOfWaste.forEach((type, index) => {
      const data = labels.map(date => groupedData[date][type] || 0);
      datasets.push({
        data,
        color: (opacity = 1) => colors[index % colors.length],
        strokeWidth: 2,
        label: type,
      });
    });

    return { labels, datasets };
  };

  const chartData = processChartData();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Icon name="chevron-left" size={24} color="#0F334D" />
      </TouchableOpacity>
      <Text style={styles.headerText}>Gerar Relatório</Text>

      <View style={styles.chartContainer}>
        <LineChart
          data={chartData}
          width={350}
          height={220}
          yAxisSuffix="L"
          chartConfig={{
            backgroundGradientFrom: '#FFFFFF',
            backgroundGradientTo: '#FFFFFF',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
          ref={chartRef}
        />
      </View>
      <View style={styles.legendContainer}>
        {chartData.datasets.map((dataset, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: dataset.color() }]} />
            <Text style={styles.legendText}>{dataset.label}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.generateButton} onPress={handleGeneratePDF}>
        <Text style={styles.buttonText}>Gerar PDF</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 40,
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
  chartContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#0F334D',
  },
  captureButton: {
    backgroundColor: '#FFA500',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  generateButton: {
    backgroundColor: '#0F334D',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default GerarRelatorios;
