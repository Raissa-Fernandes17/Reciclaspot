import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useRecicla } from '../hooks/useReciclaContext';
import { CategoriaResiduo, RootStackParamList } from '../types';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Header } from '../components/Header';

const CATEGORIAS_WCAG: {
  label: string;
  icone: keyof typeof Ionicons.glyphMap;
  fundo: string;
  destaque: string;
  filtro?: CategoriaResiduo;
}[] = [
  {
    label: 'Metal',
    icone: 'construct-outline',
    fundo: '#F5D042',
    destaque: '#1E293B',
    filtro: 'Recicláveis Gerais',
  },
  {
    label: 'Papel',
    icone: 'newspaper-outline',
    fundo: '#3BA3B8',
    destaque: '#FFFFFF',
    filtro: 'Recicláveis Gerais',
  },
  {
    label: 'Plástico',
    icone: 'water-outline',
    fundo: '#EB5757',
    destaque: '#FFFFFF',
    filtro: 'Recicláveis Gerais',
  },
  {
    label: 'Vidro',
    icone: 'wine-outline',
    fundo: '#82C93D',
    destaque: '#FFFFFF',
    filtro: 'Recicláveis Gerais',
  },
  {
    label: 'Eletrônicos',
    icone: 'hardware-chip-outline',
    fundo: '#2C3E50',
    destaque: '#FFFFFF',
    filtro: 'Eletrônicos',
  },
  {
    label: 'Pilhas',
    icone: 'battery-charging-outline',
    fundo: '#D9822B',
    destaque: '#FFFFFF',
    filtro: 'Pilhas/Baterias',
  },
  {
    label: 'Óleo',
    icone: 'flask-outline',
    fundo: '#8C6239',
    destaque: '#FFFFFF',
    filtro: 'Óleo Usado',
  },
  {
    label: 'Remédios',
    icone: 'medkit-outline',
    fundo: '#9B51E0',
    destaque: '#FFFFFF',
    filtro: 'Medicamentos',
  },
  {
    label: 'Todos',
    icone: 'apps-outline',
    fundo: '#D1D5DB',
    destaque: '#1E293B',
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

    const catObj = CATEGORIAS_WCAG.find((c) => c.label === categoriaAtiva);
    const bateCategoria = catObj?.filtro ? ponto.categoria === catObj.filtro : true;
    return bateTexto && bateCategoria;
  });

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <Header />
      <ScreenWrapper>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.welcome}>Seja Bem-Vindo!</Text>
          <Text style={styles.subWelcome}>Escolha o tipo de material para descartar</Text>

          {/* Grade 3x3 com Cores Sólidas + Ícone e Nome */}
          <View style={styles.grid}>
            {CATEGORIAS_WCAG.map((item) => {
              const ativo = categoriaAtiva === item.label;
              return (
                <TouchableOpacity
                  key={item.label}
                  activeOpacity={0.85}
                  style={[
                    styles.catCard,
                    {
                      backgroundColor: item.fundo,
                      borderColor: ativo ? '#0F4C5C' : 'transparent',
                      borderWidth: ativo ? 3.5 : 0,
                    },
                  ]}
                  onPress={() => setCategoriaAtiva(item.label)}
                >
                  <Ionicons name={item.icone} size={32} color={item.destaque} />
                  <Text style={[styles.catLabel, { color: item.destaque }]}>{item.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Cabeçalho e Busca dos Ecopostos */}
          <View style={[styles.searchSection, isDesktop && styles.searchSectionDesktop]}>
            <Text style={styles.sectionTitle}>Ecopostos Disponíveis</Text>

            <View style={[styles.searchBox, isDesktop && { width: 380 }]}>
              <Ionicons name="search" size={18} color="#0F4C5C" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar por nome ou bairro..."
                placeholderTextColor="#64748B"
                value={busca}
                onChangeText={setBusca}
              />
              {busca.length > 0 && (
                <TouchableOpacity onPress={() => setBusca('')}>
                  <Ionicons name="close-circle" size={18} color="#64748B" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Lista / Grade de Ecopontos com Ícones */}
          <View style={[styles.cardsList, isDesktop && styles.cardsGridDesktop]}>
            {pontosFiltrados.map((item) => {
              const fav = isFavorito(item.id);
              const isEspecial =
                item.categoria === 'Eletrônicos' ||
                item.categoria === 'Pilhas/Baterias' ||
                item.categoria === 'Medicamentos';

              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.9}
                  style={[styles.ecopontoCard, isDesktop && styles.ecopontoCardDesktop]}
                  onPress={() => navigation.navigate('DetalhesEcoponto', { ponto: item })}
                >
                  <View
                    style={[
                      styles.iconThumb,
                      { backgroundColor: isEspecial ? '#FEF3C7' : '#ECFDF5' },
                    ]}
                  >
                    <Ionicons
                      name={isEspecial ? 'warning-outline' : 'leaf-outline'}
                      size={32}
                      color={isEspecial ? '#D97706' : '#047857'}
                    />
                  </View>

                  <View style={styles.cardInfo}>
                    <View style={styles.cardTopRow}>
                      <View
                        style={[
                          styles.badge,
                          { backgroundColor: isEspecial ? '#FEF3C7' : '#ECFDF5' },
                        ]}
                      >
                        <Text
                          style={[
                            styles.badgeText,
                            { color: isEspecial ? '#92400E' : '#065F46' },
                          ]}
                        >
                          {item.categoria}
                        </Text>
                      </View>
                      <TouchableOpacity onPress={() => toggleFavorito(item.id)}>
                        <Ionicons
                          name={fav ? 'star' : 'star-outline'}
                          size={22}
                          color={fav ? '#D97706' : '#64748B'}
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
    color: '#0F4C5C',
  },
  subWelcome: {
    fontSize: 13,
    color: '#334155',
    textAlign: 'center',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
    marginBottom: 24,
  },
  catCard: {
    width: '31.8%',
    height: 92,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  catLabel: {
    fontWeight: 'bold',
    fontSize: 13,
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
    color: '#0F4C5C',
    marginBottom: 8,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
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
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 18,
    padding: 12,
    alignItems: 'center',
    gap: 12,
    elevation: 2,
    shadowColor: '#0F4C5C',
    shadowOpacity: 0.06,
    shadowRadius: 5,
  },
  ecopontoCardDesktop: {
    width: '49%',
  },
  iconThumb: {
    width: 72,
    height: 72,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    flex: 1,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  badge: {
paddingHorizontal: 8,
paddingVertical: 3,
borderRadius: 8,
},
badgeText: {
fontSize: 11,
fontWeight: 'bold',
},
cardTitle: {
fontWeight: 'bold',
fontSize: 16,
color: '#0F172A',
},
cardSub: {
fontSize: 12,
color: '#334155',
marginTop: 2,
},
cardHours: {
fontSize: 11,
color: '#047857',
marginTop: 4,
fontWeight: 'bold',
},
});