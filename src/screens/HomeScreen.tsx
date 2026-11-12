import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useRecicla } from '../hooks/useReciclaContext';
import { CategoriaResiduo, RootStackParamList } from '../types';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Header } from '../components/Header';

const CATEGORIAS_FOTOS: {
  label: string;
  corBorda: string;
  foto: string;
  filtro?: CategoriaResiduo;
}[] = [
  {
    label: 'Metal',
    corBorda: '#F4D03F',
    foto: 'https://pexels.com',
    filtro: 'Recicláveis Gerais',
  },
  {
    label: 'Papel',
    corBorda: '#3498DB',
    foto: 'https://pexels.com',
    filtro: 'Recicláveis Gerais',
  },
  {
    label: 'Plástico',
    corBorda: '#E74C3C',
    foto: 'https://pexels.com',
    filtro: 'Recicláveis Gerais',
  },
  {
    label: 'Vidro',
    corBorda: '#82C91E',
    foto: 'https://pexels.com',
    filtro: 'Recicláveis Gerais',
  },
  {
    label: 'Eletrônicos',
    corBorda: '#2C3E50',
    foto: 'https://pexels.com',
    filtro: 'Eletrônicos',
  },
  {
    label: 'Pilhas',
    corBorda: '#D97724',
    foto: 'https://pexels.com',
    filtro: 'Pilhas/Baterias',
  },
  {
    label: 'Óleo',
    corBorda: '#7F5539',
    foto: 'https://pexels.com',
    filtro: 'Óleo Usado',
  },
  {
    label: 'Remédios',
    corBorda: '#9B51E0',
    foto: 'https://pexels.com',
    filtro: 'Medicamentos',
  },
  {
    label: 'Todos',
    corBorda: '#6B7280',
    foto: 'https://pexels.com',
    filtro: undefined,
  },
];

export function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { pontos, isFavorito, toggleFavorito } = useRecicla();
  const [busca, setBusca] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>('Todos');

  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const pontosFiltrados = pontos.filter((ponto) => {
    const bateTexto =
      ponto.nome.toLowerCase().includes(busca.toLowerCase()) ||
      ponto.bairro.toLowerCase().includes(busca.toLowerCase());

    const catObj = CATEGORIAS_FOTOS.find((c) => c.label === categoriaAtiva);
    const bateCategoria = catObj?.filtro ? ponto.categoria === catObj.filtro : true;
    return bateTexto && bateCategoria;
  });
  return (
    <View style={{ flex: 1, backgroundColor: '#F4F6F8' }}>
      <Header />
      <ScreenWrapper>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.welcome}>Seja Bem-Vindo!</Text>
          <Text style={styles.subWelcome}>Escolha o tipo de material para descartar</Text>

          {/* Grade 3x3 de Categorias com Fotos Reais Nítidas */}
          <View style={styles.grid}>
            {CATEGORIAS_FOTOS.map((item) => {
              const ativo = categoriaAtiva === item.label;
              return (
                <TouchableOpacity
                  key={item.label}
                  activeOpacity={0.85}
                  style={[
                    styles.photoCardWrapper,
                    {
                      width: '31.8%',
                      height: isDesktop ? 120 : 92,
                      borderColor: ativo ? '#046A38' : item.corBorda,
                      borderWidth: ativo ? 4 : 3,
                    },
                  ]}
                  onPress={() => setCategoriaAtiva(item.label)}
                >
                  <Image
                    source={{ uri: item.foto }}
                    style={styles.cardImage}
                    resizeMode="cover"
                  />

                  {/* Faixa inferior colorida com o nome do material */}
                  <View style={[styles.labelBar, { backgroundColor: item.corBorda }]}>
                    <Text style={styles.boxText}>{item.label}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Cabeçalho e Busca dos Ecopostos */}
          <View style={[styles.searchSection, isDesktop && styles.searchSectionDesktop]}>
            <Text style={styles.sectionTitle}>Ecopostos Disponíveis</Text>

            <View style={[styles.searchBox, isDesktop && { width: 380 }]}>
              <Ionicons name="search" size={18} color="#555" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar por nome ou bairro..."
                placeholderTextColor="#666"
                value={busca}
                onChangeText={setBusca}
              />
              {busca.length > 0 && (
                <TouchableOpacity onPress={() => setBusca('')}>
                  <Ionicons name="close-circle" size={18} color="#777" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Lista / Grade de Ecopontos com Foto */}
          <View style={[styles.cardsList, isDesktop && styles.cardsGridDesktop]}>
            {pontosFiltrados.map((item) => {
              const fav = isFavorito(item.id);
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.9}
                  style={[styles.ecopontoCard, isDesktop && styles.ecopontoCardDesktop]}
                  onPress={() => navigation.navigate('DetalhesEcoponto', { ponto: item })}
                >
                  <Image source={{ uri: item.imagemUri }} style={styles.cardThumb} />

                  <View style={styles.cardInfo}>
                    <View style={styles.cardTopRow}>
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{item.categoria}</Text>
                      </View>
                      <TouchableOpacity onPress={() => toggleFavorito(item.id)}>
                        <Ionicons
                          name={fav ? 'star' : 'star-outline'}
                          size={22}
                          color={fav ? '#F59E0B' : '#6B7280'}
                        />
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.cardTitle} numberOfLines={1}>
                      {item.nome}
                    </Text>
                    <Text style={styles.cardSub} numberOfLines={1}>
                      📍 {item.endereco} • {item.bairro}
                    </Text>
                    <Text style={styles.cardHours}>🕒 {item.horarioFuncionamento}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </ScreenWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#111827',
  },
  subWelcome: {
    fontSize: 13,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
    marginBottom: 24,
  },
  photoCardWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
    position: 'relative',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  labelBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  boxText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
    textShadowColor: 'rgba(0,0,0,0.55)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  searchSection: {
    marginBottom: 14,
  },
  searchSectionDesktop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 24,
    paddingHorizontal: 14,
    height: 42,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#111',
  },
  cardsList: {
    gap: 12,
  },
  cardsGridDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  ecopontoCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 10,
    alignItems: 'center',
    gap: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },
  ecopontoCardDesktop: {
    width: '49%',
  },
  cardThumb: {
    width: 82,
    height: 82,
    borderRadius: 14,
    backgroundColor: '#E5E7EB',
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  badge: {
    backgroundColor: '#E6F4EA',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    color: '#046A38',
    fontSize: 11,
    fontWeight: 'bold',
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#111827',
  },
  cardSub: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 2,
  },
  cardHours: {
    fontSize: 11,
    color: '#046A38',
    marginTop: 4,
    fontWeight: '600',
  },
});
