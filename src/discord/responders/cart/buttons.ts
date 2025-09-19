import { createResponder, ResponderType } from "#base";
import { res } from "#functions";
import { products } from "#store";
import { sleep } from "@magicyan/discord";
import { inlineCode, TextChannel } from "discord.js";

createResponder({
  customId: "cart/:action/:id/:itens",
  cache: "cached",
  types: [ResponderType.Button],
  parse: (params) => ({
    ...params,
    itens: parseInt(params.itens),
  }),
  async run(interaction, { action, id, itens }) {
    await interaction.deferUpdate();

    const { channel } = interaction;

    if (!(channel instanceof TextChannel)) return;

    const product = products.find((p) => p.id == id);

    if (!product) {
      channel.delete().catch(() => null);
      return;
    }

    switch (action) {
      case "confirm": {
        const stock = product.stock;
        let itensToBuy: string[] = [];
        let stockRemaining: string[] = [];

        for (const [index, item] of stock.entries()) {
          if (index < itens) {
            itensToBuy.push(item);
          } else {
            stockRemaining.push(item);
          }
        }

        const message = itensToBuy.map((i) => i).join(", ");
        await interaction.followUp(
          res.success(
            `Parabéns, aqui estão seus produto(s): ${inlineCode(message)}`
          )
        );
        await sleep.minutes(1);
        channel.delete().catch(() => null);
        return;
      }
      case "cancel": {
        channel.delete().catch(() => null);
        return;
      }
    }
  },
});
