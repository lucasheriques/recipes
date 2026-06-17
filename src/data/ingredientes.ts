/**
 * Lista central dos ingredientes diet que uso nas receitas, com onde comprar.
 * Tudo aqui é, por definição, diet / zero (ou sem adição de) açúcar.
 *
 * É a fonte única: importe `INGREDIENTES` em páginas ou componentes pra
 * mostrar/linkar os produtos sem repetir links espalhados pelo site.
 * Nas receitas, use a tag {% ing id="chocolate-70" %}...{% /ing %} pra linkar.
 */

export type CategoriaIngrediente =
  | "Chocolates"
  | "Laticínios"
  | "Biscoitos"
  | "Outros";

export interface Ingrediente {
  /** Identificador estável, usado pra referenciar o ingrediente nas receitas. */
  id: string;
  /** Nome curto do ingrediente. */
  nome: string;
  /** Marca, quando faz diferença pra encontrar o produto. */
  marca?: string;
  /** Categoria, usada pra agrupar na página. */
  categoria: CategoriaIngrediente;
  /** Descrição curta de pra que serve. */
  descricao: string;
  /** Link de compra (afiliado quando houver). */
  link: string;
  /** Sempre true por aqui — todos os itens são diet. */
  diet: boolean;
}

export const INGREDIENTES = [
  {
    id: "chocolate-70",
    nome: "Chocolate 70%",
    marca: "Laciella",
    categoria: "Chocolates",
    descricao:
      "Barra amarga 70% cacau, zero açúcar. É a manteiga de cacau dele que dá a cremosidade de cafeteria.",
    link: "https://www.mercadolivre.com.br/chocolate-amargo-laciella-zero-acucar-70-cacau-20-barras-20g-cada-caixa/p/MLB24570412",
    diet: true,
  },
  {
    id: "chocolate-branco",
    nome: "Chocolate branco",
    marca: "Laciella",
    categoria: "Chocolates",
    descricao: "Zero açúcar. Pra coberturas, ganaches e doces mais doces.",
    link: "https://www.mercadolivre.com.br/chocolate-branco-laciella-zero-acucar-caixa-20-unidades-20g-cada/p/MLB24848162",
    diet: true,
  },
  {
    id: "chocolate-branco-cookies",
    nome: "Chocolate branco com cookies",
    marca: "Laciella",
    categoria: "Chocolates",
    descricao: "Branco zero açúcar com pedacinhos de cookie.",
    link: "https://www.mercadolivre.com.br/chocolate-branco-zero-acucar-laciella-cookies-caixa-20-tabletes-20g/p/MLB39275278",
    diet: true,
  },
  {
    id: "chocolate-ao-leite",
    nome: "Chocolate ao leite",
    marca: "Laciella",
    categoria: "Chocolates",
    descricao: "Zero açúcar. Pra quem quer menos amargo que o 70%.",
    link: "https://www.mercadolivre.com.br/chocolate-ao-leite-laciella-zero-acucar-20-tabletes-400g/p/MLB53207718",
    diet: true,
  },
  {
    id: "achocolatado",
    nome: "Achocolatado",
    marca: "Gold",
    categoria: "Chocolates",
    descricao: "Zero açúcar. Dá sabor de chocolate sem adicionar gordura.",
    link: "https://amzn.to/3SiWKne",
    diet: true,
  },
  {
    id: "leite-condensado-diet",
    nome: "Leite condensado diet",
    marca: "São Lourenço",
    categoria: "Laticínios",
    descricao: "Zero açúcar, 335g. Base de brigadeiros e doces.",
    link: "https://www.mercadolivre.com.br/leite-condensado-diet-so-lourenco-335g/p/MLB16197476",
    diet: true,
  },
  {
    id: "leite-zero-lactose",
    nome: "Leite integral zero lactose",
    marca: "Leitíssimo",
    categoria: "Laticínios",
    descricao: "Integral, sem lactose, 1L.",
    link: "https://www.loja.verdemaratevoce.com.br/produto/7089/leite-s-lactose-leitissimo-integral-1l",
    diet: true,
  },
  {
    id: "doce-de-leite",
    nome: "Doce de leite",
    marca: "Verdemar",
    categoria: "Laticínios",
    descricao: "Sem adição de açúcar, 400g.",
    link: "https://www.loja.verdemaratevoce.com.br/produto/25201/doce-de-leite-verdemar-s-adicao-de-acucares-400g",
    diet: true,
  },
  {
    id: "oreo-diet",
    nome: '"Oreo" diet',
    categoria: "Biscoitos",
    descricao: "Versão sem açúcar do recheado preto e branco.",
    link: "https://amzn.to/4epzflf",
    diet: true,
  },
  {
    id: "biscoito-maria",
    nome: "Biscoito maria",
    categoria: "Biscoitos",
    descricao: "Zero açúcar. Ótimo pra bases de torta e farofas doces.",
    link: "https://amzn.to/3S6y8y7",
    diet: true,
  },
  {
    id: "farinha-de-amendoas",
    nome: "Farinha de amêndoas",
    categoria: "Outros",
    descricao: "Low carb, pra massas, bolos e biscoitos.",
    link: "https://amzn.to/4uEaypN",
    diet: true,
  },
  {
    id: "extrato-de-baunilha",
    nome: "Extrato de baunilha",
    marca: "Vanilla Brasil",
    categoria: "Outros",
    descricao: "Natural, zero açúcar.",
    link: "https://www.mercadolivre.com.br/extrato-de-baunilha-natural-vanilla-brasil-60-ml-zero-acucar/p/MLB41739126",
    diet: true,
  },
  {
    id: "xarope-de-baunilha-zero",
    nome: "Xarope de baunilha zero",
    categoria: "Outros",
    descricao: "Zero açúcar, pra adoçar e aromatizar bebidas e cafés.",
    link: "https://amzn.to/4vs2GJh",
    diet: true,
  },
] as const satisfies readonly Ingrediente[];

/** Ordem em que as categorias aparecem na página. */
export const ORDEM_CATEGORIAS: readonly CategoriaIngrediente[] = [
  "Chocolates",
  "Laticínios",
  "Biscoitos",
  "Outros",
];

/** Busca um ingrediente pelo id. */
export function getIngrediente(id: string): Ingrediente | undefined {
  return INGREDIENTES.find((i) => i.id === id);
}

/** Descobre a loja a partir do link, pra rotular o botão de compra. */
export function lojaDoLink(link: string): string {
  if (link.includes("mercadolivre") || link.includes("/MLB")) {
    return "Mercado Livre";
  }
  if (link.includes("amzn") || link.includes("amazon")) return "Amazon";
  if (link.includes("verdemar")) return "Verdemar";
  return "loja";
}
