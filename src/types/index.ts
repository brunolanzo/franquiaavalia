import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string(),
  role: z.enum(["INVESTOR", "FRANCHISEE"]),
  cnpj: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export const companyRegisterSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string(),
  companyName: z.string().min(2, "Nome da empresa é obrigatório"),
  cnpj: z.string().min(14, "CNPJ inválido").max(18, "CNPJ inválido"),
  segmento: z.string().min(1, "Selecione um segmento"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export const leadSchema = z.object({
  nome: z.string().min(2, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  telefone: z.string().optional(),
  mensagem: z.string().optional(),
  capital: z.string().optional(),
  cidade: z.string().optional(),
});

export const avaliacaoSchema = z.object({
  franquiaId: z.string().min(1, "Selecione uma franquia"),
  titulo: z.string().min(5, "Título deve ter pelo menos 5 caracteres").max(100, "Título muito longo"),
  conteudo: z.string().min(50, "Avaliação deve ter pelo menos 50 caracteres").max(3000, "Avaliação muito longa"),
  notaSuporte: z.number().min(1).max(10),
  notaRentabilidade: z.number().min(1).max(10),
  notaTransparencia: z.number().min(1).max(10),
  notaTreinamento: z.number().min(1).max(10),
  notaMarketing: z.number().min(1).max(10),
  notaSatisfacao: z.number().min(1).max(10),
  investiriaNovamente: z.boolean(),
  tempoFranquia: z.string().optional(),
  anonimo: z.boolean(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type CompanyRegisterFormData = z.infer<typeof companyRegisterSchema>;
export type LeadFormData = z.infer<typeof leadSchema>;
export type AvaliacaoFormData = z.infer<typeof avaliacaoSchema>;

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
