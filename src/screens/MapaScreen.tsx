import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useRecicla } from '../hooks/useReciclaContext';
import { PontoColeta, RootStackParamList } from '../types';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Header } from '../components/Header';

const POSICOES_PINOS = [
  { top: '40%', left: '46%', cor: '#D97706', bairroLabel: 'Centro' },
  { top: '22%', left: '26%', cor: '#0F4C5C', bairroLabel: 'Jd. Bandeiras' },
  { top: '62%', right: '22%', cor: '#047857', bairroLabel: 'Jd. Paulista' },
  { top: '20%', right: '20%', cor: '#047857', bairroLabel: 'Vila Califórnia' },
  { top: '54%', left: '18%', cor: '#D97706', bairroLabel: 'Jd. Alvorada' },
  { top: '72%', left: '42%', cor: '#0F4C5C', bairroLabel: 'Santa Mônica' },
];

export function MapaScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { pontos } = useRecicla();
  const [pontoSelecionado, setPontoSelecionado] = useState<PontoColeta | null>(
    pontos.at(0) ?? null
  );
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <Header />
      <ScreenWrapper>
        <View style={styles.container}>
          <Text style={styles.title}>Mapa dos Ecopostos</Text>
          <Text style={styles.subtitle}>Osvaldo Cruz - SP • Toque em um marcador</Text>

          <View style={[styles.mapFrame, isDesktop && { height: 480 }]}>
            <View style={styles.parkArea} />
            <View style={styles.roadHorizontal} />
            <View style={styles.roadVertical} />
            <View style={styles.roadDiagonal} />

            <View style={styles.avenueTag}>
              <Text style={styles.avenueText}>Av. Pres. Vargas • Osvaldo Cruz</Text>
            </View>

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

            {pontoSelecionado && (
              <View style={[styles.resumoCard, isDesktop && styles.resumoCardDesktop]}>
                <TouchableOpacity
                  style={styles.closeResumo}
                  onPress={() => setPontoSelecionado(null)}
                >
                  <Ionicons name="close-circle" size={22} color="#92400E" />
                </TouchableOpacity>

                <View style={styles.resumoIconBox}>
                  <Ionicons name="leaf" size={26} color="#047857" />
                </View>

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
    color: '#0F4C5C',
  },
  subtitle: {
    fontSize: 13,
    color: '#334155',
    marginBottom: 16,
  },
  mapFrame: {
    width: '100%',
    height: 410,
    backgroundColor: '#E2E8F0',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#0F4C5C',
    overflow: 'hidden',
    position: 'relative',
  },
  parkArea: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    width: 150,
    height: 110,
    backgroundColor: '#A7F3D0',
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
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  avenueText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0F4C5C',
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
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  pinBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  resumoCard: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    width: 210,
    backgroundColor: '#FEF3C7',
    borderWidth: 1.5,
    borderColor: '#D97706',
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    elevation: 6,
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
  resumoIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  resumoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0F172A',
  },
  resumoBadge: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#92400E',
    marginTop: 2,
  },
  resumoDesc: {
    fontSize: 11,
    textAlign: 'center',
    color: '#334155',
    marginTop: 2,
  },
  resumoBairro: {
    fontSize: 10,
    textAlign: 'center',
    color: '#0F4C5C',
    fontWeight: 'bold',
  },
  verMaisBtn: {
    marginTop: 8,
    backgroundColor: '#047857',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  verMaisText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
