"use client";

import { useState, useEffect } from "react";
import { Save, Plus, Trash2 } from "lucide-react";

interface FaqItem {
  pergunta: string;
  resposta: string;
}

export default function EmpresaPerfilPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [form, setForm] = useState({
    nome: "", cnpj: "", descricao: "", website: "", telefone: "", email: "",
    investimentoMin: "", investimentoMax: "", taxaFranquia: "", royalties: "",
    prazoRetorno: "", faturamentoMedio: "", unidades: "",
    videoUrl: "", ctaTexto: "", ctaUrl: "",
  });
  const [faq, setFaq] = useState<FaqItem[]>([]);

  useEffect(() => {
    fetch("/api/empresa/perfil")
      .then((r) => r.json())
      .then((r) => {
        if (r.success && r.data) {
          const d = r.data;
          setForm({
            nome: d.nome || "", cnpj: d.cnpj || "", descricao: d.descricao || "",
            website: d.website || "", telefone: d.telefone || "", email: d.email || "",
            investimentoMin: d.investimentoMin ? String(d.investimentoMin) : "",
            investimentoMax: d.investimentoMax ? String(d.investimentoMax) : "",
            taxaFranquia: d.taxaFranquia ? String(d.taxaFranquia) : "",
            royalties: d.royalties || "", prazoRetorno: d.prazoRetorno || "",
            faturamentoMedio: d.faturamentoMedio ? String(d.faturamentoMedio) : "",
            unidades: d.unidades ? String(d.unidades) : "",
            videoUrl: d.videoUrl || "", ctaTexto: d.ctaTexto || "", ctaUrl: d.ctaUrl || "",
          });
          if (d.faq && Array.isArray(d.faq)) setFaq(d.faq);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const body: Record<string, unknown> = {
        descricao: form.descricao, website: form.website, telefone: form.telefone, email: form.email,
        royalties: form.royalties, prazoRetorno: form.prazoRetorno, videoUrl: form.videoUrl,
        ctaTexto: form.ctaTexto, ctaUrl: form.ctaUrl, faq: faq.length > 0 ? faq : undefined,
      };
      if (form.investimentoMin) body.investimentoMin = Number(form.investimentoMin);
      if (form.investimentoMax) body.investimentoMax = Number(form.investimentoMax);
      if (form.taxaFranquia) body.taxaFranquia = Number(form.taxaFranquia);
      if (form.faturamentoMedio) body.faturamentoMedio = Number(form.faturamentoMedio);
      if (form.unidades) body.unidades = Number(form.unidades);

      const res = await fetch("/api/empresa/perfil", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await res.json();
      setMessage(res.ok
        ? { type: "success", text: "Perfil atualizado!" }
        : { type: "error", text: result.error || "Erro ao salvar" }
      );
    } catch {
      setMessage({ type: "error", text: "Erro de conexão" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse space-y-4"><div className="h-8 w-40 rounded bg-gray-200" /><div className="h-96 rounded-xl bg-gray-200" /></div>;
  }

  const inputClass = "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1B4D3E]/20 focus:border-[#1B4D3E]";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Meu Perfil</h1>

      {message && (
        <div className={`mb-4 rounded-lg p-3 text-sm ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {message.text}
        </div>
      )}

      {/* Basic Info */}
      <section className="mb-6 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Informações Básicas</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Nome da Empresa</label>
              <input type="text" value={form.nome} disabled className="w-full rounded-lg border bg-gray-50 px-4 py-2.5 text-sm text-gray-500" />
            </div>
            <div>
              <label className={labelClass}>CNPJ</label>
              <input type="text" value={form.cnpj} disabled className="w-full rounded-lg border bg-gray-50 px-4 py-2.5 text-sm text-gray-500" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Descrição</label>
            <textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} rows={4} className={inputClass} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><label className={labelClass}>Website</label><input type="text" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className={inputClass} /></div>
            <div><label className={labelClass}>Telefone</label><input type="text" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} className={inputClass} /></div>
            <div><label className={labelClass}>Email</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} /></div>
          </div>
        </div>
      </section>

      {/* Investment */}
      <section className="mb-6 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Dados de Investimento</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className={labelClass}>Investimento Mínimo (R$)</label><input type="number" value={form.investimentoMin} onChange={(e) => setForm({ ...form, investimentoMin: e.target.value })} className={inputClass} /></div>
          <div><label className={labelClass}>Investimento Máximo (R$)</label><input type="number" value={form.investimentoMax} onChange={(e) => setForm({ ...form, investimentoMax: e.target.value })} className={inputClass} /></div>
          <div><label className={labelClass}>Taxa de Franquia (R$)</label><input type="number" value={form.taxaFranquia} onChange={(e) => setForm({ ...form, taxaFranquia: e.target.value })} className={inputClass} /></div>
          <div><label className={labelClass}>Royalties</label><input type="text" value={form.royalties} onChange={(e) => setForm({ ...form, royalties: e.target.value })} className={inputClass} placeholder="Ex: 5% do faturamento" /></div>
          <div><label className={labelClass}>Prazo de Retorno</label><input type="text" value={form.prazoRetorno} onChange={(e) => setForm({ ...form, prazoRetorno: e.target.value })} className={inputClass} placeholder="Ex: 18 a 24 meses" /></div>
          <div><label className={labelClass}>Faturamento Médio (R$)</label><input type="number" value={form.faturamentoMedio} onChange={(e) => setForm({ ...form, faturamentoMedio: e.target.value })} className={inputClass} /></div>
          <div><label className={labelClass}>Unidades</label><input type="number" value={form.unidades} onChange={(e) => setForm({ ...form, unidades: e.target.value })} className={inputClass} /></div>
        </div>
      </section>

      {/* Brand Page */}
      <section className="mb-6 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-1 text-lg font-semibold text-gray-900">Brand Page</h2>
        <p className="mb-4 text-xs text-gray-500">Vídeo e FAQ disponíveis nos planos pagos</p>
        <div className="space-y-4">
          <div><label className={labelClass}>URL do Vídeo</label><input type="text" value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} className={inputClass} placeholder="https://youtube.com/..." /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className={labelClass}>CTA Texto</label><input type="text" value={form.ctaTexto} onChange={(e) => setForm({ ...form, ctaTexto: e.target.value })} className={inputClass} placeholder="Ex: Saiba mais" /></div>
            <div><label className={labelClass}>CTA URL</label><input type="text" value={form.ctaUrl} onChange={(e) => setForm({ ...form, ctaUrl: e.target.value })} className={inputClass} /></div>
          </div>

          {/* FAQ */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={labelClass}>FAQ</label>
              <button onClick={() => setFaq([...faq, { pergunta: "", resposta: "" }])} className="flex items-center gap-1 text-sm text-[#1B4D3E] hover:underline">
                <Plus className="h-3 w-3" /> Adicionar
              </button>
            </div>
            {faq.map((item, i) => (
              <div key={i} className="mb-3 rounded-lg border p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Pergunta {i + 1}</span>
                  <button onClick={() => setFaq(faq.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
                <input type="text" value={item.pergunta} onChange={(e) => { const f = [...faq]; f[i].pergunta = e.target.value; setFaq(f); }} className={inputClass} placeholder="Pergunta" />
                <textarea value={item.resposta} onChange={(e) => { const f = [...faq]; f[i].resposta = e.target.value; setFaq(f); }} className={inputClass} rows={2} placeholder="Resposta" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 rounded-lg bg-[#1B4D3E] px-6 py-3 text-sm font-medium text-white hover:bg-[#2D7A5F] transition-colors disabled:opacity-50">
        <Save className="h-4 w-4" /> {saving ? "Salvando..." : "Salvar Alterações"}
      </button>
    </div>
  );
}
