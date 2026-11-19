import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRecicla } from '../hooks/useReciclaContext';
import { RootStackParamList } from '../types';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Header } from '../components/Header';

export function MapaScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { pontos } = useRecicla();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const [coords, setCoords] = useState<Location.LocationObjectCoords | null>(null);
  const [carregandoGps, setCarregandoGps] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // 1. Solicita permissão de GPS em runtime
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          Alert.alert(
            'Permissão de GPS',
            'Ative a localização para centralizar o mapa na sua posição atual.'
          );
          setCarregandoGps(false);
          return;
        }

        // 2. Captura as coordenadas exatas do cidadão
        const posicao = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setCoords(posicao.coords);
      } catch (error) {
        Alert.alert('Aviso', 'Não foi possível obter sua localização atual.');
      } finally {
        setCarregandoGps(false);
      }
    })();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <Header />
      <ScreenWrapper>
        <View style={styles.container}>
          <Text style={styles.title}>Mapa dos Ecopostos</Text>
          <Text style={styles.subtitle}>Osvaldo Cruz - SP • Toque em um marcador</Text>

          <View style={[styles.mapFrame, isDesktop && { height: 480 }]}>
            {carregandoGps ? (
              <View style={styles.loadingBox}>
                <ActivityIndicator size="large" color="#047857" />
                <Text style={styles.loadingText}>Obtendo sua localização via GPS...</Text>
              </View>
            ) : (
              <MapView
                style={styles.map}
                showsUserLocation={true} // Marcador azul do usuário
                showsMyLocationButton={true}
                initialRegion={{
                  latitude: coords ? coords.latitude : -21.7963,
                  longitude: coords ? coords.longitude : -50.8791,
                  latitudeDelta: 0.025,
                  longitudeDelta: 0.025,
                }}
              >
                {pontos.map((ponto) => (
                  <Marker
                    key={ponto.id}
                    coordinate={{
                      latitude: ponto.latitude,
                      longitude: ponto.longitude,
                    }}
                    pinColor="#047857"
                  >
                    <Callout
                      onPress={() =>
                        navigation.navigate('DetalhesEcoponto', { ponto })
                      }
                    >
                      <View style={styles.callout}>
                        <Text style={styles.calloutTitle}>{ponto.nome}</Text>
                        <Text style={styles.calloutBadge}>{ponto.categoria}</Text>
                        <Text style={styles.calloutDesc}>{ponto.endereco}</Text>
                        <View style={styles.verMaisBtn}>
                          <Text style={styles.verMaisText}>Abrir Detalhes →</Text>
                        </View>
                      </View>
                    </Callout>
                  </Marker>
                ))}
              </MapView>
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
    height: 440,
    backgroundColor: '#E2E8F0',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#0F4C5C',
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  loadingBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#0F4C5C',
    fontWeight: '600',
  },
  callout: {
    width: 210,
    padding: 8,
    alignItems: 'center',
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0F172A',
  },
  calloutBadge: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#92400E',
    marginTop: 2,
  },
  calloutDesc: {
    fontSize: 11,
    textAlign: 'center',
    color: '#334155',
    marginTop: 3,
  },
  verMaisBtn: {
    marginTop: 8,
    backgroundColor: '#047857',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  verMaisText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
