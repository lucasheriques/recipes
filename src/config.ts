// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = "Receitas Low Carb e Sem Açúcar";
export const SITE_DESCRIPTION =
  "Bem vindos ao meu catálogo de receitas! Aqui eu coloco todas as receitas que eu já fiz e gostei.";
export const TWITTER_HANDLE = "@lucashenfaria";
export const MY_NAME = "Lucas Faria";

// setup in astro.config.mjs
const BASE_URL = new URL(import.meta.env.SITE);
export const SITE_URL = BASE_URL.origin;
