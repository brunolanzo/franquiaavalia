"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { registerSchema, type RegisterFormData } from "@/types";
import { Suspense } from "react";

function RegistroForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tipo = searchParams.get("tipo");
  const defaultRole = tipo === "franqueado" ? "FRANCHISEE" : "INVESTOR";

  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: defaultRole,
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setAuthError(result.error || "Erro ao criar conta.");
        return;
      }

      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.error) {
        setAuthError("Conta criada, mas houve erro ao entrar. Tente fazer login.");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setAuthError("Ocorreu um erro. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const roleLabel = selectedRole === "FRANCHISEE" ? "Franqueado" : "Investidor";

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Criar Conta
        </h1>
        <p className="text-center text-sm text-gray-500 mb-6">
          Cadastro como <span className="font-semibold text-[#1B4D3E]">{roleLabel}</span>
          {" · "}
          <Link href="/criar-conta" className="text-[#1B4D3E] hover:underline">
            Alterar tipo
          </Link>
        </p>

        {authError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome completo
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
              placeholder="seu@email.com"
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
              placeholder="Mínimo 6 caracteres"
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

          {/* Hidden role field */}
          <input type="hidden" {...register("role")} />

          {/* Role toggle for users who want to switch */}
          <div className="rounded-lg border border-gray-200 p-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de conta
            </label>
            <div className="flex gap-3">
              <label className={`flex-1 flex items-center justify-center gap-2 cursor-pointer rounded-lg border-2 px-3 py-2.5 text-sm font-medium transition-colors ${selectedRole === "INVESTOR" ? "border-[#1B4D3E] bg-[#1B4D3E]/5 text-[#1B4D3E]" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                <input
                  type="radio"
                  value="INVESTOR"
                  {...register("role")}
                  className="sr-only"
                />
                Investidor
              </label>
              <label className={`flex-1 flex items-center justify-center gap-2 cursor-pointer rounded-lg border-2 px-3 py-2.5 text-sm font-medium transition-colors ${selectedRole === "FRANCHISEE" ? "border-[#1B4D3E] bg-[#1B4D3E]/5 text-[#1B4D3E]" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                <input
                  type="radio"
                  value="FRANCHISEE"
                  {...register("role")}
                  className="sr-only"
                />
                Franqueado
              </label>
            </div>
          </div>

          {selectedRole === "FRANCHISEE" && (
            <div>
              <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 mb-1">
                CNPJ <span className="text-gray-400">(opcional)</span>
              </label>
              <input
                id="cnpj"
                type="text"
                {...register("cnpj")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent outline-none"
                placeholder="00.000.000/0000-00"
              />
              <p className="mt-1 text-xs text-gray-500">
                Você poderá informar depois no seu perfil
              </p>
              {errors.cnpj && (
                <p className="mt-1 text-sm text-red-600">{errors.cnpj.message}</p>
              )}
            </div>
          )}

          {selectedRole === "FRANCHISEE" && (
            <div className="flex items-start gap-2 rounded-lg bg-[#1B4D3E]/5 border border-[#1B4D3E]/10 p-3">
              <svg className="h-4 w-4 text-[#1B4D3E] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              <p className="text-xs text-gray-600">
                <span className="font-medium text-[#1B4D3E]">Privacidade garantida:</span> seus dados pessoais nunca são compartilhados com franqueadoras. Suas avaliações são anônimas por padrão.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#1B4D3E] text-white rounded-lg font-medium hover:bg-[#2D7A5F] transition-colors disabled:opacity-50"
          >
            {isLoading ? "Criando conta..." : "Criar Conta"}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-600">
            Já tem conta?{" "}
            <Link href="/login" className="text-[#1B4D3E] font-medium hover:underline">
              Entre aqui
            </Link>
          </p>
          <p className="text-sm text-gray-600">
            É empresa?{" "}
            <Link href="/registro-empresa" className="text-[#1B4D3E] font-medium hover:underline">
              Cadastre sua franqueadora
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegistroPage() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8 animate-pulse">
          <div className="h-8 w-40 mx-auto rounded bg-gray-200 mb-8" />
          <div className="space-y-4">
            <div className="h-10 rounded bg-gray-200" />
            <div className="h-10 rounded bg-gray-200" />
            <div className="h-10 rounded bg-gray-200" />
            <div className="h-10 rounded bg-gray-200" />
            <div className="h-12 rounded bg-gray-200" />
          </div>
        </div>
      </div>
    }>
      <RegistroForm />
    </Suspense>
  );
}
