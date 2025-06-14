import { stripFormatting } from './formatUtils';

export const isValidCpf = cpf => {
  cpf = stripFormatting(cpf).padStart(11,'0');
  if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) return false;
  const calc = t => {
    let sum = 0;
    for (let i = 0; i < t-1; i++) sum += +cpf[i] * (t - i);
    let d = (sum*10) % 11;
    return d === 10 ? 0 : d;
  };
  return calc(10) === +cpf[9] && calc(11) === +cpf[10];
};

export const isValidCnpj = cnpj => {
  cnpj = stripFormatting(cnpj).padStart(14,'0');
  if (!/^\d{14}$/.test(cnpj) || /^(\d)\1{13}$/.test(cnpj)) return false;
  const calc = t => {
    const weights = t === 12
      ? [5,4,3,2,9,8,7,6,5,4,3,2]
      : [6,5,4,3,2,9,8,7,6,5,4,3,2];
    let sum = 0;
    for (let i = 0; i < weights.length; i++) sum += +cnpj[i] * weights[i];
    let d = sum % 11;
    return d < 2 ? 0 : 11 - d;
  };
  return calc(12) === +cnpj[12] && calc(13) === +cnpj[13];
};

export const isValidPassword = pw =>
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(pw);
