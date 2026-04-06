"use client";

import { useState, useRef, useCallback } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Eye, EyeOff, Camera, Check, Shield, Star, TrendingUp } from "lucide-react";
import Link from "next/link";

const CARGO_OPTIONS = [
  "Sócio / Proprietário",
  "CEO / Diretor Geral",
  "Diretor de Expansão",
  "Gerente de Franquias",
  "Analista de Franquias",
  "Outro",
];

const SEGMENTO_OPTIONS = [
  { value: "ALIMENTACAO", label: "Alimentação" },
  { value: "SAUDE_BELEZA", label: "Saúde e Beleza" },
  { value: "EDUCACAO", label: "Educação" },
  { value: "SERVICOS", label: "Serviços" },
  { value: "MODA", label: "Moda" },
  { value: "TECNOLOGIA", label: "Tecnologia" },
  { value: "CASA_CONSTRUCAO", label: "Casa e Construção" },
  { value: "AUTOMOTIVO", label: "Automotivo" },
  { value: "ENTRETENIMENTO", label: "Entretenimento" },
  { value: "FINANCEIRO", label: "Financeiro" },
  { value: "LIMPEZA", label: "Limpeza e Higiene" },
  { value: "PETS", label: "Pets" },
  { value: "OUTROS", label: "Outros" },
];

interface WizardState {
  cnpj: string;
  email: string;
  razaoSocial: string;
  nomeFantasia: string;
  municipio: string;
  uf: string;
  emailReceita: string | null;
  firstName: string;
  lastName: string;
  cargo: string;
  celular: string;
  password: string;
  confirmPassword: string;
  logo: string | null;
  descricao: string;
  segmento: string;
}

const TOTAL_STEPS = 7;

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-1.5 mb-8">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s) => (
        <div key={s} className="flex items-center">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              s < current
                ? "w-6 bg-[#1B4D3E]"
                : s === current
                ? "w-6 bg-[#1B4D3E]"
                : "w-2 bg-gray-200"
            }`}
          />
        </div>
      ))}
    </div>
  );
}

function formatCnpj(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 14);
  return d
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

export default function RegistroEmpresaPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [testCode, setTestCode] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [state, setState] = useState<WizardState>({
    cnpj: "",
    email: "",
    razaoSocial: "",
    nomeFantasia: "",
    municipio: "",
    uf: "",
    emailReceita: null,
    firstName: "",
    lastName: "",
    cargo: "",
    celular: "",
    password: "",
    confirmPassword: "",
    logo: null,
    descricao: "",
    segmento: "OUTROS",
  });

  const set = useCallback((patch: Partial<WizardState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  // ─── Step 1: CNPJ + Email ───────────────────────────────────────────────────
  const handleStep1 = async () => {
    const digits = state.cnpj.replace(/\D/g, "");
    if (digits.length !== 14) { setError("Digite um CNPJ válido com 14 dígitos."); return; }
    if (!state.email.includes("@")) { setError("Digite um e-mail válido."); return; }

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register-company/lookup-cnpj", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cnpj: digits }),
      });
      const json = await res.json();
      if (!json.success) { setError(json.error); return; }
      set({
        razaoSocial: json.data.razaoSocial,
        nomeFantasia: json.data.nomeFantasia,
        municipio: json.data.municipio,
        uf: json.data.uf,
        emailReceita: json.data.emailReceita,
      });
      setStep(2);
    } catch {
      setError("Erro ao consultar CNPJ. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Step 2: Confirm + Send Code ───────────────────────────────────────────
  const handleStep2 = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register-company/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: state.email, cnpj: state.cnpj }),
      });
      const json = await res.json();
      if (!json.success) { setError(json.error); return; }
      if (json.devCode) {
        setTestCode(json.devCode);
        setCode(json.devCode.split(""));
      }
      setStep(3);
    } catch {
      setError("Erro ao enviar código. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Step 3: Verify Code ────────────────────────────────────────────────────
  const [code, setCode] = useState(["", "", "", "", ""]);
  const codeRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleCodeInput = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...code];
    next[i] = val.slice(-1);
    setCode(next);
    if (val && i < 4) codeRefs.current[i + 1]?.focus();
  };

  const handleCodeKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[i] && i > 0) {
      codeRefs.current[i - 1]?.focus();
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 5);
    if (pasted.length === 5) {
      setCode(pasted.split(""));
      codeRefs.current[4]?.focus();
    }
  };

  const handleStep3 = async () => {
    const fullCode = code.join("");
    if (fullCode.length !== 5) { setError("Digite o código completo de 5 dígitos."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register-company/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: state.email, cnpj: state.cnpj, code: fullCode }),
      });
      const json = await res.json();
      if (!json.success) { setError(json.error); return; }
      setStep(4);
    } catch {
      setError("Erro ao verificar código.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Step 5: Create Account ─────────────────────────────────────────────────
  const handleStep5 = async () => {
    if (state.password.length < 8) { setError("A senha deve ter pelo menos 8 caracteres."); return; }
    if (!/[A-Z]/.test(state.password)) { setError("A senha deve ter pelo menos uma letra maiúscula."); return; }
    if (!/[0-9]/.test(state.password)) { setError("A senha deve ter pelo menos um número."); return; }
    if (state.password !== state.confirmPassword) { setError("As senhas não coincidem."); return; }

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register-company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: state.email,
          cnpj: state.cnpj,
          razaoSocial: state.razaoSocial,
          firstName: state.firstName,
          lastName: state.lastName,
          cargo: state.cargo,
          celular: state.celular,
          password: state.password,
        }),
      });
      const json = await res.json();
      if (!json.success) { setError(json.error); return; }

      // Auto sign-in
      const signInResult = await signIn("credentials", {
        email: state.email,
        password: state.password,
        redirect: false,
      });
      if (signInResult?.error) { setError("Conta criada, mas erro ao entrar. Faça login."); return; }
      setStep(6);
    } catch {
      setError("Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Step 6: Logo + Description ────────────────────────────────────────────
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set({ logo: reader.result as string });
    reader.readAsDataURL(file);
  };

  const handleStep6 = async () => {
    setLoading(true);
    setError("");
    try {
      const body: Record<string, unknown> = {
        descricao: state.descricao,
        segmento: state.segmento,
      };
      if (state.logo) body.logo = state.logo;

      await fetch("/api/empresa/perfil", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setStep(7);
    } catch {
      // Not critical — user can update later
      setStep(7);
    } finally {
      setLoading(false);
    }
  };

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-lg">
      {/* Header */}
      <div className="mb-8 text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-[#1B4D3E] font-bold text-2xl">
          <div className="h-8 w-8 rounded-lg bg-[#1B4D3E] flex items-center justify-center text-white text-sm font-bold">FA</div>
          Franquia Avalia
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <StepIndicator current={step} />

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {testCode && step === 3 && (
          <div className="mb-5 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            <p className="font-semibold mb-0.5">Modo de teste — e-mail não configurado</p>
            <p>Seu código: <span className="font-mono font-bold tracking-widest text-base">{testCode}</span></p>
            <p className="text-xs text-blue-600 mt-1">Os campos já foram preenchidos automaticamente.</p>
          </div>
        )}

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Crie a página da sua empresa</h1>
            <p className="text-gray-500 text-sm mb-6">Fortaleça a confiança na sua marca com uma página no Franquia Avalia</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">CNPJ</label>
                <input
                  type="text"
                  value={state.cnpj}
                  onChange={(e) => set({ cnpj: formatCnpj(e.target.value) })}
                  placeholder="00.000.000/0000-00"
                  maxLength={18}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#1B4D3E] focus:ring-2 focus:ring-[#1B4D3E]/20 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Seu e-mail de cadastro</label>
                <input
                  type="email"
                  value={state.email}
                  onChange={(e) => set({ email: e.target.value })}
                  placeholder="exemplo@suaempresa.com.br"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#1B4D3E] focus:ring-2 focus:ring-[#1B4D3E]/20 transition"
                />
              </div>
              <button
                onClick={handleStep1}
                disabled={loading}
                className="w-full rounded-lg bg-[#1B4D3E] py-3 text-sm font-semibold text-white transition hover:bg-[#163D31] disabled:opacity-50"
              >
                {loading ? "Consultando..." : "Continuar cadastro"}
              </button>
            </div>

            <p className="mt-6 text-center text-sm text-gray-500">
              Já tem conta?{" "}
              <Link href="/login" className="font-medium text-[#1B4D3E] hover:underline">Entrar</Link>
            </p>
          </div>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <div>
            <button onClick={() => { setStep(1); setError(""); }} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
              <ChevronLeft className="h-4 w-4" /> Voltar
            </button>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Confirme os dados da empresa</h1>
            <p className="text-gray-500 text-sm mb-6">Encontramos estas informações na Receita Federal. Confirme que é a sua empresa.</p>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 mb-6 space-y-3">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Razão Social</p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">{state.razaoSocial}</p>
              </div>
              {state.nomeFantasia && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Nome Fantasia</p>
                  <p className="text-sm text-gray-800 mt-0.5">{state.nomeFantasia}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Localização</p>
                <p className="text-sm text-gray-800 mt-0.5">{[state.municipio, state.uf].filter(Boolean).join(", ") || "—"}</p>
              </div>
              {state.emailReceita && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">E-mail na Receita Federal</p>
                  <p className="text-sm text-gray-800 mt-0.5">{state.emailReceita}</p>
                </div>
              )}
            </div>

            <div className="rounded-lg border border-[#1B4D3E]/20 bg-[#1B4D3E]/5 px-4 py-3 text-sm text-[#1B4D3E] mb-6">
              <p>Um código de verificação será enviado para <strong>{state.email}</strong></p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleStep2}
                disabled={loading}
                className="w-full rounded-lg bg-[#1B4D3E] py-3 text-sm font-semibold text-white transition hover:bg-[#163D31] disabled:opacity-50"
              >
                {loading ? "Enviando código..." : "Sim, sou desta empresa — Enviar código"}
              </button>
              <button
                onClick={() => { setStep(1); setError(""); }}
                className="w-full rounded-lg border border-gray-300 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              >
                Não, voltar e corrigir o CNPJ
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3 ── */}
        {step === 3 && (
          <div>
            <button onClick={() => { setStep(2); setError(""); }} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
              <ChevronLeft className="h-4 w-4" /> Voltar
            </button>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Verifique seu e-mail</h1>
            <p className="text-gray-500 text-sm mb-6">
              Enviamos um código de 5 dígitos para <strong className="text-gray-800">{state.email}</strong>
            </p>

            <div className="flex justify-center gap-3 mb-6" onPaste={handleCodePaste}>
              {code.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { codeRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeInput(i, e.target.value)}
                  onKeyDown={(e) => handleCodeKeyDown(i, e)}
                  className="h-14 w-12 rounded-xl border-2 border-gray-300 text-center text-xl font-bold text-gray-900 outline-none focus:border-[#1B4D3E] focus:ring-2 focus:ring-[#1B4D3E]/20 transition"
                />
              ))}
            </div>

            <button
              onClick={handleStep3}
              disabled={loading || code.join("").length < 5}
              className="w-full rounded-lg bg-[#1B4D3E] py-3 text-sm font-semibold text-white transition hover:bg-[#163D31] disabled:opacity-50 mb-4"
            >
              {loading ? "Verificando..." : "Verificar código"}
            </button>

            <p className="text-center text-sm text-gray-500">
              Não recebeu?{" "}
              <button
                onClick={handleStep2}
                className="font-medium text-[#1B4D3E] hover:underline"
              >
                Reenviar código
              </button>
            </p>
          </div>
        )}

        {/* ── STEP 4 ── */}
        {step === 4 && (
          <div>
            <button onClick={() => { setStep(3); setError(""); }} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
              <ChevronLeft className="h-4 w-4" /> Voltar
            </button>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Crie seu acesso</h1>
            <p className="text-gray-500 text-sm mb-6">Informe seus dados pessoais para criar seu perfil de administrador.</p>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome</label>
                  <input
                    type="text"
                    value={state.firstName}
                    onChange={(e) => set({ firstName: e.target.value })}
                    placeholder="Seu nome"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#1B4D3E] focus:ring-2 focus:ring-[#1B4D3E]/20 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Sobrenome</label>
                  <input
                    type="text"
                    value={state.lastName}
                    onChange={(e) => set({ lastName: e.target.value })}
                    placeholder="Seu sobrenome"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#1B4D3E] focus:ring-2 focus:ring-[#1B4D3E]/20 transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Cargo</label>
                <select
                  value={state.cargo}
                  onChange={(e) => set({ cargo: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#1B4D3E] focus:ring-2 focus:ring-[#1B4D3E]/20 transition bg-white"
                >
                  <option value="">Selecione o seu cargo</option>
                  {CARGO_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">E-mail de acesso</label>
                <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500">
                  {state.email}
                </div>
                <p className="mt-1 text-xs text-gray-400">Você poderá adicionar outros membros após o login</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Celular</label>
                <input
                  type="tel"
                  value={state.celular}
                  onChange={(e) => set({ celular: e.target.value })}
                  placeholder="+55 (00) 00000-0000"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#1B4D3E] focus:ring-2 focus:ring-[#1B4D3E]/20 transition"
                />
              </div>
              <button
                onClick={() => {
                  if (!state.firstName.trim()) { setError("Informe seu nome."); return; }
                  if (!state.lastName.trim()) { setError("Informe seu sobrenome."); return; }
                  setError("");
                  setStep(5);
                }}
                className="w-full rounded-lg bg-[#1B4D3E] py-3 text-sm font-semibold text-white transition hover:bg-[#163D31]"
              >
                Continuar para criação de senha
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 5 ── */}
        {step === 5 && (
          <div>
            <button onClick={() => { setStep(4); setError(""); }} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
              <ChevronLeft className="h-4 w-4" /> Voltar
            </button>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Crie sua senha</h1>
            <p className="text-gray-500 text-sm mb-6">Defina uma senha segura para sua conta.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Senha</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={state.password}
                    onChange={(e) => set({ password: e.target.value })}
                    placeholder="Insira sua senha"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-11 text-sm outline-none focus:border-[#1B4D3E] focus:ring-2 focus:ring-[#1B4D3E]/20 transition"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="rounded-lg bg-gray-50 border border-gray-200 p-4 text-sm space-y-1.5">
                <p className="font-medium text-gray-700 mb-2">Sua senha deve ter:</p>
                {[
                  { label: "8 ou mais caracteres", ok: state.password.length >= 8 },
                  { label: "Letras maiúsculas e minúsculas", ok: /[A-Z]/.test(state.password) && /[a-z]/.test(state.password) },
                  { label: "Pelo menos um número", ok: /[0-9]/.test(state.password) },
                ].map(({ label, ok }) => (
                  <div key={label} className={`flex items-center gap-2 ${ok ? "text-green-700" : "text-gray-500"}`}>
                    <div className={`h-4 w-4 rounded-full flex items-center justify-center ${ok ? "bg-green-100" : "bg-gray-200"}`}>
                      {ok && <Check className="h-2.5 w-2.5" />}
                    </div>
                    <span>{label}</span>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirme a senha</label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={state.confirmPassword}
                    onChange={(e) => set({ confirmPassword: e.target.value })}
                    placeholder="Insira novamente sua senha"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-11 text-sm outline-none focus:border-[#1B4D3E] focus:ring-2 focus:ring-[#1B4D3E]/20 transition"
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleStep5}
                disabled={loading}
                className="w-full rounded-lg bg-[#1B4D3E] py-3 text-sm font-semibold text-white transition hover:bg-[#163D31] disabled:opacity-50"
              >
                {loading ? "Criando conta..." : "Criar acesso e continuar"}
              </button>

              <p className="text-center text-xs text-gray-400">
                Ao concluir, você aceita os{" "}
                <Link href="/termos" className="underline hover:text-gray-600">Termos de uso</Link>{" "}
                e a{" "}
                <Link href="/privacidade" className="underline hover:text-gray-600">Política de privacidade</Link>.
              </p>
            </div>
          </div>
        )}

        {/* ── STEP 6 ── */}
        {step === 6 && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Personalize sua página</h1>
            <p className="text-gray-500 text-sm mb-6">Com logo e descrição, fica mais fácil pros investidores encontrarem e confiarem na sua empresa.</p>

            <div className="space-y-5">
              {/* Logo */}
              <div className="flex flex-col items-center gap-3">
                <div
                  onClick={() => logoInputRef.current?.click()}
                  className="relative h-24 w-24 cursor-pointer rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden hover:border-[#1B4D3E] transition"
                >
                  {state.logo ? (
                    <img src={state.logo} alt="Logo" className="h-full w-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <Camera className="h-8 w-8 text-gray-400 mx-auto mb-1" />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="text-sm font-medium text-[#1B4D3E] hover:underline flex items-center gap-1.5"
                >
                  <Camera className="h-4 w-4" />
                  {state.logo ? "Trocar logo" : "Adicionar logo"}
                </button>
                <p className="text-xs text-gray-400">Formatos .jpg ou .png. Opcional — você pode adicionar depois.</p>
                <input ref={logoInputRef} type="file" accept="image/png,image/jpeg" className="hidden" onChange={handleLogoChange} />
              </div>

              {/* Segmento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Segmento</label>
                <select
                  value={state.segmento}
                  onChange={(e) => set({ segmento: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#1B4D3E] focus:ring-2 focus:ring-[#1B4D3E]/20 transition bg-white"
                >
                  {SEGMENTO_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              {/* Descrição */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-gray-700">Descreva a empresa em poucas palavras</label>
                  <span className="text-xs text-gray-400">{state.descricao.length}/200</span>
                </div>
                <textarea
                  rows={4}
                  maxLength={200}
                  value={state.descricao}
                  onChange={(e) => set({ descricao: e.target.value })}
                  placeholder="Conte sobre sua franquia, diferenciais e valores..."
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#1B4D3E] focus:ring-2 focus:ring-[#1B4D3E]/20 transition"
                />
              </div>

              <button
                onClick={handleStep6}
                disabled={loading}
                className="w-full rounded-lg bg-[#1B4D3E] py-3 text-sm font-semibold text-white transition hover:bg-[#163D31] disabled:opacity-50"
              >
                {loading ? "Salvando..." : "Salvar e continuar"}
              </button>
              <button
                onClick={() => setStep(7)}
                className="w-full text-center text-sm text-gray-400 hover:text-gray-600"
              >
                Pular, personalizar depois
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 7 ── */}
        {step === 7 && (
          <div>
            <div className="text-center mb-6">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 mb-4">
                <Star className="h-7 w-7 fill-amber-400 stroke-amber-400" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Quer transmitir confiança e atrair mais investidores?</h1>
              <p className="text-gray-500 text-sm">Experimente o Kit de Confiança do Franquia Avalia e destaque-se dos concorrentes.</p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 mb-5">
              <div className="flex items-center justify-between mb-4">
                <p className="font-semibold text-gray-900">Kit de Confiança</p>
                <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">Teste grátis por 14 dias</span>
              </div>
              <div className="space-y-3 text-sm">
                {[
                  { icon: Shield, label: "Selo de verificação", desc: "Mostre que sua empresa existe e é confiável" },
                  { icon: TrendingUp, label: "Destaque no ranking", desc: "Apareça em posições privilegiadas nas buscas" },
                  { icon: Star, label: "Página personalizada", desc: "Logo, foto de capa, vídeo e FAQ completo" },
                ].map(({ icon: Icon, label, desc }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1B4D3E]/10">
                      <Icon className="h-4 w-4 text-[#1B4D3E]" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{label}</p>
                      <p className="text-xs text-gray-500">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-gray-400 text-center">Depois, a partir de R$ 49/mês</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => router.push("/empresa")}
                className="w-full rounded-lg bg-[#1B4D3E] py-3 text-sm font-semibold text-white transition hover:bg-[#163D31]"
              >
                Testar gratuitamente
              </button>
              <button
                onClick={() => router.push("/empresa")}
                className="w-full text-center text-sm text-gray-500 hover:text-gray-700 py-1"
              >
                Continuar sem o Kit de Confiança
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
