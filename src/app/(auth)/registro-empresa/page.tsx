"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { companyRegisterSchema, type CompanyRegisterFormData } from "@/types";

const SEGMENTO_OPTIONS = [
  { value: "ALIMENTACAO", label: "Alimentacao" },
  { value: "SAUDE_BELEZA", label: "Saude e Beleza" },
  { value: "EDUCACAO", label: "Educacao" },
  { value: "SERVICOS", label: "Servicos" },
  { value: "MODA", label: "Moda" },
  { value: "TECNOLOGIA", label: "Tecnologia" },
  { value: "CASA_CONSTRUCAO", label: "Casa e Construcao" },
  { value: "AUTOMOTIVO", label: "Automotivo" },
  { value: "ENTRETENIMENTO", label: "Entretenimento" },
  { value: "FINANCEIRO", label: "Financeiro" },
  { value: "LIMPEZA", label: "Limpeza" },
  { value: "PETS", label: "Pets" },
  { value: "OUTROS", label: "Outros" },
];

export default function RegistroEmpresaPage() {
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyRegisterFormData>({
    resolver: zodResolver(companyRegisterSchema),
    defaultValues: {
      segmento: "",
    },
  });

  const onSubmit = async (data: CompanyRegisterFormData) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const res = await fetch("/api/auth/register-company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setAuthError(result.error || "Erro ao cadastrar empresa.");
        return;
      }

      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.error) {
        setAuthError("Empresa cadastrada, mas houve erro ao entrar. Tente fazer login.");
      } else {
        router.push("/");
      }
    } catch {
      setAuthError("Ocorreu um erro. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Cadastrar Franqueadora
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Reivindique a pagina da sua franquia
        </p>

        {authError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Responsavel
            </label>
            <input
              id="name"
              type="text"
              {...register("name")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent outline-none"
              placeholder="Seu nome completo"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent outline-none"
              placeholder="empresa@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent outline-none"
              placeholder="Minimo 6 caracteres"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar Senha
            </label>
            <input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent outline-none"
              placeholder="Repita sua senha"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Empresa
            </label>
            <input
              id="companyName"
              type="text"
              {...register("companyName")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent outline-none"
              placeholder="Nome da franqueadora"
            />
            {errors.companyName && (
              <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 mb-1">
              CNPJ
            </label>
            <input
              id="cnpj"
              type="text"
              {...register("cnpj")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent outline-none"
              placeholder="00.000.000/0000-00"
            />
            {errors.cnpj && (
              <p className="mt-1 text-sm text-red-600">{errors.cnpj.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="segmento" className="block text-sm font-medium text-gray-700 mb-1">
              Segmento
            </label>
            <select
              id="segmento"
              {...register("segmento")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent outline-none bg-white"
            >
              <option value="">Selecione um segmento</option>
              {SEGMENTO_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.segmento && (
              <p className="mt-1 text-sm text-red-600">{errors.segmento.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#1B4D3E] text-white rounded-lg font-medium hover:bg-[#2D7A5F] transition-colors disabled:opacity-50"
          >
            {isLoading ? "Cadastrando..." : "Cadastrar Empresa"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Ja tem conta?{" "}
            <Link href="/login" className="text-[#1B4D3E] font-medium hover:underline">
              Entre aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
