import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRecicla } from '../hooks/useReciclaContext';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Header } from '../components/Header';

const fotoPerfilLocal = require('../img/perfil.jpg');

export function PerfilScreen() {
  const { usuario, adicionarDescarte } = useRecicla();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const co2Evitado = (usuario.pontosReciclagem * 1.8).toFixed(1);

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F6F8' }}>
      <Header titulo="Meu Perfil" />
      <ScreenWrapper>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <View style={[styles.desktopRow, isDesktop && styles.desktopRowActive]}>
            {/* Coluna Esquerda: Cartão do Usuário + Estatísticas */}
            <View style={isDesktop ? { flex: 1 } : undefined}>
              <View style={styles.profileCard}>
                <View style={styles.avatarContainer}>
                  <Image
                    source={fotoPerfilLocal}
                    style={styles.avatar}
                    resizeMode="cover"
                  />
                  <View style={styles.verifiedBadge}>
                    <Ionicons name="leaf" size={14} color="#FFF" />
                  </View>
                </View>

                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{usuario.nome}</Text>
                  <Text style={styles.userCity}>📍 Osvaldo Cruz - SP</Text>
                  <View style={styles.levelPill}>
                    <Ionicons name="trophy" size={13} color="#046A38" />
                    <Text style={styles.levelText}>Guardião Verde • Nível 3</Text>
                  </View>
                </View>
              </View>

              {/* Card Principal de Descartes */}
              <View style={styles.statsCard}>
                <View style={styles.statsHeader}>
                  <Ionicons name="checkmark-circle" size={24} color="#046A38" />
                  <Text style={styles.statsBadgeText}>Meta Mensal: 20 descartes</Text>
                </View>

                <Text style={styles.statsNumber}>{usuario.pontosReciclagem}</Text>
                <Text style={styles.statsLabel}>Descartes Conscientes Realizados</Text>

                {/* Barra de Progresso */}
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${Math.min((usuario.pontosReciclagem / 20) * 100, 100)}%` },
                    ]}
                  />
                </View>

                {/* Mini métricas extras */}
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

            {/* Coluna Direita: Histórico de Contribuições em Osvaldo Cruz */}
            <View style={[styles.historyCard, isDesktop && { flex: 1.25 }]}>
              <View style={styles.historyHeader}>
                <Ionicons name="time-outline" size={22} color="#A7F3D0" />
                <Text style={styles.historyTitle}>Últimas Contribuições</Text>
              </View>

              <View style={styles.historyItem}>
                <View style={styles.iconCircle}>
                  <Text style={styles.emoji}>🖥️</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemBold}>Lixo Eletrônico</Text>
                  <Text style={styles.itemSub}>Ecoponto Central Vargas • Centro</Text>
                  <Text style={styles.itemDate}>Há 2 dias • +50 pts</Text>
                </View>
              </View>

              <View style={styles.historyItem}>
                <View style={styles.iconCircle}>
                  <Text style={styles.emoji}>🛢️</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemBold}>Óleo de Cozinha</Text>
                  <Text style={styles.itemSub}>Cooperativa Verde • Jd. Bandeiras</Text>
                  <Text style={styles.itemDate}>12/Out • +50 pts</Text>
                </View>
              </View>

              <View style={styles.historyItem}>
                <View style={styles.iconCircle}>
                  <Text style={styles.emoji}>🔋</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemBold}>Pilhas e Baterias</Text>
                  <Text style={styles.itemSub}>Ponto Eco • Jd. Paulista</Text>
                  <Text style={styles.itemDate}>05/Set • +50 pts</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Botão de Ação */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.registerBtn}
            onPress={adicionarDescarte}
          >
            <Ionicons name="camera" size={20} color="#FFFFFF" />
            <Text style={styles.registerText}>Registrar Novo Descarte (+1)</Text>
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
    borderRadius: 24,
    padding: 16,
    gap: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
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
    borderColor: '#046A38',
    backgroundColor: '#D1FAE5',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#046A38',
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
    color: '#111827',
  },
  userCity: {
    fontSize: 13,
    color: '#4B5563',
    marginTop: 2,
  },
  levelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#DCFCE7',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
  },
  levelText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#046A38',
  },
  statsCard: {
    backgroundColor: '#E9F2E4',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  statsBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#046A38',
  },
  statsNumber: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#046A38',
  },
  statsLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
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
    backgroundColor: '#046A38',
    borderRadius: 6,
  },
  miniMetricsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#C6E6C3',
  },
  miniMetricBox: {
    alignItems: 'center',
  },
  miniMetricValue: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#135D66',
  },
  miniMetricLabel: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '600',
  },
  dividerVertical: {
    width: 1,
    height: 28,
    backgroundColor: '#C6E6C3',
  },
  historyCard: {
    backgroundColor: '#135D66',
    borderRadius: 24,
    padding: 20,
    marginBottom: 22,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.12,
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
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    gap: 12,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 20,
  },
  itemBold: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  itemSub: {
    color: '#E0F2F1',
    fontSize: 12,
    marginTop: 2,
  },
  itemDate: {
    color: '#A7F3D0',
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 2,
  },
  registerBtn: {
    flexDirection: 'row',
    backgroundColor: '#046A38',
    paddingVertical: 15,
    paddingHorizontal: 32,
borderRadius: 26,
alignItems: 'center',
justifyContent: 'center',
gap: 10,
alignSelf: 'center',
minWidth: 290,
elevation: 4,
shadowColor: '#046A38',
shadowOpacity: 0.3,
shadowRadius: 6,
},
registerText: {
color: '#FFFFFF',
fontWeight: 'bold',
fontSize: 16,
},
});