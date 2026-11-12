import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';
import { ScreenWrapper } from '../components/ScreenWrapper';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export function SplashScreen({ navigation }: Props) {
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.badgeAmber}>
          <Ionicons name="leaf" size={14} color="#92400E" />
          <Text style={styles.badgeAmberText}>Osvaldo Cruz • SP</Text>
        </View>

        <View style={styles.iconCircle}>
          <Ionicons name="sync-circle" size={105} color="#047857" />
        </View>

        <Text style={styles.brand}>ReciclaSpot</Text>
        <Text style={styles.slogan}>
          Transformando descarte em futuro consciente.
        </Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.loginBtn}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.signupBtn}
            onPress={() => navigation.navigate('Cadastro')}
          >
            <Text style={styles.buttonText}>Criar conta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#F8FAFC',
  },
  badgeAmber: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#D97706',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 16,
  },
  badgeAmberText: {
    color: '#92400E',
    fontSize: 12,
    fontWeight: 'bold',
  },
  iconCircle: {
    width: 124,
    height: 124,
    borderRadius: 62,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  brand: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#0F4C5C',
    marginBottom: 8,
  },
  slogan: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'center',
    marginBottom: 32,
    maxWidth: 280,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 14,
  },
  loginBtn: {
    backgroundColor: '#0F4C5C',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 16,
  },
  signupBtn: {
    backgroundColor: '#047857',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
