"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Search, Menu, X, User, LogOut, ChevronDown, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { data: session } = useSession();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      router.push(`/busca?q=${encodeURIComponent(trimmed)}`);
      setSearchQuery("");
      setMobileMenuOpen(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="mx-auto flex h-[70px] max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Left: Logo */}
        <Link href="/" className="flex flex-col leading-tight">
          <span className="text-xl font-bold text-[#1B4D3E]">
            Franquia Avalia
          </span>
          <span className="hidden text-xs text-gray-500 sm:block">
            Avalie antes de investir
          </span>
        </Link>

        {/* Center: Search bar (desktop) */}
        <form
          onSubmit={handleSearch}
          className="mx-6 hidden w-full max-w-md md:flex"
        >
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar franquia..."
              className="h-10 w-full rounded-lg border border-gray-300 pl-10 pr-4 text-sm text-[#1F2937] placeholder:text-gray-400 focus:border-[#1B4D3E] focus:outline-none focus:ring-1 focus:ring-[#1B4D3E]"
            />
          </div>
        </form>

        {/* Right: Actions (desktop) */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href={session?.user ? "/dashboard/avaliar" : "/login?callbackUrl=/dashboard/avaliar"}
            className="rounded-lg bg-[#F59E0B] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#D97706]"
          >
            Avaliar Franquia
          </Link>

          {session?.user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-[#1F2937] transition-colors hover:bg-gray-50"
              >
                <User className="h-4 w-4" />
                <span className="max-w-[120px] truncate">
                  {session.user.name ?? "Usuário"}
                </span>
                <ChevronDown
                  className={cn(
                    "h-3 w-3 transition-transform",
                    userDropdownOpen && "rotate-180"
                  )}
                />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                  {(session.user as { role?: string }).role === "ADMIN" && (
                    <Link
                      href="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[#1B4D3E] font-medium hover:bg-gray-50"
                    >
                      <Shield className="h-4 w-4" />
                      Painel Admin
                    </Link>
                  )}
                  <Link
                    href="/dashboard"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-[#1F2937] hover:bg-gray-50"
                  >
                    <User className="h-4 w-4" />
                    Painel
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/criar-conta"
                className="rounded-lg bg-[#1B4D3E] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2D7A5F]"
              >
                Criar Conta
              </Link>
              <Link
                href="/login"
                className="rounded-lg border border-[#1B4D3E] px-4 py-2 text-sm font-medium text-[#1B4D3E] transition-colors hover:bg-[#1B4D3E] hover:text-white"
              >
                Entrar
              </Link>
            </>
          )}
        </div>

        {/* Mobile: hamburger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-lg p-2 text-[#1F2937] hover:bg-gray-100 md:hidden"
          aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 pb-4 md:hidden">
          {/* Mobile search */}
          <form onSubmit={handleSearch} className="py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar franquia..."
                className="h-10 w-full rounded-lg border border-gray-300 pl-10 pr-4 text-sm text-[#1F2937] placeholder:text-gray-400 focus:border-[#1B4D3E] focus:outline-none focus:ring-1 focus:ring-[#1B4D3E]"
              />
            </div>
          </form>

          <div className="flex flex-col gap-2">
            <Link
              href={session?.user ? "/dashboard/avaliar" : "/login?callbackUrl=/dashboard/avaliar"}
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg bg-[#F59E0B] px-4 py-2.5 text-center text-sm font-bold text-white transition-colors hover:bg-[#D97706]"
            >
              Avaliar Franquia
            </Link>

            {session?.user ? (
              <>
                {(session.user as { role?: string }).role === "ADMIN" && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-[#1B4D3E] hover:bg-gray-50"
                  >
                    <Shield className="h-4 w-4" />
                    Painel Admin
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm text-[#1F2937] hover:bg-gray-50"
                >
                  <User className="h-4 w-4" />
                  Painel
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm text-red-600 hover:bg-gray-50"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/criar-conta"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg bg-[#1B4D3E] px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-[#2D7A5F]"
                >
                  Criar Conta
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg border border-[#1B4D3E] px-4 py-2.5 text-center text-sm font-medium text-[#1B4D3E] transition-colors hover:bg-[#1B4D3E] hover:text-white"
                >
                  Entrar
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
