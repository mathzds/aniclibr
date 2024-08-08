import chalk from "chalk";
import { text } from "@clack/prompts";
import Controller from "../../controller/index.js";
import { showMainMenu } from "../showMainMenu.js";

export const searchAnime = async () => {
  const query = await text({
    message: "Digite a busca de anime:",
  });

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
