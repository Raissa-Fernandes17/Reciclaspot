
import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

import { useRecicla } from '../hooks/useReciclaContext';
import { PontoColeta, RootStackParamList } from '../types';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Header } from '../components/Header';

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

const LOCALIZACAO_PADRAO = {
  latitude: -21.7963,
  longitude: -50.8791,
};

export function MapaScreen() {
  const navigation = useNavigation<NavigationProps>();
  const { pontos } = useRecicla();
  const { width } = useWindowDimensions();

  const isDesktop = width >= 768;

  const [pontoSelecionado, setPontoSelecionado] =
    useState<PontoColeta | null>(null);

  const [localizacaoUsuario, setLocalizacaoUsuario] =
    useState<{ latitude: number; longitude: number } | null>(null);

  const [carregandoGPS, setCarregandoGPS] = useState(true);
  const [erroGPS, setErroGPS] = useState('');

  const pontosComCoordenadas = useMemo(() => {
    return pontos
      .map((ponto) => {
        if (ponto.latitude == null || ponto.longitude == null) {
          return null;
        }

        const latitude = Number(ponto.latitude);
        const longitude = Number(ponto.longitude);

        if (
          !Number.isFinite(latitude) ||
          !Number.isFinite(longitude) ||
          latitude < -90 ||
          latitude > 90 ||
          longitude < -180 ||
          longitude > 180
        ) {
          return null;
        }

        return { ...ponto, latitude, longitude };
      })
      .filter(
        (ponto): ponto is PontoColeta & {
          latitude: number;
          longitude: number;
        } => ponto !== null
      );
  }, [pontos]);

  useEffect(() => {
    if (pontos.length > 0 && !pontoSelecionado) {
      setPontoSelecionado(pontos[0]);
    }
  }, [pontos, pontoSelecionado]);

  useEffect(() => {
    let ativo = true;

    async function buscarLocalizacao() {
      try {
        setCarregandoGPS(true);
        setErroGPS('');

        const permissao =
          await Location.requestForegroundPermissionsAsync();

        if (!permissao.granted) {
          if (ativo) {
            setErroGPS('Permissão de localização não concedida.');
          }
          return;
        }

        const localizacao =
          await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });

        if (ativo) {
          setLocalizacaoUsuario({
            latitude: localizacao.coords.latitude,
            longitude: localizacao.coords.longitude,
          });
        }
      } catch (error) {
        console.error('Erro ao obter localização:', error);

        if (ativo) {
          setErroGPS('Não foi possível obter sua localização.');
        }
      } finally {
        if (ativo) {
          setCarregandoGPS(false);
        }
      }
    }

    buscarLocalizacao();

    return () => {
      ativo = false;
    };
  }, []);

  const coordenadasSelecionadas = pontosComCoordenadas.find(
    (ponto) => ponto.id === pontoSelecionado?.id
  );

  const centro = coordenadasSelecionadas
    ? {
        latitude: coordenadasSelecionadas.latitude,
        longitude: coordenadasSelecionadas.longitude,
      }
    : localizacaoUsuario || LOCALIZACAO_PADRAO;

  const margem = 0.012;

  const bbox = [
    centro.longitude - margem,
    centro.latitude - margem,
    centro.longitude + margem,
    centro.latitude + margem,
  ].join(',');

  const mapaUrl =
    `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}` +
    `&layer=mapnik&marker=${centro.latitude}%2C${centro.longitude}`;

  function selecionarPonto(ponto: PontoColeta) {
    setPontoSelecionado(ponto);
  }

  function abrirDetalhes(ponto: PontoColeta) {
    navigation.navigate('DetalhesEcoponto', { ponto });
  }

  return (
    <View style={styles.screen}>
      <Header />

      <ScreenWrapper>
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Mapa dos Ecopontos</Text>

          <Text style={styles.subtitle}>
            Osvaldo Cruz - SP • Encontre um local para reciclar
          </Text>

          <View style={styles.gpsStatus}>
            {carregandoGPS ? (
              <>
                <ActivityIndicator size="small" color="#047857" />
                <Text style={styles.gpsText}>
                  Obtendo sua localização...
                </Text>
              </>
            ) : localizacaoUsuario ? (
              <>
                <Ionicons
                  name="navigate-circle"
                  size={19}
                  color="#047857"
                />
                <Text style={styles.gpsText}>
                  Sua localização foi identificada
                </Text>
              </>
            ) : (
              <>
                <Ionicons
                  name="information-circle"
                  size={19}
                  color="#D97706"
                />
                <Text style={styles.gpsError}>
                  {erroGPS || 'Localização indisponível'}
                </Text>
              </>
            )}
          </View>

          <Text style={styles.sectionTitle}>
            Selecione um ecoponto:
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pinsRow}
          >
            {pontos.map((ponto) => {
              const ativo = pontoSelecionado?.id === ponto.id;

              return (
                <TouchableOpacity
                  key={ponto.id}
                  style={[
                    styles.pinChip,
                    ativo && styles.pinChipActive,
                  ]}
                  onPress={() => selecionarPonto(ponto)}
                >
                  <Ionicons
                    name="location"
                    size={16}
                    color={ativo ? '#FFFFFF' : '#047857'}
                  />

                  <Text
                    style={[
                      styles.pinChipText,
                      ativo && styles.pinChipTextActive,
                    ]}
                  >
                    {ponto.nome}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View
            style={[
              styles.mapFrame,
              isDesktop && styles.mapFrameDesktop,
            ]}
          >
            <iframe
              key={mapaUrl}
              title="Mapa dos Ecopontos"
              src={mapaUrl}
              style={{
                width: '100%',
                height: '100%',
                border: 0,
              }}
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </View>

          {pontoSelecionado && (
            <View style={styles.card}>
              <View style={styles.cardInfo}>
                <Text style={styles.badge}>
                  {pontoSelecionado.categoria}
                </Text>

                <Text style={styles.cardTitle}>
                  {pontoSelecionado.nome}
                </Text>

                <Text style={styles.address}>
                  <Text>📍 </Text>
                  {pontoSelecionado.endereco} • {pontoSelecionado.bairro}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.detailsButton}
                onPress={() => abrirDetalhes(pontoSelecionado)}
              >
                <Text style={styles.detailsText}>
                  Abrir detalhes →
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={styles.greenDot} />
              <Text style={styles.legendText}>Ecoponto selecionado</Text>
            </View>

            <View style={styles.legendItem}>
              <View style={styles.blueDot} />
              <Text style={styles.legendText}>Sua localização, se disponível</Text>
            </View>
          </View>

          <Text style={styles.totalText}>
            {pontosComCoordenadas.length} ecoponto(s) com coordenadas
          </Text>

          {pontosComCoordenadas.length < pontos.length && (
            <Text style={styles.warningText}>
              Alguns ecopontos não possuem coordenadas válidas cadastradas.
            </Text>
          )}
        </ScrollView>
      </ScreenWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F4C5C',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#334155',
    marginBottom: 12,
    textAlign: 'center',
  },
  gpsStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 14,
    padding: 10,
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    width: '100%',
  },
  gpsText: {
    color: '#047857',
    fontSize: 13,
    fontWeight: '600',
  },
  gpsError: {
    color: '#92400E',
    fontSize: 13,
  },
  sectionTitle: {
    width: '100%',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F4C5C',
    marginBottom: 9,
  },
  pinsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 12,
  },
  pinChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#047857',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 20,
  },
  pinChipActive: {
    backgroundColor: '#047857',
  },
  pinChipText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0F4C5C',
  },
  pinChipTextActive: {
    color: '#FFFFFF',
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
  mapFrameDesktop: {
    height: 460,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    gap: 12,
  },
  cardInfo: {
    flex: 1,
  },
  badge: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#047857',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  address: {
    fontSize: 12,
    color: '#334155',
    marginTop: 5,
  },
  detailsButton: {
    backgroundColor: '#047857',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  detailsText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 18,
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  greenDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#047857',
  },
  blueDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2563EB',
  },
  legendText: {
    fontSize: 12,
    color: '#334155',
  },
  totalText: {
    fontSize: 12,
    color: '#047857',
    fontWeight: 'bold',
    marginTop: 12,
  },
  warningText: {
    fontSize: 12,
    color: '#92400E',
    textAlign: 'center',
    marginTop: 8,
  },
});
