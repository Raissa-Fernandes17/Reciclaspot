import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
  useWindowDimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';
import { useRecicla } from '../hooks/useReciclaContext';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Header } from '../components/Header';

type Props = NativeStackScreenProps<RootStackParamList, 'DetalhesEcoponto'>;

export function DetalhesEcopontoScreen({ route, navigation }: Props) {
  const { ponto } = route.params;
  const { isFavorito, toggleFavorito } = useRecicla();
  const favoritado = isFavorito(ponto.id);

  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  function abrirMapaExterno() {
    const url = `https://google.com{ponto.latitude},${ponto.longitude}`;
    Linking.openURL(url);
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F6F8' }}>
      <Header />
      <ScreenWrapper>
        <ScrollView contentContainerStyle={styles.container}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={20} color="#046A38" />
            <Text style={styles.backText}>Voltar para lista</Text>
          </TouchableOpacity>

          <Text style={styles.title}>{ponto.nome}</Text>

          <View style={[styles.mainLayout, isDesktop && styles.mainLayoutDesktop]}>
            <Image
              source={{ uri: ponto.imagemUri }}
              style={[styles.image, isDesktop && styles.imageDesktop]}
            />

            <View style={[styles.rightCol, isDesktop && { flex: 1 }]}>
              <View style={styles.detailsCard}>
                <Text style={styles.detailsHeading}>Detalhes do Ponto</Text>

                <Text style={styles.itemTitle}>📍 Endereço e Horário</Text>
                <Text style={styles.itemText}>
                  {ponto.endereco} - {ponto.bairro}
                </Text>
                <Text style={styles.itemText}>{ponto.horarioFuncionamento}</Text>

                <Text style={styles.itemTitle}>♻️ Materiais aceitos</Text>
                <Text style={styles.itemText}>
                  {ponto.categoria} {ponto.aceitaEntulho ? '• Aceita entulho' : ''}
                </Text>

                <Text style={styles.itemTitle}>📋 Regras de descarte</Text>
                <Text style={styles.itemText}>{ponto.regrasDescarte}</Text>

                <Text style={styles.itemTitle}>📞 Contato</Text>
                <Text style={styles.itemText}>{ponto.telefoneContato}</Text>
              </View>

              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={[styles.actionBtn, favoritado ? styles.favBtnActive : styles.favBtn]}
                  onPress={() => toggleFavorito(ponto.id)}
                >
                  <Ionicons name={favoritado ? 'star' : 'star-outline'} size={18} color="#111" />
                  <Text style={styles.favText}>
                    {favoritado ? 'Favoritado' : 'Favoritar'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionBtn, styles.routeBtn]} onPress={abrirMapaExterno}>
                  <Ionicons name="navigate" size={18} color="#FFF" />
                  <Text style={styles.routeText}>Traçar Rota</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </ScreenWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  backText: {
    color: '#046A38',
    fontWeight: 'bold',
    fontSize: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 18,
    color: '#111827',
  },
  mainLayout: {
    gap: 16,
  },
  mainLayoutDesktop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 24,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 24,
  },
  imageDesktop: {
    width: '48%',
    height: 360,
  },
  rightCol: {
    gap: 16,
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },
  detailsHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: '#046A38',
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#111827',
  },
  itemText: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 3,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 24,
  },
  favBtn: {
    backgroundColor: '#FDBA74',
  },
  favBtnActive: {
    backgroundColor: '#F59E0B',
  },
  favText: {
    color: '#111',
    fontWeight: 'bold',
    fontSize: 15,
  },
  routeBtn: {
    backgroundColor: '#046A38',
  },
  routeText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
