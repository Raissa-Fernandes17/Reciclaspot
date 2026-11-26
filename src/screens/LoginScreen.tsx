
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Header } from '../components/Header';
import { useRecicla } from '../hooks/useReciclaContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const { loginUsuario } = useRecicla();

  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  async function handleEntrar() {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Preencha seu e-mail e sua senha.');
      return;
    }

    try {
      setEnviando(true);

      await loginUsuario(email.trim(), senha);

      navigation.replace('MainTabs');
    } catch (error) {
      const mensagem =
        error instanceof Error
          ? error.message
          : 'Não foi possível entrar. Verifique seus dados e tente novamente.';

      Alert.alert('Erro ao entrar', mensagem);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <Header />

      <ScreenWrapper>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View
            style={[
              styles.formContainer,
              isDesktop && styles.formContainerDesktop,
            ]}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backBtn}
            >
              <Ionicons name="arrow-back" size={18} color="#0F4C5C" />
              <Text style={styles.backText}>Voltar</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Acesse sua conta</Text>

            <Text style={styles.subtitle}>
              Entre para gerenciar seus descartes conscientes.
            </Text>

            <View style={styles.card}>
              <Text style={styles.label}>E-mail</Text>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail-outline"
                  size={19}
                  color="#0F4C5C"
                />

                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Digite seu e-mail"
                  placeholderTextColor="#94A3B8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <Text style={styles.label}>Senha</Text>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={19}
                  color="#0F4C5C"
                />

                <TextInput
                  style={styles.input}
                  value={senha}
                  onChangeText={setSenha}
                  placeholder="Digite sua senha"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!mostrarSenha}
                  autoCapitalize="none"
                />

                <TouchableOpacity
                  onPress={() => setMostrarSenha(!mostrarSenha)}
                >
                  <Ionicons
                    name={mostrarSenha ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#64748B"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                activeOpacity={0.85}
                style={[
                  styles.submitBtn,
                  enviando && styles.submitBtnDisabled,
                ]}
                onPress={handleEntrar}
                disabled={enviando}
              >
                {enviando ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Text style={styles.submitText}>Entrar</Text>
                    <Ionicons
                      name="log-in-outline"
                      size={20}
                      color="#FFFFFF"
                    />
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.linkRow}
                onPress={() => navigation.navigate('Cadastro')}
                disabled={enviando}
              >
                <Text style={styles.linkText}>
                  Ainda não tem conta?{' '}
                  <Text style={styles.linkBold}>Criar conta</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ScreenWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    width: '100%',
  },
  formContainerDesktop: {
    maxWidth: 460,
    alignSelf: 'center',
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
    marginBottom: 16,
  },
  backText: {
    color: '#0F4C5C',
    fontWeight: 'bold',
    fontSize: 13,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0F4C5C',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#334155',
    marginTop: 4,
    marginBottom: 22,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 24,
    padding: 24,
    elevation: 4,
    shadowColor: '#0F4C5C',
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  label: {
    color: '#0F4C5C',
    fontWeight: 'bold',
    fontSize: 13,
    marginBottom: 6,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 16,
    gap: 10,
  },
  input: {
    flex: 1,
    color: '#0F172A',
    fontSize: 14,
  },
  submitBtn: {
    flexDirection: 'row',
    backgroundColor: '#047857',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 15,
    borderRadius: 16,
    marginTop: 6,
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  submitText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  linkRow: {
    marginTop: 18,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 13,
    color: '#334155',
  },
  linkBold: {
    color: '#0F4C5C',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
