
import { describe, test, expect } from '@jest/globals';
import {
  validarEmail,
  validarSenha,
  formatarHorarioExibicao,
} from './validadores';

describe('Validadores do ReciclaSpot', () => {
  test('deve validar um e-mail correto', () => {
    expect(validarEmail('matheus.oc@gmail.com')).toBe(true);
  });

  test('deve rejeitar um e-mail inválido', () => {
    expect(validarEmail('matheus.oc@')).toBe(false);
  });

  test('deve aceitar senha com 6 ou mais caracteres', () => {
    expect(validarSenha('123456')).toBe(true);
  });

  test('deve rejeitar senha curta', () => {
    expect(validarSenha('123')).toBe(false);
  });

  test('deve formatar o horário com o ícone', () => {
    expect(formatarHorarioExibicao('08h às 18h')).toBe('🕒 08h às 18h');
  });

  test('deve informar quando o horário não estiver cadastrado', () => {
    expect(formatarHorarioExibicao('')).toBe('🕒 Horário não informado');
  });
});
