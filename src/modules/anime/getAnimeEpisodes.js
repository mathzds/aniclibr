import chalk from "chalk";
import { select, text } from "@clack/prompts";
import Controller from "../../controller/index.js";
import { exec } from "child_process";
import { showMainMenu } from './showMainMenu.js';

export const getAnimeEpisodes = async () => {
  const categoryId = await text({
    message: "ID do Anime:",
  });

  try {
    const result = await Controller.getAnimeEpisodes({ categoryId });

    if (result.length > 0) {
      const pageSize = 10;
      const pages = Math.ceil(result.length / pageSize);

      let currentPage = 1;

      while (true) {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, result.length);
        const currentEpisodes = result.slice(startIndex, endIndex);

        const episodeChoices = currentEpisodes.map((episode, index) => ({
          value: episode,
          label: `${episode.title}`,
        }));

        const navigationChoices = [
          { value: 'prev', label: 'Página Anterior' },
          { value: 'next', label: 'Página Seguinte' },
          { value: 'input', label: 'Inserir número da página' },
          { value: null, label: 'Sair' },
        ];

        const choices = [...episodeChoices, ...navigationChoices];

        const userChoice = await select({
          message: `Selecione um episódio ou uma opção:\nPágina ${currentPage} de ${pages}`,
          options: choices,
        });

        if (userChoice === 'prev') {
          if (currentPage > 1) {
            currentPage--;
          } else {
            console.log(chalk.yellow("Você já está na primeira página."));
          }
        } else if (userChoice === 'next') {
          if (currentPage < pages) {
            currentPage++;
          } else {
            console.log(chalk.yellow("Você já está na última página."));
          }
        } else if (userChoice === 'input') {
          const pageNumber = await text({
            message: "Digite o número da página:",
          });

          const page = parseInt(pageNumber);
          if (page >= 1 && page <= pages) {
            currentPage = page;
          } else {
            console.log(chalk.yellow("Número da página inválido."));
          }
        } else if (userChoice) {
          console.log(chalk.green("Episódio selecionado:"));
          console.log(chalk.blue(`Título: ${userChoice.title}`));

          const videoUrl = userChoice.sdlocation || userChoice.location;
          if (videoUrl) {
            exec(`mpv "${videoUrl}"`, (error) => {
              if (error) {
                console.error(chalk.red("Erro ao abrir o vídeo com MPV:"), error);
              }
            });
          } else {
            console.log(chalk.yellow("Nenhum vídeo disponível para este episódio."));
          }
        } else {
          console.log(chalk.yellow("Nenhuma opção selecionada. Saindo."));
          break;
        }
      }
    } else {
      console.log(chalk.yellow("Nenhum episódio encontrado."));
    }
  } catch (error) {
    console.error(chalk.red("Erro ao buscar dados:"), error);
  }

  await showMainMenu();
};
