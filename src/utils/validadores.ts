export function validarEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
}

export function validarSenha(senha: string): boolean {
  return senha.trim().length >= 6;
}

export function formatarHorarioExibicao(horario: string): string {
  return horario.trim() ? `🕒 ${horario.trim()}` : '🕒 Horário não informado';
}
