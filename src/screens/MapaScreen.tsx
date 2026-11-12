import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useRecicla } from '../hooks/useReciclaContext';
import { PontoColeta, RootStackParamList } from '../types';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Header } from '../components/Header';

const POSICOES_PINOS = [
  { top: '42%', left: '46%', cor: '#F59E0B', bairroLabel: 'Centro' },
  { top: '24%', left: '28%', cor: '#2563EB', bairroLabel: 'Jd. Bandeiras' },
  { top: '62%', right: '24%', cor: '#DC2626', bairroLabel: 'Jd. Paulista' },
  { top: '22%', right: '22%', cor: '#059669', bairroLabel: 'Vila Califórnia' },
  { top: '54%', left: '20%', cor: '#7C3AED', bairroLabel: 'Jd. Alvorada' },
  { top: '72%', left: '42%', cor: '#D97706', bairroLabel: 'Santa Mônica' },
];

export function MapaScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { pontos } = useRecicla();
  const [pontoSelecionado, setPontoSelecionado] = useState<PontoColeta | null>(pontos);
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F6F8' }}>
      <Header />
      <ScreenWrapper>
        <View style={styles.container}>
          <Text style={styles.title}>Mapa dos Ecopostos</Text>
          <Text style={styles.subtitle}>Osvaldo Cruz - SP • Toque em um marcador para ver</Text>

          <View style={[styles.mapFrame, isDesktop && { height: 480 }]}>
            {/* Ruas e áreas verdes simulando o traçado de Osvaldo Cruz */}
            <View style={styles.parkArea} />
            <View style={styles.roadHorizontal} />
            <View style={styles.roadVertical} />
            <View style={styles.roadDiagonal} />

            {/* Rótulo da Avenida Principal */}
            <View style={styles.avenueTag}>
              <Text style={styles.avenueText}>Av. Pres. Vargas • Osvaldo Cruz</Text>
            </View>

            {/* Marcadores dos 6 bairros de Osvaldo Cruz */}
            {pontos.map((ponto, index) => {
              const pos = POSICOES_PINOS[index % POSICOES_PINOS.length];
              const ativo = pontoSelecionado?.id === ponto.id;

              return (
                <TouchableOpacity
                  key={ponto.id}
                  style={[
                    styles.pin,
                    { top: pos.top as any, left: pos.left as any, right: pos.right as any },
                    ativo && styles.pinActive,
                  ]}
                  onPress={() => setPontoSelecionado(ponto)}
                >
                  <Ionicons name="location" size={ativo ? 44 : 34} color={pos.cor} />
                  <View style={styles.pinBadge}>
                    <Text style={styles.pinBadgeText}>{pos.bairroLabel}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}

            {/* Card Amarelo Resumo */}
            {pontoSelecionado && (
              <View style={[styles.resumoCard, isDesktop && styles.resumoCardDesktop]}>
                <TouchableOpacity
                  style={styles.closeResumo}
                  onPress={() => setPontoSelecionado(null)}
                >
                  <Ionicons name="close-circle" size={22} color="#111" />
                </TouchableOpacity>

                <Image source={{ uri: pontoSelecionado.imagemUri }} style={styles.resumoImg} />
                <Text style={styles.resumoTitle}>{pontoSelecionado.nome}</Text>
                <Text style={styles.resumoBadge}>{pontoSelecionado.categoria}</Text>
                <Text style={styles.resumoDesc}>{pontoSelecionado.endereco}</Text>
                <Text style={styles.resumoBairro}>{pontoSelecionado.bairro}</Text>

                <TouchableOpacity
                  style={styles.verMaisBtn}
                  onPress={() =>
                    navigation.navigate('DetalhesEcoponto', { ponto: pontoSelecionado })
                  }
                >
                  <Text style={styles.verMaisText}>Abrir Detalhes</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScreenWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 13,
    color: '#4B5563',
    marginBottom: 16,
  },
  mapFrame: {
    width: '100%',
    height: 410,
    backgroundColor: '#E5E7EB',
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#1E88E5',
    overflow: 'hidden',
    position: 'relative',
  },
  parkArea: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    width: 150,
    height: 110,
    backgroundColor: '#BBF7D0',
    borderRadius: 40,
  },
  roadHorizontal: {
    position: 'absolute',
    top: '48%',
    width: '100%',
    height: 16,
    backgroundColor: '#FDE68A',
  },
  roadVertical: {
    position: 'absolute',
    left: '48%',
    height: '100%',
    width: 14,
    backgroundColor: '#FFFFFF',
  },
  roadDiagonal: {
    position: 'absolute',
    top: '25%',
    width: '120%',
    height: 10,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '22deg' }],
  },
  avenueTag: {
    position: 'absolute',
    top: 14,
    left: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  avenueText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#374151',
  },
  pin: {
    position: 'absolute',
    alignItems: 'center',
  },
  pinActive: {
    transform: [{ scale: 1.12 }],
    zIndex: 10,
  },
  pinBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    elevation: 2,
  },
  pinBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#111827',
  },
  resumoCard: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    width: 205,
    backgroundColor: '#FCD34D',
    borderRadius: 22,
    padding: 12,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    zIndex: 20,
  },
  resumoCardDesktop: {
    width: 245,
    top: 20,
    bottom: 'auto',
    right: 20,
  },
  closeResumo: {
    alignSelf: 'flex-end',
  },
  resumoImg: {
    width: '100%',
    height: 72,
    borderRadius: 12,
    marginBottom: 6,
  },
  resumoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#111',
  },
  resumoBadge: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#046A38',
    marginTop: 2,
  },
  resumoDesc: {
    fontSize: 11,
    textAlign: 'center',
    color: '#333',
    marginTop: 2,
  },
  resumoBairro: {
    fontSize: 10,
    textAlign: 'center',
    color: '#4B5563',
    fontWeight: '600',
  },
  verMaisBtn: {
    marginTop: 8,
    backgroundColor: '#046A38',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
  },
  verMaisText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
