import { stripFormatting } from '../utils/formatUtils';
import { isValidCpf, isValidCnpj, isValidPassword } from '../utils/validationUtils';

export default function useRegisterValidation(type) {
  return function validate(formData) {
    const errors = {};

    if (!formData.name.trim()) errors.name = 'Nome é obrigatório';
    if (!formData.username.trim()) errors.username = 'Username é obrigatório';
    if (type === 'contratante' && !formData.company.trim())
      errors.company = 'Nome da empresa é obrigatório';

    const raw = stripFormatting(formData.cpfCnpj);
    if (raw.length === 11) {
      if (!isValidCpf(formData.cpfCnpj)) errors.cpfCnpj = 'CPF inválido';
    } else if (raw.length === 14) {
      if (!isValidCnpj(formData.cpfCnpj)) errors.cpfCnpj = 'CNPJ inválido';
    } else {
      errors.cpfCnpj = 'Informe CPF ou CNPJ válido';
    }

    if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = 'Email inválido';

    if (!isValidPassword(formData.password))
      errors.password = 'Senha deve ter ≥8 caracteres, 1 letra, 1 número e 1 símbolo';

    return errors;
  };
}
