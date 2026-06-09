export function onlyDigits(value: unknown) {
  return String(value || '').replace(/\D/g, '');
}

export function normalizeEmail(value: unknown) {
  return String(value || '').trim().toLowerCase();
}

export function normalizeTipo(value: unknown) {
  const tipo = String(value || '');
  if (tipo === 'pessoa' || tipo === 'pessoa-fisica') return 'pessoa_fisica';
  return tipo;
}

export function isValidEmail(value: unknown) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value || '').trim());
}

export function isValidCpf(value: unknown) {
  const cpf = onlyDigits(value);
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let sum = 0;
  for (let index = 0; index < 9; index += 1) sum += Number(cpf[index]) * (10 - index);
  let digit = (sum * 10) % 11;
  if (digit === 10) digit = 0;
  if (digit !== Number(cpf[9])) return false;
  sum = 0;
  for (let index = 0; index < 10; index += 1) sum += Number(cpf[index]) * (11 - index);
  digit = (sum * 10) % 11;
  if (digit === 10) digit = 0;
  return digit === Number(cpf[10]);
}

export function isValidCnpj(value: unknown) {
  return onlyDigits(value).length === 14;
}
