import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Header } from '../components/Header';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('seuemail@gmail.com');
  const [senha, setSenha] = useState('12345678');

  return (
    <ScreenWrapper>
      <Header />
      <View style={styles.content}>
        <Text style={styles.title}>Acesse sua conta</Text>
        <Text style={styles.subtitle}>Entre para gerenciar seus descartes.</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Digite seu email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Digite sua senha</Text>
          <TextInput
            style={styles.input}
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.submitBtn}
            onPress={() => navigation.replace('MainTabs')}
          >
            <Text style={styles.submitText}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#111',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: '#046A38',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#E9F2E4',
    borderWidth: 2,
    borderColor: '#1E88E5',
    borderRadius: 20,
    padding: 20,
  },
  label: {
    color: '#046A38',
    fontWeight: 'bold',
    marginBottom: 6,
    marginLeft: 6,
  },
  input: {
    backgroundColor: '#135D66',
    color: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 16,
    fontSize: 14,
  },
  submitBtn: {
    backgroundColor: '#135D66',
    alignSelf: 'center',
    paddingHorizontal: 32,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 6,
  },
  submitText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
