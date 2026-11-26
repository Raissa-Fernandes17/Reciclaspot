
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
  Platform,
  ImageSourcePropType,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { PontoColeta, RootStackParamList } from '../types';
import { useRecicla } from '../hooks/useReciclaContext';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Header } from '../components/Header';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'DetalhesEcoponto'
>;

const FOTOS_ECOPONTOS_LOCAIS: Record<
  string,
  ImageSourcePropType
> = {
  '1': require('../../img/eletronicos.jpg'),
  '2': require('../../img/oleo.jpg'),
  '3': require('../../img/pilhas.jpg'),
  '4': require('../../img/plastico.jpg'),
  '5': require('../../img/remedios.jpg'),
  '6': require('../../img/metal.jpg'),
};

export function DetalhesEcopontoScreen({
  route,
  navigation,
}: Props) {
  const { ponto: pontoInicial } = route.params;

  const {
    isFavorito,
    toggleFavorito,
    buscarPontoPorId,
  } = useRecicla();

  const [ponto, setPonto] = useState<PontoColeta>(
    pontoInicial
  );

  const [carregandoDetalhes, setCarregandoDetalhes] =
    useState<boolean>(true);

  const favoritado = isFavorito(ponto.id);

  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const fotoLocal =
    FOTOS_ECOPONTOS_LOCAIS[ponto.id] ||
    require('../../img/papel.jpg');

  // Busca os dados atualizados do ecoponto na API
  useEffect(() => {
    let ativo = true;

    (async () => {
      try {
        setCarregandoDetalhes(true);

        const dadosAtualizados = await buscarPontoPorId(
          pontoInicial.id
        );

        if (ativo && dadosAtualizados) {
          setPonto(dadosAtualizados);
        }
      } catch (error) {
        console.error(
          'Erro ao carregar detalhes do ecoponto:',
          error
        );
      } finally {
        if (ativo) {
          setCarregandoDetalhes(false);
        }
      }
    })();

    return () => {
      ativo = false;
    };
  }, [pontoInicial.id]);

  // Abre o Google Maps e traça a rota até o ecoponto
  async function abrirMapaExterno() {
    try {
      let url: string;

      // Prioriza latitude e longitude quando disponíveis
      if (
        ponto.latitude != null &&
        ponto.longitude != null
      ) {
        const latitude = Number(ponto.latitude);
        const longitude = Number(ponto.longitude);

        if (
          Number.isFinite(latitude) &&
          Number.isFinite(longitude)
        ) {
          url =
            `https://www.google.com/maps/dir/?api=1` +
            `&destination=${latitude},${longitude}`;
        } else {
          const enderecoCompleto =
            `${ponto.endereco}, ${ponto.bairro}, Osvaldo Cruz - SP`;

          url =
            `https://www.google.com/maps/dir/?api=1` +
            `&destination=${encodeURIComponent(enderecoCompleto)}`;
        }
      } else {
        const enderecoCompleto =
          `${ponto.endereco}, ${ponto.bairro}, Osvaldo Cruz - SP`;

        url =
          `https://www.google.com/maps/dir/?api=1` +
          `&destination=${encodeURIComponent(enderecoCompleto)}`;
      }

      await Linking.openURL(url);
    } catch (error) {
      console.error('Erro ao abrir o Google Maps:', error);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <Header />

      <ScreenWrapper>
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Ionicons
              name="arrow-back"
              size={18}
              color="#0F4C5C"
            />

            <Text style={styles.backText}>
              Voltar para lista
            </Text>
          </TouchableOpacity>

          <Text style={styles.title}>
            {ponto.nome}
          </Text>

          <View
            style={[
              styles.mainLayout,
              isDesktop && styles.mainLayoutDesktop,
            ]}
          >
            {/* Foto do ecoponto */}

            <View
              style={[
                styles.imageFrame,
                isDesktop && styles.imageFrameDesktop,
              ]}
            >
              <Image
                source={fotoLocal}
                style={styles.image}
                resizeMode="cover"
              />

              <View style={styles.photoTag}>
                <Ionicons
                  name="leaf"
                  size={14}
                  color="#FFFFFF"
                />

                <Text style={styles.photoTagText}>
                  {ponto.categoria}
                </Text>
              </View>
            </View>

            {/* Detalhes e botões */}

            <View
              style={[
                styles.rightCol,
                isDesktop && { flex: 1 },
              ]}
            >
              <View style={styles.detailsCard}>
                <View style={styles.headingRow}>
                  <Text style={styles.detailsHeading}>
                    Detalhes do Ponto
                  </Text>

                  {carregandoDetalhes && (
                    <ActivityIndicator
                      size="small"
                      color="#047857"
                    />
                  )}
                </View>

                <Text style={styles.itemTitle}>
                  📍 Endereço e Horário
                </Text>

                <Text style={styles.itemText}>
                  {ponto.endereco} - {ponto.bairro}
                </Text>

                <Text style={styles.itemText}>
                  {ponto.horarioFuncionamento}
                </Text>

                <Text style={styles.itemTitle}>
                  ♻️ Materiais aceitos
                </Text>

                <Text style={styles.itemText}>
                  {ponto.categoria}
                  {ponto.aceitaEntulho
                    ? ' • Aceita entulho'
                    : ''}
                </Text>

                <Text style={styles.itemTitle}>
                  📋 Regras de descarte
                </Text>

                <Text style={styles.itemText}>
                  {ponto.regrasDescarte}
                </Text>

                <Text style={styles.itemTitle}>
                  📞 Contato
                </Text>

                <Text style={styles.itemText}>
                  {ponto.telefoneContato}
                </Text>
              </View>

              {/* Botões de ação */}

              <View style={styles.actionsRow}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[
                    styles.actionBtn,
                    favoritado
                      ? styles.favBtnActive
                      : styles.favBtn,
                  ]}
                  onPress={() =>
                    toggleFavorito(ponto.id)
                  }
                >
                  <Ionicons
                    name={
                      favoritado
                        ? 'star'
                        : 'star-outline'
                    }
                    size={19}
                    color={
                      favoritado ? '#FFFFFF' : '#92400E'
                    }
                  />

                  <Text
                    style={[
                      styles.favText,
                      favoritado && {
                        color: '#FFFFFF',
                      },
                    ]}
                  >
                    {favoritado
                      ? 'Favoritado'
                      : 'Favoritar'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[
                    styles.actionBtn,
                    styles.routeBtn,
                  ]}
                  onPress={abrirMapaExterno}
                >
                  <Ionicons
                    name="navigate"
                    size={19}
                    color="#FFFFFF"
                  />

                  <Text style={styles.routeText}>
                    Traçar Rota
                  </Text>
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
    alignSelf: 'flex-start',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
    marginBottom: 12,
  },

  backText: {
    color: '#0F4C5C',
    fontWeight: 'bold',
    fontSize: 14,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 18,
    color: '#0F4C5C',
  },

  mainLayout: {
    gap: 16,
  },

  mainLayoutDesktop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 24,
  },

  imageFrame: {
    width: '100%',
    height: 230,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    position: 'relative',
  },

  imageFrameDesktop: {
    width: '48%',
    height: 360,
  },

  image: {
    width: '100%',
    height: '100%',
  },

  photoTag: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 76, 92, 0.92)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },

  photoTagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },

  rightCol: {
    gap: 16,
  },

  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 24,
    padding: 20,
    elevation: 2,
    shadowColor: '#0F4C5C',
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },

  headingRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },

  detailsHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#047857',
  },

  itemTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#0F4C5C',
  },

  itemText: {
    fontSize: 14,
    color: '#334155',
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
    borderRadius: 16,
  },

  favBtn: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1.5,
    borderColor: '#D97706',
  },

  favBtnActive: {
    backgroundColor: '#D97706',
  },

  favText: {
    color: '#92400E',
    fontWeight: 'bold',
    fontSize: 15,
  },

  routeBtn: {
    backgroundColor: '#047857',
  },

  routeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
