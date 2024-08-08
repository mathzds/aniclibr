import chalk from "chalk";
import { select } from "@clack/prompts";
import Controller from "../../controller/index.js";
import { exec } from "child_process";
import { showMainMenu } from "../showMainMenu.js";

export const getReleases = async () => {
  try {
    const result = await Controller.getReleases();
    const limitedResults = result.slice(0, 10);

    if (Array.isArray(limitedResults) && limitedResults.length > 0) {
      console.log(chalk.green("Lançamentos Recentes:"));

      const choices = limitedResults.map((item) => ({
        value: item,
        label: `${item.title}`,
      }));

      choices.push({ value: null, label: "Sair" });

      const selectedEpisode = await select({
        message: "Selecione um episódio para assistir:",
        options: choices,
      });

      if (selectedEpisode) {
        console.log(chalk.blue(`Você selecionou: ${selectedEpisode.title}`));

        const qualityChoices = [
          { value: selectedEpisode.sdlocation, label: "Qualidade SD" },
          { value: selectedEpisode.location, label: "Qualidade HD" },
          { value: null, label: "Sair" },
        ];

        const selectedQuality = await select({
          message: "Selecione a qualidade:",
          options: qualityChoices,
        });

        if (selectedQuality) {
          console.log(
            chalk.blue(
              `Abrindo ${selectedEpisode.title} na qualidade selecionada...`
            )
          );

          exec(`mpv "${selectedQuality}"`, (error) => {
            if (error) {
              console.error(chalk.red("Erro ao abrir o vídeo com MPV:"), error);
            }
          });
        } else {
          console.log(chalk.yellow("Nenhuma qualidade selecionada. Saindo."));
        }
      } else {
        console.log(chalk.yellow("Nenhum episódio selecionado. Saindo."));
      }
    } else {
      console.log(chalk.yellow("Nenhum lançamento recente encontrado."));
    }
  } catch (error) {
    console.error(chalk.red("Erro ao buscar dados:"), error);
  }

  await showMainMenu();
};
