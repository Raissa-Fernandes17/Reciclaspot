import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
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

export function FavoritosScreen() {
  const tabNav = useNavigation<BottomTabNavigationProp<BottomTabParamList>>();
  const stackNav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { pontos, favoritosIds, toggleFavorito } = useRecicla();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const favoritos = pontos.filter((p) => favoritosIds.includes(p.id));

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F6F8' }}>
      <Header />
      <ScreenWrapper>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Meus Favoritos</Text>
          <Text style={styles.subtitle}>
            Seus pontos de coleta salvos para acesso rápido
          </Text>

          {favoritos.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="star-outline" size={48} color="#9CA3AF" />
              <Text style={styles.emptyText}>Você ainda não favoritou nenhum ecoponto.</Text>
            </View>
          ) : (
            <View style={[styles.list, isDesktop && styles.listDesktop]}>
              {favoritos.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.favRow, isDesktop && { width: '49%' }]}
                  onPress={() => stackNav.navigate('DetalhesEcoponto', { ponto: item })}
                >
                  <Image source={{ uri: item.imagemUri }} style={styles.avatarPhoto} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.favName}>{item.nome}</Text>
                    <Text style={styles.favCategory}>{item.categoria}</Text>
                    <Text style={styles.favAddress}>{item.endereco}</Text>
                  </View>
                  <TouchableOpacity onPress={() => toggleFavorito(item.id)} style={{ padding: 6 }}>
                    <Ionicons name="star" size={24} color="#F59E0B" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <TouchableOpacity style={styles.moreBtn} onPress={() => tabNav.navigate('Home')}>
            <Text style={styles.moreText}>+ Buscar por mais pontos</Text>
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
    color: '#111827',
  },
  subtitle: {
    fontSize: 13,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 22,
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 10,
  },
  emptyText: {
    color: '#6B7280',
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
    borderRadius: 20,
    padding: 12,
    gap: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  avatarPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  favName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#111827',
  },
  favCategory: {
    fontSize: 12,
    color: '#046A38',
    fontWeight: '600',
  },
  favAddress: {
    fontSize: 12,
    color: '#6B7280',
  },
  moreBtn: {
    backgroundColor: '#D8F3DC',
    alignSelf: 'center',
    paddingHorizontal: 26,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 22,
  },
  moreText: {
    fontWeight: 'bold',
    color: '#046A38',
    fontSize: 14,
  },
});