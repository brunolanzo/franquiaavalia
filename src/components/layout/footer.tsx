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
              A plataforma brasileira de avaliacao de franquias. Pesquise,
              compare e avalie franquias antes de investir seu dinheiro.
            </p>
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
