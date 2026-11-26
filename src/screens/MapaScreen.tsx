
import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  Platform,
  ActivityIndicator,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Callout, Region } from 'react-native-maps';
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

  const [regiao, setRegiao] = useState<Region>({
    ...LOCALIZACAO_PADRAO,
    latitudeDelta: 0.025,
    longitudeDelta: 0.025,
  });

  // Verifica e converte as coordenadas dos ecopontos
  const pontosComCoordenadas = useMemo(() => {
    return pontos
      .map((ponto) => {
        if (
          ponto.latitude == null ||
          ponto.longitude == null
        ) {
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

        return {
          ...ponto,
          latitude,
          longitude,
        };
      })
      .filter(
        (ponto): ponto is PontoColeta & {
          latitude: number;
          longitude: number;
        } => ponto !== null
      );
  }, [pontos]);

  // Seleciona o primeiro ecoponto disponível
  useEffect(() => {
    if (pontos.length > 0 && !pontoSelecionado) {
      setPontoSelecionado(pontos[0]);
    }
  }, [pontos, pontoSelecionado]);

  // Solicita permissão e captura a localização do usuário
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
          const coordenadas = {
            latitude: localizacao.coords.latitude,
            longitude: localizacao.coords.longitude,
          };

          setLocalizacaoUsuario(coordenadas);

          setRegiao({
            ...coordenadas,
            latitudeDelta: 0.025,
            longitudeDelta: 0.025,
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

  // Centraliza no ecoponto selecionado quando o GPS não está disponível
  useEffect(() => {
    if (localizacaoUsuario) return;

    const selecionado = pontosComCoordenadas.find(
      (ponto) => ponto.id === pontoSelecionado?.id
    );

    if (selecionado) {
      setRegiao({
        latitude: selecionado.latitude,
        longitude: selecionado.longitude,
        latitudeDelta: 0.025,
        longitudeDelta: 0.025,
      });
    }
  }, [
    pontoSelecionado,
    pontosComCoordenadas,
    localizacaoUsuario,
  ]);

  // Seleciona um ecoponto e centraliza o mapa
  function selecionarPonto(ponto: PontoColeta) {
    setPontoSelecionado(ponto);

    const coordenadas = pontosComCoordenadas.find(
      (item) => item.id === ponto.id
    );

    if (coordenadas) {
      setRegiao({
        latitude: coordenadas.latitude,
        longitude: coordenadas.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      });
    }
  }

  // Abre a tela de detalhes do ecoponto
  function abrirDetalhes(ponto: PontoColeta) {
    navigation.navigate('DetalhesEcoponto', {
      ponto,
    });
  }

  // Dados para o mapa Web
  const pontosJson = JSON.stringify(
    pontosComCoordenadas.map((ponto) => ({
      id: String(ponto.id),
      nome: ponto.nome,
      categoria: ponto.categoria,
      endereco: `${ponto.endereco}, ${ponto.bairro}`,
      latitude: ponto.latitude,
      longitude: ponto.longitude,
    }))
  ).replace(/</g, '\\u003c');

  // Mapa Web com Leaflet e OpenStreetMap
  const mapaHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />

        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          html, body, #map {
            width: 100%;
            height: 100%;
          }

          .leaflet-popup-content {
            font-family: Arial, sans-serif;
            min-width: 150px;
          }

          .nome {
            font-weight: bold;
            color: #0F4C5C;
            font-size: 14px;
            margin-bottom: 5px;
          }

          .categoria {
            color: #047857;
            font-size: 12px;
            margin-bottom: 5px;
          }

          .endereco {
            font-size: 12px;
            margin-bottom: 10px;
          }

          .detalhes {
            background: #047857;
            color: white;
            border: none;
            padding: 9px 12px;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
            width: 100%;
          }
        </style>
      </head>

      <body>
        <div id="map"></div>

        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

        <script>
          const pontos = ${pontosJson};

          const centro = ${
            pontoSelecionado
              ? JSON.stringify(
                  (() => {
                    const selecionado = pontosComCoordenadas.find(
                      p => p.id === pontoSelecionado.id
                    );

                    return selecionado
                      ? [selecionado.latitude, selecionado.longitude]
                      : [LOCALIZACAO_PADRAO.latitude, LOCALIZACAO_PADRAO.longitude];
                  })()
                )
              : JSON.stringify([
                  LOCALIZACAO_PADRAO.latitude,
                  LOCALIZACAO_PADRAO.longitude
                ])
          };

          const map = L.map('map').setView(centro, 14);

          L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
              attribution: '&copy; OpenStreetMap contributors',
              maxZoom: 19
            }
          ).addTo(map);

          function escapar(texto) {
            return String(texto ?? '').replace(/[&<>"']/g, function(c) {
              return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
              }[c];
            });
          }

          pontos.forEach(function(ponto) {
            const marcador = L.marker([
              ponto.latitude,
              ponto.longitude
            ]).addTo(map);

            const popup = document.createElement('div');

            popup.innerHTML = 
              '<div class="nome">' + escapar(ponto.nome) + '</div>' +
              '<div class="categoria">' + escapar(ponto.categoria) + '</div>' +
              '<div class="endereco">' + escapar(ponto.endereco) + '</div>';

            const botao = document.createElement('button');
            botao.className = 'detalhes';
            botao.textContent = 'Abrir Detalhes';

            botao.addEventListener('click', function() {
              window.parent.postMessage({
                type: 'ecoponto-selecionado',
                id: ponto.id
              }, '*');
            });

            popup.appendChild(botao);
            marcador.bindPopup(popup);
          });

          window.addEventListener('message', function(event) {
            if (
              event.data &&
              event.data.type === 'centralizar-ecoponto'
            ) {
              const ponto = pontos.find(
                p => p.id === String(event.data.id)
              );

              if (ponto) {
                map.setView(
                  [ponto.latitude, ponto.longitude],
                  16
                );
              }
            }
          });
        </script>
      </body>
    </html>
  `;

  // Recebe a seleção de um marcador no mapa Web
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    function receberMensagem(event: MessageEvent) {
      if (
        event.data?.type === 'ecoponto-selecionado'
      ) {
        const ponto = pontos.find(
          (item) => String(item.id) === String(event.data.id)
        );

        if (ponto) {
          setPontoSelecionado(ponto);
          abrirDetalhes(ponto);
        }
      }
    }

    window.addEventListener('message', receberMensagem);

    return () => {
      window.removeEventListener('message', receberMensagem);
    };
  }, [pontos]);

  return (
    <View style={styles.screen}>
      <Header />

      <ScreenWrapper>
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>
            Mapa dos Ecopostos
          </Text>

          <Text style={styles.subtitle}>
            Osvaldo Cruz - SP • Encontre o ecoponto mais próximo
          </Text>

          {/* Status do GPS */}

          <View style={styles.gpsStatus}>
            {carregandoGPS ? (
              <>
                <ActivityIndicator
                  size="small"
                  color="#047857"
                />
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

          {/* Seletor de ecopontos */}

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pinsRow}
          >
            {pontos.map((ponto) => {
              const ativo =
                pontoSelecionado?.id === ponto.id;

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

          {/* Mapa */}

          <View
            style={[
              styles.mapFrame,
              isDesktop && styles.mapFrameDesktop,
            ]}
          >
            {Platform.OS === 'web' ? (
              <>
                {/* Mapa Web com todos os marcadores */}

                <iframe
                  title="Mapa dos Ecopontos"
                  srcDoc={mapaHtml}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                />
              </>
            ) : (
              /* Mapa nativo Android */

              <MapView
                style={styles.nativeMap}
                region={regiao}
                onRegionChangeComplete={setRegiao}
                showsUserLocation={!!localizacaoUsuario}
                showsMyLocationButton={!!localizacaoUsuario}
                showsCompass
                loadingEnabled
                mapType="standard"
              >
                {pontosComCoordenadas.map((ponto) => (
                  <Marker
                    key={ponto.id}
                    coordinate={{
                      latitude: ponto.latitude,
                      longitude: ponto.longitude,
                    }}
                    pinColor="#047857"
                    onPress={() => setPontoSelecionado(ponto)}
                  >
                    <Callout
                      onPress={() => abrirDetalhes(ponto)}
                    >
                      <View style={styles.nativeCallout}>
                        <Text style={styles.calloutBadge}>
                          {ponto.categoria}
                        </Text>

                        <Text style={styles.calloutTitle}>
                          {ponto.nome}
                        </Text>

                        <Text style={styles.calloutDesc}>
                          {ponto.endereco} • {ponto.bairro}
                        </Text>

                        <Text style={styles.calloutButton}>
                          Abrir detalhes →
                        </Text>
                      </View>
                    </Callout>
                  </Marker>
                ))}
              </MapView>
            )}

            {/* Cartão de informações */}

            {pontoSelecionado && (
              <View style={styles.calloutOverlay}>
                <View style={styles.calloutInfo}>
                  <Text style={styles.calloutBadge}>
                    {pontoSelecionado.categoria}
                  </Text>

                  <Text
                    style={styles.calloutTitle}
                    numberOfLines={1}
                  >
                    {pontoSelecionado.nome}
                  </Text>

                  <Text style={styles.calloutDesc}>
                    📍 {pontoSelecionado.endereco} • {pontoSelecionado.bairro}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.verMaisBtn}
                  onPress={() => abrirDetalhes(pontoSelecionado)}
                >
                  <Text style={styles.verMaisText}>
                    Abrir Detalhes →
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Legenda */}

          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={styles.greenDot} />
              <Text style={styles.legendText}>
                Ecopontos
              </Text>
            </View>

            <View style={styles.legendItem}>
              <View style={styles.blueDot} />
              <Text style={styles.legendText}>
                Sua localização
              </Text>
            </View>
          </View>

          <Text style={styles.totalText}>
            {pontosComCoordenadas.length} ecoponto(s) com coordenadas no mapa
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
    position: 'relative',
  },

  mapFrameDesktop: {
    height: 460,
  },

  nativeMap: {
    width: '100%',
    height: '100%',
  },

  nativeCallout: {
    width: 190,
    padding: 8,
  },

  calloutOverlay: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    right: 14,
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },

  calloutInfo: {
    flex: 1,
  },

  calloutBadge: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#047857',
    marginBottom: 3,
  },

  calloutTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0F172A',
  },

  calloutDesc: {
    fontSize: 12,
    color: '#334155',
    marginTop: 3,
  },

  calloutButton: {
    backgroundColor: '#047857',
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
    overflow: 'hidden',
  },

  verMaisBtn: {
    backgroundColor: '#047857',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },

  verMaisText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },

  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
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
