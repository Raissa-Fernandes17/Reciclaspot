import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ImageSourcePropType,
  useWindowDimensions,
} from 'react-native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useRecicla } from '../hooks/useReciclaContext';
import { BottomTabParamList, RootStackParamList } from '../types';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Header } from '../components/Header';

const FOTOS_FAVORITOS_LOCAIS: Record<string, ImageSourcePropType> = {
  '1': require('../../img/eletronicos.jpg'),
  '2': require('../../img/oleo.jpg'),
  '3': require('../../img/pilhas.jpg'),
  '4': require('../../img/plastico.jpg'),
  '5': require('../../img/remedios.jpg'),
  '6': require('../../img/metal.jpg'),
};

export function FavoritosScreen() {
  const tabNav = useNavigation<BottomTabNavigationProp<BottomTabParamList>>();
  const stackNav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { pontos, favoritosIds, toggleFavorito } = useRecicla();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const favoritos = pontos.filter((p) => favoritosIds.includes(p.id));

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <Header />
      <ScreenWrapper>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Meus Favoritos</Text>
          <Text style={styles.subtitle}>
            Seus pontos de coleta salvos em Osvaldo Cruz - SP
          </Text>

          {favoritos.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="star-outline" size={48} color="#D97706" />
              <Text style={styles.emptyText}>Você ainda não favoritou nenhum ecoponto.</Text>
            </View>
          ) : (
            <View style={[styles.list, isDesktop && styles.listDesktop]}>
              {favoritos.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.9}
                  style={[styles.favRow, isDesktop && { width: '49%' }]}
                  onPress={() => stackNav.navigate('DetalhesEcoponto', { ponto: item })}
                >
                  <Image
                    source={FOTOS_FAVORITOS_LOCAIS[item.id] || require('../../img/papel.jpg')}
                    style={styles.avatarPhoto}
                    resizeMode="cover"
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.favName}>{item.nome}</Text>
                    <Text style={styles.favCategory}>{item.categoria}</Text>
                    <Text style={styles.favAddress} numberOfLines={1}>
                      📍 {item.endereco} • {item.bairro}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => toggleFavorito(item.id)} style={{ padding: 6 }}>
                    <Ionicons name="star" size={24} color="#D97706" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <TouchableOpacity style={styles.moreBtn} onPress={() => tabNav.navigate('Home')}>
            <Ionicons name="search" size={16} color="#065F46" />
            <Text style={styles.moreText}>Buscar por mais pontos</Text>
          </TouchableOpacity>
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
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0F4C5C',
  },
  subtitle: {
    fontSize: 13,
    color: '#334155',
    textAlign: 'center',
    marginBottom: 22,
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 10,
  },
  emptyText: {
    color: '#64748B',
    fontSize: 15,
  },
  list: {
    gap: 12,
  },
  listDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  favRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    padding: 12,
    gap: 14,
    elevation: 2,
    shadowColor: '#0F4C5C',
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  avatarPhoto: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#047857',
  },
  favName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#0F172A',
  },
  favCategory: {
    fontSize: 12,
    color: '#047857',
    fontWeight: 'bold',
    marginTop: 2,
  },
  favAddress: {
    fontSize: 12,
    color: '#334155',
    marginTop: 2,
  },
  moreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    borderWidth: 1.5,
    borderColor: '#047857',
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    marginTop: 24,
  },
  moreText: {
    fontWeight: 'bold',
    color: '#065F46',
    fontSize: 14,
  },
});
