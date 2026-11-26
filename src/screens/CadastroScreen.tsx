import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Header } from '../components/Header';
import { useRecicla } from '../hooks/useReciclaContext';
import { validarEmail, validarSenha } from '../utils/validadores';

type Props = NativeStackScreenProps<RootStackParamList, 'Cadastro'>;

export function CadastroScreen({ navigation }: Props) {
  const { cadastrarUsuario } = useRecicla();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [bairro, setBairro] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [campoFocado, setCampoFocado] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  async function handleCriarConta() {
    if (!nome.trim() || !email.trim() || !senha.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha seu nome, e-mail e senha para continuar.');
      return;
    }

    if (!validarEmail(email)) {
      Alert.alert('E-mail inválido', 'Digite um endereço de e-mail válido.');
      return;
    }

    if (!validarSenha(senha)) {
      Alert.alert('Senha curta', 'A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Senhas diferentes', 'A senha e a confirmação precisam ser iguais.');
      return;
    }

    try {
      setEnviando(true);
      await cadastrarUsuario({
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        senha,
        cidade: bairro.trim() ? `${bairro.trim()} - Osvaldo Cruz/SP` : 'Osvaldo Cruz - SP',
      });
      navigation.replace('MainTabs');
    } catch (error) {
      Alert.alert(
        'Erro ao cadastrar',
        'Não foi possível salvar seu cadastro. Verifique sua conexão e tente novamente.'
      );
    } finally {
      setEnviando(false);
    }
  }
  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <Header />
      <ScreenWrapper>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.formContainer, isDesktop && styles.formContainerDesktop]}>
            {/* Botão Voltar discreto */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={18} color="#0F4C5C" />
              <Text style={styles.backText}>Voltar</Text>
            </TouchableOpacity>

            {/* Cabeçalho da Tela */}
            <View style={styles.headerBlock}>
              <View style={styles.badgeAmber}>
                <Ionicons name="sparkles" size={14} color="#B45309" />
                <Text style={styles.badgeAmberText}>Comunidade Osvaldo Cruz - SP</Text>
              </View>

              <Text style={styles.title}>Crie sua conta</Text>
              <Text style={styles.subtitle}>
                Cadastre-se para localizar ecopontos e acompanhar seu impacto ambiental.
              </Text>
            </View>

            {/* Card Branco Moderno com Sombra Suave */}
            <View style={styles.card}>
              {/* Nome */}
              <Text style={styles.label}>Nome completo</Text>
              <View
                style={[
                  styles.inputContainer,
                  campoFocado === 'nome' && styles.inputFocused,
                ]}
              >
                <Ionicons name="person-outline" size={19} color="#0F4C5C" />
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Matheus Silva"
                  placeholderTextColor="#64748B"
                  value={nome}
                  onChangeText={setNome}
                  onFocus={() => setCampoFocado('nome')}
                  onBlur={() => setCampoFocado(null)}
                />
              </View>

              {/* E-mail */}
              <Text style={styles.label}>E-mail</Text>
              <View
                style={[
                  styles.inputContainer,
                  campoFocado === 'email' && styles.inputFocused,
                ]}
              >
                <Ionicons name="mail-outline" size={19} color="#0F4C5C" />
                <TextInput
                  style={styles.input}
                  placeholder="seuemail@gmail.com"
                  placeholderTextColor="#64748B"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => setCampoFocado('email')}
                  onBlur={() => setCampoFocado(null)}
                />
              </View>

              {/* Bairro */}
              <Text style={styles.label}>Bairro em Osvaldo Cruz</Text>
              <View
                style={[
                  styles.inputContainer,
                  campoFocado === 'bairro' && styles.inputFocused,
                ]}
              >
                <Ionicons name="location-outline" size={19} color="#D97706" />
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Centro, Jd. Bandeiras, Vila Califórnia..."
                  placeholderTextColor="#64748B"
                  value={bairro}
                  onChangeText={setBairro}
                  onFocus={() => setCampoFocado('bairro')}
                  onBlur={() => setCampoFocado(null)}
                />
              </View>

              {/* Senha */}
              <Text style={styles.label}>Senha</Text>
              <View
                style={[
                  styles.inputContainer,
                  campoFocado === 'senha' && styles.inputFocused,
                ]}
              >
                <Ionicons name="lock-closed-outline" size={19} color="#0F4C5C" />
                <TextInput
                  style={styles.input}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor="#64748B"
                  value={senha}
                  onChangeText={setSenha}
                  secureTextEntry={!mostrarSenha}
                  onFocus={() => setCampoFocado('senha')}
                  onBlur={() => setCampoFocado(null)}
                />
                <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
                  <Ionicons
                    name={mostrarSenha ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#475569"
                  />
                </TouchableOpacity>
              </View>

              {/* Confirmar Senha */}
              <Text style={styles.label}>Confirmar senha</Text>
              <View
                style={[
                  styles.inputContainer,
                  campoFocado === 'confirmar' && styles.inputFocused,
                ]}
              >
                <Ionicons name="shield-checkmark-outline" size={19} color="#047857" />
                <TextInput
                  style={styles.input}
                  placeholder="Repita sua senha"
                  placeholderTextColor="#64748B"
                  value={confirmarSenha}
                  onChangeText={setConfirmarSenha}
                  secureTextEntry={!mostrarSenha}
                  onFocus={() => setCampoFocado('confirmar')}
                  onBlur={() => setCampoFocado(null)}
                />
              </View>

              {/* Botão Principal Verde Esmeralda com Loading */}
              <TouchableOpacity
                activeOpacity={0.85}
                style={[styles.submitBtn, enviando && { opacity: 0.7 }]}
                onPress={handleCriarConta}
                disabled={enviando}
              >
                {enviando ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Text style={styles.submitText}>Criar Minha Conta</Text>
                    <Ionicons name="arrow-forward-circle" size={20} color="#FFFFFF" />
                  </>
                )}
              </TouchableOpacity>

              {/* Rodapé Azul Petróleo */}
              <TouchableOpacity
                style={styles.loginLinkRow}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.loginLinkText}>
                  Já possui cadastro? <Text style={styles.loginLinkBold}>Fazer login</Text>
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
    paddingBottom: 40,
  },
  formContainer: {
    width: '100%',
  },
  formContainerDesktop: {
    maxWidth: 480,
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
    marginBottom: 14,
  },
  backText: {
    color: '#0F4C5C',
    fontWeight: 'bold',
    fontSize: 13,
  },
  headerBlock: {
    alignItems: 'center',
    marginBottom: 20,
  },
  badgeAmber: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 10,
  },
  badgeAmberText: {
    color: '#92400E',
    fontSize: 12,
    fontWeight: 'bold',
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
    maxWidth: 360,
    lineHeight: 20,
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
    shadowOffset: { width: 0, height: 4 },
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
    marginBottom: 14,
    gap: 10,
  },
  inputFocused: {
    borderColor: '#047857',
    backgroundColor: '#ECFDF5',
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
    marginTop: 8,
    elevation: 3,
    shadowColor: '#047857',
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  submitText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginLinkRow: {
    marginTop: 18,
    alignItems: 'center',
  },
  loginLinkText: {
    fontSize: 13,
    color: '#475569',
  },
  loginLinkBold: {
    color: '#0F4C5C',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
