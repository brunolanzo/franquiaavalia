import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1F2937] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: About */}
          <div>
            <h3 className="text-lg font-bold text-white">Franquia Avalia</h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-400">
              A plataforma brasileira de avaliação de franquias. Pesquise,
              compare e avalie franquias antes de investir seu dinheiro.
            </p>
            <div className="mt-4 flex items-start gap-2 rounded-lg bg-gray-800 p-3">
              <svg className="h-4 w-4 text-[#2D7A5F] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              <p className="text-xs text-gray-400">
                <span className="font-medium text-gray-300">Privacidade garantida:</span> dados pessoais dos franqueados nunca são compartilhados com as franqueadoras.
              </p>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
              Navegacao
            </h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/rankings"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Rankings
                </Link>
              </li>
              <li>
                <Link
                  href="/comparar"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Comparar
                </Link>
              </li>
              <li>
                <Link
                  href="/busca"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Busca
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: For Companies */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
              Para Empresas
            </h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/cadastrar-empresa"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Cadastrar Empresa
                </Link>
              </li>
              <li>
                <Link
                  href="/planos"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Planos
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
              Contato
            </h4>
            <ul className="mt-3 space-y-2">
              <li>
                <a
                  href="mailto:contato@franquiaavalia.com.br"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  contato@franquiaavalia.com.br
                </a>
              </li>
              <li className="flex items-center gap-3 pt-2">
                {/* Social icons placeholder */}
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 text-xs text-gray-400">
                  in
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 text-xs text-gray-400">
                  ig
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 text-xs text-gray-400">
                  yt
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700">
        <div className="mx-auto max-w-7xl px-4 py-4 lg:px-8">
          <p className="text-center text-xs text-gray-500">
            &copy; 2026 Franquia Avalia. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
