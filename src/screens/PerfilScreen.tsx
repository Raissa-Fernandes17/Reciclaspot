import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRecicla } from '../hooks/useReciclaContext';
import { CategoriaResiduo } from '../types';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Header } from '../components/Header';

const fotoPerfilLocal = require('../../img/perfil.jpg');

const MATERIAIS_OPCOES: CategoriaResiduo[] = [
  'Eletrônicos',
  'Óleo Usado',
  'Pilhas/Baterias',
  'Recicláveis Gerais',
  'Medicamentos',
];

const LOCAIS_OSVALDO_CRUZ = [
  'Ecoponto Central Vargas • Centro',
  'Cooperativa Verde • Jd. Bandeiras',
  'Ponto Eco • Jd. Paulista',
  'Estação Sustentável • Vila Califórnia',
  'Farmácia Ponto Seguro • Jd. Alvorada',
  'Ecoponto • Santa Mônica',
];

export function PerfilScreen() {
  const { usuario, contribuicoes, registrarNovoDescarte } = useRecicla();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const [modalVisivel, setModalVisivel] = useState(false);
  const [materialSelecionado, setMaterialSelecionado] =
    useState<CategoriaResiduo>('Recicláveis Gerais');
  const [localSelecionado, setLocalSelecionado] = useState<string>(
    'Ecoponto Central Vargas • Centro'
  );
  const [fotoDescarteUri, setFotoDescarteUri] = useState<string | undefined>(undefined);

  const co2Evitado = (usuario.pontosReciclagem * 1.8).toFixed(1);

  async function escolherDaGaleria() {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert('Permissão necessária', 'Autorize o acesso às fotos.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.7,
    });

    if (!resultado.canceled) {
      const imagemEscolhida = resultado.assets.at(0);
      if (imagemEscolhida) {
        setFotoDescarteUri(imagemEscolhida.uri);
      }
    }
  }

  async function tirarFotoComCamera() {
    if (Platform.OS === 'web') {
      escolherDaGaleria();
      return;
    }

    const permissao = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert('Permissão necessária', 'Autorize o uso da câmera.');
      return;
    }

    const resultado = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!resultado.canceled) {
      const fotoTirada = resultado.assets.at(0);
      if (fotoTirada) {
        setFotoDescarteUri(fotoTirada.uri);
      }
    }
  }

  function confirmarRegistro() {
    registrarNovoDescarte({
      material: materialSelecionado,
      local: localSelecionado,
      fotoUri: fotoDescarteUri,
    });

    setFotoDescarteUri(undefined);
    setModalVisivel(false);
  }
  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <Header titulo="Meu Perfil" />
      <ScreenWrapper>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <View style={[styles.desktopRow, isDesktop && styles.desktopRowActive]}>
            <View style={isDesktop ? { flex: 1 } : undefined}>
              <View style={styles.profileCard}>
                <View style={styles.avatarContainer}>
                  <Image source={fotoPerfilLocal} style={styles.avatar} resizeMode="cover" />
                  <View style={styles.verifiedBadge}>
                    <Ionicons name="leaf" size={14} color="#FFF" />
                  </View>
                </View>

                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{usuario.nome}</Text>
                  <Text style={styles.userCity}>📍 Osvaldo Cruz - SP</Text>
                  <View style={styles.levelPill}>
                    <Ionicons name="trophy" size={13} color="#92400E" />
                    <Text style={styles.levelText}>Guardião Verde • Nível 3</Text>
                  </View>
                </View>
              </View>

              <View style={styles.statsCard}>
                <View style={styles.statsHeader}>
                  <Ionicons name="checkmark-circle" size={24} color="#047857" />
                  <Text style={styles.statsBadgeText}>Meta Mensal: 20 descartes</Text>
                </View>

                <Text style={styles.statsNumber}>{usuario.pontosReciclagem}</Text>
                <Text style={styles.statsLabel}>Descartes Conscientes Realizados</Text>

                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${Math.min((usuario.pontosReciclagem / 20) * 100, 100)}%` },
                    ]}
                  />
                </View>

                <View style={styles.miniMetricsRow}>
                  <View style={styles.miniMetricBox}>
                    <Text style={styles.miniMetricValue}>{co2Evitado} kg</Text>
                    <Text style={styles.miniMetricLabel}>CO₂ evitado</Text>
                  </View>
                  <View style={styles.dividerVertical} />
                  <View style={styles.miniMetricBox}>
                    <Text style={styles.miniMetricValue}>{usuario.pontosReciclagem * 50}</Text>
                    <Text style={styles.miniMetricLabel}>EcoPontos</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={[styles.historyCard, isDesktop && { flex: 1.25 }]}>
              <View style={styles.historyHeader}>
                <Ionicons name="time-outline" size={22} color="#FEF3C7" />
                <Text style={styles.historyTitle}>Últimas Contribuições</Text>
              </View>

              {contribuicoes.map((item) => (
                <View key={item.id} style={styles.historyItem}>
                  {item.fotoUri ? (
                    <Image source={{ uri: item.fotoUri }} style={styles.historyThumb} />
                  ) : (
                    <View style={styles.iconCircle}>
                      <Text style={styles.emoji}>{item.emoji}</Text>
                    </View>
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemBold}>{item.material}</Text>
                    <Text style={styles.itemSub}>{item.local}</Text>
                    <Text style={styles.itemDate}>{item.data} • +50 pts</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.registerBtn}
            onPress={() => setModalVisivel(true)}
          >
            <Ionicons name="camera" size={20} color="#FFFFFF" />
            <Text style={styles.registerText}>Registrar Novo Descarte (+1)</Text>
          </TouchableOpacity>
        </ScrollView>
      </ScreenWrapper>

      <Modal
        visible={modalVisivel}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Registrar Novo Descarte</Text>
              <TouchableOpacity onPress={() => setModalVisivel(false)}>
                <Ionicons name="close" size={24} color="#0F4C5C" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalLabel}>1. Foto do material descartado</Text>
              {fotoDescarteUri ? (
                <View style={styles.previewWrapper}>
                  <Image source={{ uri: fotoDescarteUri }} style={styles.previewImg} />
                  <TouchableOpacity
                    style={styles.removePhotoBtn}
                    onPress={() => setFotoDescarteUri(undefined)}
                  >
                    <Text style={styles.removePhotoText}>Trocar foto</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.photoButtonsRow}>
                  <TouchableOpacity style={styles.photoActionBtn} onPress={tirarFotoComCamera}>
                    <Ionicons name="camera" size={22} color="#047857" />
                    <Text style={styles.photoActionText}>Tirar Foto</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.photoActionBtn} onPress={escolherDaGaleria}>
                    <Ionicons name="images" size={22} color="#047857" />
                    <Text style={styles.photoActionText}>Escolher Arquivo</Text>
                  </TouchableOpacity>
                </View>
              )}

              <Text style={styles.modalLabel}>2. Tipo de material</Text>
              <View style={styles.chipsWrap}>
                {MATERIAIS_OPCOES.map((mat) => {
                  const ativo = materialSelecionado === mat;
                  return (
                    <TouchableOpacity
                      key={mat}
                      style={[styles.chip, ativo && styles.chipActive]}
                      onPress={() => setMaterialSelecionado(mat)}
                    >
                      <Text style={[styles.chipText, ativo && styles.chipTextActive]}>{mat}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={styles.modalLabel}>3. Ecoponto em Osvaldo Cruz - SP</Text>
              <View style={styles.locaisList}>
                {LOCAIS_OSVALDO_CRUZ.map((loc) => {
                  const ativo = localSelecionado === loc;
                  return (
                    <TouchableOpacity
                      key={loc}
                      style={[styles.localOption, ativo && styles.localOptionActive]}
                      onPress={() => setLocalSelecionado(loc)}
                    >
                      <Ionicons
                        name={ativo ? 'radio-button-on' : 'radio-button-off'}
                        size={18}
                        color={ativo ? '#047857' : '#64748B'}
                      />
                      <Text style={[styles.localText, ativo && styles.localTextActive]}>{loc}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <TouchableOpacity style={styles.confirmBtn} onPress={confirmarRegistro}>
                <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                <Text style={styles.confirmBtnText}>Confirmar e Ganhar +50 EcoPontos</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
 const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  desktopRow: {
    gap: 16,
  },
  desktopRowActive: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 24,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 24,
    padding: 16,
    gap: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#0F4C5C',
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 3,
    borderColor: '#047857',
    backgroundColor: '#ECFDF5',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#047857',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F4C5C',
  },
  userCity: {
    fontSize: 13,
    color: '#334155',
    marginTop: 2,
  },
  levelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#D97706',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
  },
  levelText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#92400E',
  },
  statsCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  statsBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#065F46',
  },
  statsNumber: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#047857',
  },
  statsLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 12,
  },
  progressTrack: {
    width: '100%',
    height: 10,
    backgroundColor: '#D1FAE5',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#047857',
    borderRadius: 6,
  },
  miniMetricsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#A7F3D0',
  },
  miniMetricBox: {
    alignItems: 'center',
  },
  miniMetricValue: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#0F4C5C',
  },
  miniMetricLabel: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '600',
  },
  dividerVertical: {
    width: 1,
    height: 28,
    backgroundColor: '#A7F3D0',
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 24,
    padding: 20,
    marginBottom: 22,
    elevation: 3,
    shadowColor: '#0F4C5C',
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  historyTitle: {
    color: '#0F4C5C',
    fontSize: 18,
    fontWeight: 'bold',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyThumb: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#047857',
  },
  emoji: {
    fontSize: 20,
  },
  itemBold: {
    color: '#0F172A',
    fontWeight: 'bold',
    fontSize: 15,
  },
  itemSub: {
    color: '#334155',
    fontSize: 12,
    marginTop: 2,
  },
  itemDate: {
    color: '#047857',
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 2,
  },
  registerBtn: {
    flexDirection: 'row',
    backgroundColor: '#047857',
    paddingVertical: 15,
    paddingHorizontal: 32,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    alignSelf: 'center',
    minWidth: 290,
    elevation: 4,
    shadowColor: '#047857',
    shadowOpacity: 0.28,
    shadowRadius: 6,
  },
  registerText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalBox: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '88%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#0F4C5C',
  },
  modalLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0F4C5C',
    marginTop: 12,
    marginBottom: 8,
  },
  photoButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  photoActionBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#047857',
    backgroundColor: '#ECFDF5',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    gap: 6,
  },
  photoActionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#065F46',
  },
  previewWrapper: {
    alignItems: 'center',
    gap: 8,
  },
  previewImg: {
    width: '100%',
    height: 150,
    borderRadius: 16,
  },
  removePhotoBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
  },
  removePhotoText: {
    color: '#92400E',
    fontSize: 12,
    fontWeight: 'bold',
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  chipActive: {
    backgroundColor: '#0F4C5C',
    borderColor: '#0F4C5C',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  locaisList: {
    gap: 6,
    marginBottom: 18,
  },
  localOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
  },
  localOptionActive: {
    backgroundColor: '#ECFDF5',
  },
  localText: {
    fontSize: 12,
    color: '#334155',
  },
  localTextActive: {
    fontWeight: 'bold',
    color: '#065F46',
  },
  confirmBtn: {
    flexDirection: 'row',
    backgroundColor: '#047857',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 6,
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
