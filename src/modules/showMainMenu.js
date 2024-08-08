import { searchAnime } from './anime/searchAnime.js';
import { getReleases } from './anime/getReleases.js';
import { getAnimeDetail } from './anime/getAnimeDetail.js';
import { getAnimeEpisodes } from './anime/getAnimeEpisodes.js';
import { select } from "@clack/prompts";

export const showMainMenu = async () => {
  const comando = await select({
    message: "Selecione um comando:",
    options: [
      { value: "searchAnime", label: "Buscar Anime" },
      { value: "getReleases", label: "Obter Lançamentos Recentes" },
      { value: "getAnimeDetail", label: "Obter Detalhes do Anime" },
      { value: "getAnimeEpisodes", label: "Obter Episódios do Anime" },
      { value: "exit", label: "Sair" },
    ],
  });

  switch (comando) {
    case "searchAnime":
      await searchAnime();
      break;
    case "getReleases":
      await getReleases();
      break;
    case "getAnimeDetail":
      await getAnimeDetail();
      break;
    case "getAnimeEpisodes":
      await getAnimeEpisodes();
      break;
    case "exit":
      process.exit();
  }
};
