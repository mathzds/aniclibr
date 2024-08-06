#!/usr/bin/env node

import chalk from "chalk";
import inquirer from "inquirer";
import Controller from "./controller/index.js";
import { exec } from "child_process";

const showMainMenu = async () => {
  const { comando } = await inquirer.prompt([
    {
      type: "list",
      name: "comando",
      message: "Selecione um comando:",
      choices: [
        "Buscar Anime",
        "Obter Lançamentos Recentes",
        "Obter Detalhes do Anime",
        "Obter Episódios do Anime",
        "Sair",
      ],
    },
  ]);

  switch (comando) {
    case "Buscar Anime":
      await searchAnime();
      break;
    case "Obter Lançamentos Recentes":
      await getReleases();
      break;
    case "Obter Detalhes do Anime":
      await getAnimeDetail();
      break;
    case "Obter Episódios do Anime":
      await getAnimeEpisodes();
      break;
    case "Sair":
      process.exit();
  }
};

const searchAnime = async () => {
    const { query } = await inquirer.prompt([
      {
        type: "input",
        name: "query",
        message: "Digite a busca de anime:",
      },
    ]);
  
    try {
      const result = await Controller.searchAnime({ query });
  
      if (result.length > 0) {
        console.log(chalk.green("Resultados da Busca:"));
        result.forEach((item) => {
          console.log(chalk.blue(`ID: ${item.category_id}`));
          console.log(chalk.blue(`Título: ${item.category_name}`));
        });
      } else {
        console.log(chalk.yellow("Nenhum resultado encontrado."));
      }
    } catch (error) {
      console.error(chalk.red("Erro ao buscar dados:"), error);
    }
    await showMainMenu();
  };
  
const getReleases = async () => {
  try {
    const result = await Controller.getReleases();

    if (Array.isArray(result) && result.length > 0) {
      console.log(chalk.green("Lançamentos Recentes:"));

      const choices = result.map((item) => ({
        name: `${item.title} (ID: ${item.video_id})`,
        value: item,
      }));

      choices.push({ name: "Sair", value: null });

      const episodeAnswers = await inquirer.prompt([
        {
          type: "list",
          name: "selectedEpisode",
          message: "Selecione um episódio para assistir:",
          choices: choices,
        },
      ]);

      const selectedEpisode = episodeAnswers.selectedEpisode;

      if (selectedEpisode) {
        console.log(chalk.blue(`Você selecionou: ${selectedEpisode.title}`));
        const qualityChoices = [
          { name: "Qualidade SD", value: selectedEpisode.sdlocation },
          { name: "Qualidade HD", value: selectedEpisode.location },
          { name: "Sair", value: null },
        ];

        const qualityAnswers = await inquirer.prompt([
          {
            type: "list",
            name: "selectedQuality",
            message: "Selecione a qualidade:",
            choices: qualityChoices,
          },
        ]);

        const selectedQuality = qualityAnswers.selectedQuality;

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

const getAnimeDetail = async () => {
  const { categoryId } = await inquirer.prompt([
    {
      type: "input",
      name: "categoryId",
      message: "Anime ID:",
    },
  ]);

  try {
    const result = await Controller.getAnimeDetail({ categoryId });

    if (result.length > 0 && result[0].response === "success") {
      const anime = result[0];
      console.log(chalk.green("Detalhes do Anime:"));
      console.log(chalk.blue(`Título: ${anime.category_name}`));
      console.log(chalk.blue(`Descrição: ${anime.category_desc}`));
      console.log(chalk.blue(`Favoritos: ${anime.favoritecount}`));
      console.log(chalk.blue(`Gêneros: ${anime.genres}`));
      console.log(chalk.blue(`Ano: ${anime.ano}`));
    } else {
      console.log(chalk.yellow("Detalhes não achados."));
    }
  } catch (error) {
    console.error(chalk.red("Error fetching data:"), error);
  }
  await showMainMenu();
};

const getAnimeEpisodes = async () => {
  const { categoryId } = await inquirer.prompt([
    {
      type: "input",
      name: "categoryId",
      message: "ID do Anime:",
    },
  ]);

  try {
    const result = await Controller.getAnimeEpisodes({ categoryId });

    if (result.length > 0) {
      const choices = result.map((episode) => ({
        name: `${episode.title}`,
        value: episode,
      }));

      const { selectedEpisode } = await inquirer.prompt([
        {
          type: "list",
          name: "selectedEpisode",
          message: "Selecione um episódio:",
          choices: choices,
        },
      ]);

      console.log(chalk.green("Episódio selecionado:"));
      console.log(chalk.blue(`Título: ${selectedEpisode.title}`));

      const videoUrl = selectedEpisode.sdlocation || selectedEpisode.location;
      if (videoUrl) {
        exec(`mpv "${videoUrl}"`, (error) => {
          if (error) {
            console.error(error);
          }
        });
      } else {
        console.log(
          chalk.yellow("Nenhum vídeo disponível para este episódio.")
        );
      }
    } else {
      console.log(chalk.yellow("Nenhum episódio encontrado."));
    }
  } catch (error) {
    console.error(error);
  }
  await showMainMenu();
};

showMainMenu();
