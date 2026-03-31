"use client";

import { useState, useEffect, useCallback } from "react";
import { CheckCircle, XCircle } from "lucide-react";

interface UserItem {
  id: string; name: string; email: string; role: string;
  emailVerified: string | null; createdAt: string; image: string | null;
  _count: { avaliacoes: number };
}

const ROLE_CONFIG: Record<string, { label: string; color: string }> = {
  INVESTOR: { label: "Investidor", color: "bg-gray-100 text-gray-700" },
  FRANCHISEE: { label: "Franqueado", color: "bg-blue-100 text-blue-700" },
  COMPANY: { label: "Empresa", color: "bg-purple-100 text-purple-700" },
  ADMIN: { label: "Admin", color: "bg-red-100 text-red-700" },
};

const tabs = [
  { key: "", label: "Todos" },
  { key: "INVESTOR", label: "Investidores" },
  { key: "FRANCHISEE", label: "Franqueados" },
  { key: "COMPANY", label: "Empresas" },
  { key: "ADMIN", label: "Admins" },
];

export default function AdminUsuariosPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (roleFilter) params.set("role", roleFilter);
    try {
      const res = await fetch(`/api/admin/usuarios?${params}`);
      const data = await res.json();
      if (data.success) {
        setUsers(data.data.users);
        setTotalPages(data.data.pagination.totalPages);
        setTotal(data.data.pagination.total);
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, [page, roleFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Gerenciar Usuários ({total})</h1>

      {/* Tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setRoleFilter(tab.key); setPage(1); }}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${roleFilter === tab.key ? "bg-[#1B4D3E] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 rounded-lg bg-gray-200" />)}</div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto rounded-xl border bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs font-medium uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Papel</th>
                  <th className="px-4 py-3">Avaliações</th>
                  <th className="px-4 py-3">Cadastro</th>
                  <th className="px-4 py-3">Verificado</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((u) => {
                  const role = ROLE_CONFIG[u.role] || ROLE_CONFIG.INVESTOR;
                  return (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                      <td className="px-4 py-3 text-gray-600">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${role.color}`}>{role.label}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{u._count.avaliacoes}</td>
                      <td className="px-4 py-3 text-gray-400">{new Date(u.createdAt).toLocaleDateString("pt-BR")}</td>
                      <td className="px-4 py-3">
                        {u.emailVerified
                          ? <CheckCircle className="h-4 w-4 text-green-500" />
                          : <XCircle className="h-4 w-4 text-red-400" />
                        }
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {users.map((u) => {
              const role = ROLE_CONFIG[u.role] || ROLE_CONFIG.INVESTOR;
              return (
                <div key={u.id} className="rounded-xl border bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">{u.name}</p>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${role.color}`}>{role.label}</span>
                  </div>
                  <p className="text-sm text-gray-500">{u.email}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                    <span>{u._count.avaliacoes} avaliações</span>
                    <span>{new Date(u.createdAt).toLocaleDateString("pt-BR")}</span>
                    {u.emailVerified
                      ? <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                      : <XCircle className="h-3.5 w-3.5 text-red-400" />
                    }
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex justify-center gap-2">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50">Anterior</button>
              <span className="px-3 py-1.5 text-sm text-gray-500">{page} / {totalPages}</span>
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50">Próximo</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
