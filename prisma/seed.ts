import { PrismaClient, Segmento, Reputacao } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getReputacao(nota: number, total: number, indiceResposta: number, indiceRecomendacao: number): Reputacao {
  if (total === 0) return "SEM_AVALIACAO";
  if (nota >= 7.0 && total >= 50 && indiceResposta >= 90 && indiceRecomendacao >= 70) return "FA1000";
  if (nota >= 7.5) return "OTIMO";
  if (nota >= 6.0) return "BOM";
  if (nota >= 4.0) return "REGULAR";
  return "NAO_RECOMENDADA";
}

const franquiasData = [
  // Alimentação (5)
  { nome: "Burger Town", segmento: "ALIMENTACAO" as Segmento, investMin: 120000, investMax: 250000, taxa: 45000, royalties: "5% do faturamento", unidades: 230, fundacao: 2012, sede: "São Paulo, SP", faturamento: 85000, prazo: "18 a 24 meses", descricao: "Rede de hamburguerias artesanais com mais de 200 unidades pelo Brasil. Reconhecida pelo sabor autêntico e atendimento rápido." },
  { nome: "Açaí Premium", segmento: "ALIMENTACAO" as Segmento, investMin: 80000, investMax: 150000, taxa: 30000, royalties: "6% do faturamento", unidades: 185, fundacao: 2015, sede: "Rio de Janeiro, RJ", faturamento: 65000, prazo: "12 a 18 meses", descricao: "Maior rede de açaí do Brasil, com bowls personalizáveis e ingredientes selecionados. Presente em 15 estados." },
  { nome: "Pizza Express", segmento: "ALIMENTACAO" as Segmento, investMin: 200000, investMax: 400000, taxa: 60000, royalties: "4% do faturamento", unidades: 120, fundacao: 2010, sede: "Curitiba, PR", faturamento: 120000, prazo: "24 a 30 meses", descricao: "Pizzaria delivery com massa artesanal e ingredientes premium. Modelo de negócio enxuto com foco em delivery." },
  { nome: "Café & Pão", segmento: "ALIMENTACAO" as Segmento, investMin: 150000, investMax: 280000, taxa: 40000, royalties: "5% do faturamento", unidades: 95, fundacao: 2014, sede: "Belo Horizonte, MG", faturamento: 90000, prazo: "18 a 24 meses", descricao: "Padaria e cafeteria gourmet com ambiente acolhedor. Pães artesanais e cafés especiais de origem controlada." },
  { nome: "Sushi Mais", segmento: "ALIMENTACAO" as Segmento, investMin: 180000, investMax: 350000, taxa: 50000, royalties: "5.5% do faturamento", unidades: 78, fundacao: 2016, sede: "São Paulo, SP", faturamento: 110000, prazo: "20 a 28 meses", descricao: "Rede de comida japonesa com conceito fast-casual. Ingredientes frescos e preparo na hora do pedido." },

  // Saúde e Beleza (3)
  { nome: "Beleza Natural", segmento: "SAUDE_BELEZA" as Segmento, investMin: 100000, investMax: 200000, taxa: 35000, royalties: "7% do faturamento", unidades: 210, fundacao: 2008, sede: "São Paulo, SP", faturamento: 75000, prazo: "14 a 20 meses", descricao: "Salão de beleza com foco em tratamentos capilares naturais. Referência em inclusão e diversidade no setor." },
  { nome: "Farma Saúde", segmento: "SAUDE_BELEZA" as Segmento, investMin: 250000, investMax: 500000, taxa: 80000, royalties: "3% do faturamento", unidades: 340, fundacao: 2005, sede: "Goiânia, GO", faturamento: 180000, prazo: "24 a 36 meses", descricao: "Rede de farmácias com foco em atendimento personalizado e produtos de saúde premium. Maior rede do Centro-Oeste." },
  { nome: "Estética Plus", segmento: "SAUDE_BELEZA" as Segmento, investMin: 90000, investMax: 180000, taxa: 25000, royalties: "8% do faturamento", unidades: 145, fundacao: 2017, sede: "Florianópolis, SC", faturamento: 60000, prazo: "12 a 18 meses", descricao: "Clínica de estética acessível com procedimentos não invasivos. Treinamento completo para franqueados." },

  // Educação (3)
  { nome: "Gênio Cursos", segmento: "EDUCACAO" as Segmento, investMin: 60000, investMax: 120000, taxa: 20000, royalties: "10% do faturamento", unidades: 420, fundacao: 2003, sede: "São Paulo, SP", faturamento: 50000, prazo: "12 a 18 meses", descricao: "Escola de cursos profissionalizantes com mais de 50 opções de formação. Presente em todos os estados brasileiros." },
  { nome: "English Now", segmento: "EDUCACAO" as Segmento, investMin: 100000, investMax: 200000, taxa: 40000, royalties: "12% do faturamento", unidades: 280, fundacao: 2006, sede: "Rio de Janeiro, RJ", faturamento: 70000, prazo: "18 a 24 meses", descricao: "Escola de idiomas com metodologia própria focada em conversação. Turmas reduzidas e professores nativos." },
  { nome: "Code School", segmento: "EDUCACAO" as Segmento, investMin: 80000, investMax: 160000, taxa: 30000, royalties: "8% do faturamento", unidades: 65, fundacao: 2019, sede: "Porto Alegre, RS", faturamento: 55000, prazo: "14 a 20 meses", descricao: "Escola de programação e tecnologia para jovens e adultos. Cursos práticos alinhados com o mercado de trabalho." },

  // Serviços (3)
  { nome: "Lava Fácil", segmento: "SERVICOS" as Segmento, investMin: 70000, investMax: 140000, taxa: 25000, royalties: "6% do faturamento", unidades: 190, fundacao: 2013, sede: "Campinas, SP", faturamento: 45000, prazo: "10 a 16 meses", descricao: "Lavanderia self-service com tecnologia de ponta. Modelo econômico com baixo custo operacional." },
  { nome: "Pet Care Brasil", segmento: "SERVICOS" as Segmento, investMin: 110000, investMax: 220000, taxa: 35000, royalties: "5% do faturamento", unidades: 155, fundacao: 2015, sede: "São Paulo, SP", faturamento: 80000, prazo: "16 a 22 meses", descricao: "Rede de pet shops com serviços completos: banho, tosa, veterinário e produtos premium para pets." },
  { nome: "Fix It", segmento: "SERVICOS" as Segmento, investMin: 50000, investMax: 100000, taxa: 15000, royalties: "7% do faturamento", unidades: 88, fundacao: 2018, sede: "Brasília, DF", faturamento: 40000, prazo: "8 a 14 meses", descricao: "Assistência técnica para smartphones e eletrônicos. Modelo compacto ideal para shopping centers." },

  // Moda (2)
  { nome: "Urban Style", segmento: "MODA" as Segmento, investMin: 200000, investMax: 400000, taxa: 60000, royalties: "4% do faturamento", unidades: 130, fundacao: 2011, sede: "São Paulo, SP", faturamento: 150000, prazo: "24 a 36 meses", descricao: "Moda urbana com coleções exclusivas e preços acessíveis. Forte presença nas redes sociais e e-commerce integrado." },
  { nome: "Mini Fashion Kids", segmento: "MODA" as Segmento, investMin: 150000, investMax: 300000, taxa: 45000, royalties: "5% do faturamento", unidades: 95, fundacao: 2014, sede: "Curitiba, PR", faturamento: 100000, prazo: "20 a 28 meses", descricao: "Moda infantil com design moderno e confortável. Tecidos sustentáveis e coleções sazonais exclusivas." },

  // Tecnologia (2)
  { nome: "Tech Solutions", segmento: "TECNOLOGIA" as Segmento, investMin: 130000, investMax: 260000, taxa: 40000, royalties: "6% do faturamento", unidades: 72, fundacao: 2017, sede: "Florianópolis, SC", faturamento: 95000, prazo: "16 a 24 meses", descricao: "Consultoria em transformação digital para pequenas empresas. Soluções de software, cloud e automação." },
  { nome: "Smart Print", segmento: "TECNOLOGIA" as Segmento, investMin: 90000, investMax: 170000, taxa: 30000, royalties: "5% do faturamento", unidades: 110, fundacao: 2016, sede: "São Paulo, SP", faturamento: 60000, prazo: "12 a 18 meses", descricao: "Gráfica digital e comunicação visual. Impressão 3D, personalização de brindes e sinalização." },

  // Outros (2)
  { nome: "Gym Express", segmento: "ENTRETENIMENTO" as Segmento, investMin: 300000, investMax: 600000, taxa: 80000, royalties: "3% do faturamento", unidades: 85, fundacao: 2015, sede: "Rio de Janeiro, RJ", faturamento: 200000, prazo: "30 a 40 meses", descricao: "Academia compacta 24h com modelo low-cost. Equipamentos de última geração e app exclusivo para alunos." },
  { nome: "Clean House", segmento: "LIMPEZA" as Segmento, investMin: 40000, investMax: 80000, taxa: 12000, royalties: "8% do faturamento", unidades: 220, fundacao: 2016, sede: "Belo Horizonte, MG", faturamento: 35000, prazo: "6 a 12 meses", descricao: "Serviço de limpeza residencial e comercial sob demanda. Plataforma digital para agendamento e gestão." },
];

const nomes = [
  "Ana Silva", "Bruno Costa", "Carlos Oliveira", "Daniela Santos", "Eduardo Lima",
  "Fernanda Souza", "Gabriel Pereira", "Helena Rocha", "Igor Almeida", "Julia Ferreira",
  "Karina Mendes", "Lucas Ribeiro", "Mariana Araújo", "Nicolas Barbosa", "Patrícia Gomes",
  "Rafael Cardoso", "Sabrina Martins", "Thiago Nunes", "Vanessa Correia", "William Nascimento",
  "Amanda Campos", "Diego Teixeira", "Elisa Moraes", "Fábio Cavalcanti", "Gabriela Dias",
  "Henrique Vieira", "Isabela Castro", "João Pinto", "Larissa Monteiro", "Mateus Ramos",
];

const titulosPositivos = [
  "Excelente suporte da rede",
  "Muito satisfeito com o retorno",
  "Ótima franquia para investir",
  "Suporte acima da média",
  "Retorno dentro do esperado",
  "Franquia bem estruturada",
  "Treinamento completo e eficaz",
  "Marca forte e reconhecida",
];

const titulosNegativos = [
  "Suporte deixa a desejar",
  "Retorno abaixo do prometido",
  "Falta de transparência",
  "Marketing insuficiente",
  "Precisam melhorar muito",
];

const conteudosPositivos = [
  "Sou franqueado há mais de dois anos e posso dizer que foi uma das melhores decisões que tomei. O suporte da franqueadora é constante, sempre disponível para tirar dúvidas e ajudar com problemas operacionais. O treinamento inicial foi muito completo e me preparou bem para a operação.",
  "O retorno do investimento veio dentro do prazo estimado, o que me deixou muito satisfeito. A marca é forte na região e atrai clientes naturalmente. A equipe de marketing da franqueadora sempre envia materiais de qualidade para campanhas locais.",
  "Excelente rede de franquias. Desde o início, o processo de implantação foi bem organizado. Recebi todo o suporte necessário para abrir a unidade no prazo e com qualidade. O sistema de gestão fornecido é moderno e fácil de usar.",
  "Estou muito satisfeito com a transparência da franqueadora. Todos os números são compartilhados abertamente e as reuniões mensais com os franqueados são muito produtivas. Sinto que faço parte de uma rede que valoriza seus parceiros.",
  "A franquia superou minhas expectativas. O modelo de negócio é sólido, o treinamento é excelente e o suporte pós-abertura é constante. Recomendo para quem busca segurança no investimento.",
];

const conteudosNegativos = [
  "Infelizmente, a experiência não foi como esperava. O suporte demora muito para responder e quando responde, nem sempre resolve. O retorno financeiro está bem abaixo do que foi prometido na apresentação. Espero que melhorem nesses pontos.",
  "Preciso ser honesto: a comunicação da franqueadora precisa melhorar bastante. Muitas decisões são tomadas sem consultar os franqueados e o marketing poderia ser mais efetivo. O produto é bom, mas a gestão da rede precisa evoluir.",
  "O investimento inicial foi maior do que o planejado por causa de custos extras que não foram mencionados no início. O suporte técnico é lento e o treinamento poderia ser mais aprofundado. Tem potencial mas precisa de ajustes importantes.",
];

const tempoOpcoes = ["menos-1-ano", "1-3-anos", "3-5-anos", "5-mais-anos"];

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  console.log("Cleaning database...");
  await prisma.resposta.deleteMany();
  await prisma.avaliacao.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.companyUser.deleteMany();
  await prisma.franqueado.deleteMany();
  await prisma.franquia.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  console.log("Creating users...");
  const passwordHash = await bcrypt.hash("senha123", 12);

  // Create admin
  await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@franquiaavalia.com.br",
      passwordHash,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });

  // Create 30 franchisee users
  const users = [];
  for (let i = 0; i < 30; i++) {
    const user = await prisma.user.create({
      data: {
        name: nomes[i],
        email: `franqueado${i + 1}@email.com`,
        passwordHash,
        role: "FRANCHISEE",
        emailVerified: new Date(),
        franqueado: {
          create: {
            cnpj: `${String(10 + i).padStart(2, "0")}.${rand(100, 999)}.${rand(100, 999)}/0001-${String(rand(10, 99))}`,
            verified: Math.random() > 0.3,
          },
        },
      },
    });
    users.push(user);
  }

  console.log("Creating franchises...");
  const franquias = [];
  for (const data of franquiasData) {
    const franquia = await prisma.franquia.create({
      data: {
        nome: data.nome,
        slug: slugify(data.nome),
        segmento: data.segmento,
        descricao: data.descricao,
        investimentoMin: data.investMin,
        investimentoMax: data.investMax,
        taxaFranquia: data.taxa,
        royalties: data.royalties,
        unidades: data.unidades,
        fundacao: data.fundacao,
        sede: data.sede,
        faturamentoMedio: data.faturamento,
        prazoRetorno: data.prazo,
        cnpj: `${String(rand(10, 99))}.${rand(100, 999)}.${rand(100, 999)}/0001-${String(rand(10, 99))}`,
        email: `contato@${slugify(data.nome)}.com.br`,
        website: `https://www.${slugify(data.nome)}.com.br`,
        telefone: `(${rand(11, 99)}) 9${rand(1000, 9999)}-${rand(1000, 9999)}`,
      },
    });
    franquias.push(franquia);
  }

  console.log("Creating reviews...");
  let avaliacaoCount = 0;
  for (const franquia of franquias) {
    const numAvaliacoes = rand(3, 10);
    const usedUsers = new Set<number>();
    const avaliacoes = [];

    for (let i = 0; i < numAvaliacoes; i++) {
      let userIdx: number;
      do {
        userIdx = rand(0, users.length - 1);
      } while (usedUsers.has(userIdx));
      usedUsers.add(userIdx);

      const isPositive = Math.random() > 0.25;
      const notas = {
        notaSuporte: isPositive ? rand(6, 10) : rand(2, 6),
        notaRentabilidade: isPositive ? rand(5, 10) : rand(2, 5),
        notaTransparencia: isPositive ? rand(6, 10) : rand(2, 6),
        notaTreinamento: isPositive ? rand(6, 10) : rand(3, 6),
        notaMarketing: isPositive ? rand(5, 9) : rand(2, 5),
        notaSatisfacao: isPositive ? rand(7, 10) : rand(2, 5),
      };
      const media = (
        (notas.notaSuporte + notas.notaRentabilidade + notas.notaTransparencia +
         notas.notaTreinamento + notas.notaMarketing + notas.notaSatisfacao) / 6
      );

      const avaliacao = await prisma.avaliacao.create({
        data: {
          franquiaId: franquia.id,
          userId: users[userIdx].id,
          titulo: isPositive ? pick(titulosPositivos) : pick(titulosNegativos),
          conteudo: isPositive ? pick(conteudosPositivos) : pick(conteudosNegativos),
          ...notas,
          notaGeral: Math.round(media * 10) / 10,
          investiriaNovamente: isPositive ? Math.random() > 0.1 : Math.random() > 0.7,
          tempoFranquia: pick(tempoOpcoes),
          anonimo: Math.random() > 0.3,
          status: "APROVADA",
        },
      });
      avaliacoes.push(avaliacao);
      avaliacaoCount++;

      // 60% chance of company response
      if (Math.random() > 0.4) {
        await prisma.resposta.create({
          data: {
            avaliacaoId: avaliacao.id,
            conteudo: isPositive
              ? "Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência."
              : "Agradecemos seu feedback honesto. Vamos analisar seus pontos e trabalhar para melhorar. Entre em contato conosco pelo suporte para resolvermos as questões levantadas.",
          },
        });
      }
    }

    // Calculate scores
    const aprovadas = await prisma.avaliacao.findMany({
      where: { franquiaId: franquia.id, status: "APROVADA" },
      include: { resposta: true },
    });

    const total = aprovadas.length;
    if (total > 0) {
      const sums = aprovadas.reduce(
        (acc, a) => ({
          suporte: acc.suporte + a.notaSuporte,
          rentabilidade: acc.rentabilidade + a.notaRentabilidade,
          transparencia: acc.transparencia + a.notaTransparencia,
          treinamento: acc.treinamento + a.notaTreinamento,
          marketing: acc.marketing + a.notaMarketing,
          satisfacao: acc.satisfacao + a.notaSatisfacao,
        }),
        { suporte: 0, rentabilidade: 0, transparencia: 0, treinamento: 0, marketing: 0, satisfacao: 0 }
      );

      const notaSuporte = Math.round((sums.suporte / total) * 10) / 10;
      const notaRentabilidade = Math.round((sums.rentabilidade / total) * 10) / 10;
      const notaTransparencia = Math.round((sums.transparencia / total) * 10) / 10;
      const notaTreinamento = Math.round((sums.treinamento / total) * 10) / 10;
      const notaMarketing = Math.round((sums.marketing / total) * 10) / 10;
      const notaSatisfacao = Math.round((sums.satisfacao / total) * 10) / 10;
      const notaGeral = Math.round(((notaSuporte + notaRentabilidade + notaTransparencia + notaTreinamento + notaMarketing + notaSatisfacao) / 6) * 10) / 10;

      const comResposta = aprovadas.filter((a) => a.resposta).length;
      const indiceResposta = Math.round((comResposta / total) * 100 * 100) / 100;
      const recomendaram = aprovadas.filter((a) => a.investiriaNovamente).length;
      const indiceRecomendacao = Math.round((recomendaram / total) * 100 * 100) / 100;

      const reputacao = getReputacao(notaGeral, total, indiceResposta, indiceRecomendacao);

      await prisma.franquia.update({
        where: { id: franquia.id },
        data: {
          notaGeral,
          notaSuporte,
          notaRentabilidade,
          notaTransparencia,
          notaTreinamento,
          notaMarketing,
          notaSatisfacao,
          totalAvaliacoes: total,
          indiceResposta,
          indiceRecomendacao,
          reputacao,
          seloVerificada: Math.random() > 0.4,
          seloFA1000: reputacao === "FA1000",
        },
      });
    }
  }

  console.log(`Seed completed!`);
  console.log(`- 1 admin user`);
  console.log(`- 30 franchisee users`);
  console.log(`- ${franquias.length} franchises`);
  console.log(`- ${avaliacaoCount} reviews`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
