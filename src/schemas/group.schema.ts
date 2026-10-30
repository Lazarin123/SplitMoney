import { z } from 'zod';

export const createGroupSchema = z.object({
  name: z.string().min(2, 'O nome do grupo deve ter pelo menos 2 caracteres'),
  description: z.string().optional(),
});

export const addMemberSchema = z.object({
  name: z.string().min(2, 'O nome do integrante deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido').optional(),
});

export const createExpenseSchema = z.object({
  description: z.string().min(1, 'A descrição da despesa é obrigatória'),
  amount: z.number().positive('O valor deve ser maior que zero'),
  payerId: z.string().uuid('ID do pagador inválido'),
  splits: z.array(
    z.object({
      memberId: z.string().uuid('ID do participante inválido'),
      amount: z.number().positive('O valor da divisão deve ser maior que zero'),
    })
  ).optional(),
});
