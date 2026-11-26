import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useRecicla } from '../hooks/useReciclaContext';
import { RootStackParamList } from '../types';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Header } from '../components/Header';

export function MapaScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { pontos } = useRecicla();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  function abrirGoogleMaps(endereco: string, bairro: string) {
    const destino = encodeURIComponent(`${endereco}, ${bairro}, Osvaldo Cruz - SP`);
    window.open(`https://google.com{destino}`, '_blank');
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <Header />
      <ScreenWrapper>
        <View style={styles.container}>
          <Text style={styles.title}>Mapa dos Ecopostos</Text>
          <Text style={styles.subtitle}>
            Osvaldo Cruz - SP • Selecione um ecoponto para abrir no Google Maps
          </Text>

          <FlatList
            style={{ width: '100%', maxWidth: isDesktop ? 720 : '100%' }}
            data={pontos}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ gap: 12, paddingBottom: 32 }}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardBadge}>{item.categoria}</Text>
                  <Text style={styles.cardTitle}>{item.nome}</Text>
                  <Text style={styles.cardAddress}>
                    📍 {item.endereco} • {item.bairro}
                  </Text>
                </View>

                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={styles.detailBtn}
                    onPress={() => navigation.navigate('DetalhesEcoponto', { ponto: item })}
                  >
                    <Text style={styles.detailBtnText}>Detalhes</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.mapBtn}
                    onPress={() => abrirGoogleMaps(item.endereco, item.bairro)}
                  >
                    <Ionicons name="navigate" size={16} color="#FFFFFF" />
                    <Text style={styles.mapBtnText}>Ver Rota</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
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
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardBadge: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#065F46',
    backgroundColor: '#ECFDF5',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  cardAddress: {
    fontSize: 12,
    color: '#475569',
    marginTop: 2,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  detailBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#E2E8F0',
  },
  detailBtnText: {
    color: '#0F4C5C',
    fontWeight: 'bold',
    fontSize: 12,
  },
  mapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#047857',
  },
  mapBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
