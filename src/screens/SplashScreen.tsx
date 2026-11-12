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
        <View style={styles.iconBox}>
          <Ionicons name="sync-circle" size={110} color="#4CAF50" />
        </View>

        <Text style={styles.brand}>ReciclaSpot</Text>
        <Text style={styles.slogan}>
          Transformando descarte em futuro consciente.
        </Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('MainTabs')}
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
  },
  iconBox: {
    marginBottom: 8,
  },
  brand: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#046A38',
    marginBottom: 8,
  },
  slogan: {
    fontSize: 15,
    fontWeight: '600',
    color: '#046A38',
    textAlign: 'center',
    marginBottom: 28,
    maxWidth: 260,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 14,
  },
  button: {
    backgroundColor: '#135D66',
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 24,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
