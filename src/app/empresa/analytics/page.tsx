"use client";

import { useState, useEffect } from "react";
import {
  LineChart, Line, BarChart, Bar, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

interface AnalyticsData {
  franquia: {
    nome: string; notaGeral: number | null; notaSuporte: number | null;
    notaRentabilidade: number | null; notaTransparencia: number | null;
    notaTreinamento: number | null; notaMarketing: number | null;
    notaSatisfacao: number | null; totalAvaliacoes: number;
    reputacao: string; indiceResposta: number | null; indiceRecomendacao: number | null;
  };
  segmentAvg: Record<string, number | null>;
  timeSeries: Array<{ month: string; avaliacoes: number; notaMedia: number }>;
  distribution: number[];
  leadsThisMonth: number;
  totalLeads: number;
}

const MONTHS: Record<string, string> = {
  "01": "Jan", "02": "Fev", "03": "Mar", "04": "Abr", "05": "Mai", "06": "Jun",
  "07": "Jul", "08": "Ago", "09": "Set", "10": "Out", "11": "Nov", "12": "Dez",
};

function formatMonth(m: string) {
  const [year, month] = m.split("-");
  return `${MONTHS[month] || month}/${year.slice(2)}`;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/empresa/analytics")
      .then((r) => r.json())
      .then((r) => { if (r.success) setData(r.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="animate-pulse space-y-4"><div className="h-8 w-40 rounded bg-gray-200" /><div className="grid grid-cols-2 gap-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 rounded-xl bg-gray-200" />)}</div><div className="h-64 rounded-xl bg-gray-200" /></div>;
  }

  if (!data) {
    return <div className="rounded-xl border bg-white p-12 text-center"><p className="text-gray-500">Não foi possível carregar os dados</p></div>;
  }

  const { franquia, segmentAvg, timeSeries, distribution } = data;
  const notaColor = (franquia.notaGeral || 0) >= 7.5 ? "text-green-600" : (franquia.notaGeral || 0) >= 6 ? "text-yellow-600" : "text-red-600";

  const radarData = [
    { dim: "Suporte", franquia: franquia.notaSuporte || 0, segmento: segmentAvg.notaSuporte || 0 },
    { dim: "Rentabilidade", franquia: franquia.notaRentabilidade || 0, segmento: segmentAvg.notaRentabilidade || 0 },
    { dim: "Transparência", franquia: franquia.notaTransparencia || 0, segmento: segmentAvg.notaTransparencia || 0 },
    { dim: "Treinamento", franquia: franquia.notaTreinamento || 0, segmento: segmentAvg.notaTreinamento || 0 },
    { dim: "Marketing", franquia: franquia.notaMarketing || 0, segmento: segmentAvg.notaMarketing || 0 },
    { dim: "Satisfação", franquia: franquia.notaSatisfacao || 0, segmento: segmentAvg.notaSatisfacao || 0 },
  ];

  const distData = [
    { range: "1-2", count: distribution[0], fill: "#EF4444" },
    { range: "3-4", count: distribution[1], fill: "#F97316" },
    { range: "5-6", count: distribution[2], fill: "#EAB308" },
    { range: "7-8", count: distribution[3], fill: "#22C55E" },
    { range: "9-10", count: distribution[4], fill: "#16A34A" },
  ];

  const timeData = timeSeries.map((t) => ({ ...t, month: formatMonth(t.month) }));

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-gray-900">Analytics</h1>
      <p className="mb-6 text-sm text-gray-500">{franquia.nome}</p>

      {/* Stat cards */}
      <div className="mb-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Nota Geral</p>
          <p className={`text-3xl font-bold ${notaColor}`}>{franquia.notaGeral?.toFixed(1) || "--"}</p>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Avaliações</p>
          <p className="text-3xl font-bold text-gray-900">{franquia.totalAvaliacoes}</p>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Leads este mês</p>
          <p className="text-3xl font-bold text-blue-600">{data.leadsThisMonth}</p>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Recomendação</p>
          <p className="text-3xl font-bold text-green-600">{franquia.indiceRecomendacao?.toFixed(0) || "--"}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line chart - nota over time */}
        {timeData.length > 0 && (
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <h3 className="mb-4 font-semibold text-gray-900">Evolução da Nota</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={timeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="notaMedia" stroke="#1B4D3E" strokeWidth={2} dot={{ fill: "#1B4D3E" }} name="Nota Média" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Bar chart - volume */}
        {timeData.length > 0 && (
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <h3 className="mb-4 font-semibold text-gray-900">Volume de Avaliações</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={timeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="avaliacoes" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Avaliações" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Distribution */}
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-semibold text-gray-900">Distribuição de Notas</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={distData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" name="Avaliações" radius={[4, 4, 0, 0]}>
                {distData.map((entry, i) => (
                  <rect key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar */}
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-semibold text-gray-900">Comparativo com Segmento</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="dim" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis domain={[0, 10]} tick={{ fontSize: 10 }} />
              <Radar name="Sua franquia" dataKey="franquia" stroke="#1B4D3E" fill="#1B4D3E" fillOpacity={0.3} />
              <Radar name="Média do segmento" dataKey="segmento" stroke="#9CA3AF" fill="#9CA3AF" fillOpacity={0.15} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
