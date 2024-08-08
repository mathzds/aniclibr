import chalk from "chalk";
import { text } from "@clack/prompts";
import Controller from "../../controller/index.js";
import { showMainMenu } from "../showMainMenu.js";

export const getAnimeDetail = async () => {
  const categoryId = await text({
    message: "Anime ID:",
  });

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
    console.error(chalk.red("Erro ao buscar dados:"), error);
  }
  await showMainMenu();
};
