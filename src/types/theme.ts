import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  titulo?: string;
}

export function Header({ titulo = 'ReciclaSpot' }: HeaderProps) {
  return (
    <View style={styles.fullBar}>
      <View style={styles.innerBar}>
        <View style={styles.logoCircle}>
          <Ionicons name="leaf" size={22} color="#065F46" />
        </View>
        <Text style={styles.titulo}>{titulo}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullBar: {
    backgroundColor: '#047857',
    width: '100%',
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#09333E',
    shadowOpacity: 0.18,
    shadowRadius: 6,
  },
  innerBar: {
    width: '100%',
    maxWidth: 1120,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 12,
  },
  logoCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
