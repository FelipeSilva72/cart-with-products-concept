import { createResponder, ResponderType } from "#base";
import { menus } from "#menus";
import { products } from "#store";
import { TextChannel } from "discord.js";

createResponder({
  customId: "item/:action/:id/:itens",
  cache: "cached",
  types: [ResponderType.Button],
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
      case "add": {
        const totalItens = parseInt(itens) + 1;

        await interaction.editReply(
          menus.product.cart({
            product,
            itens: totalItens,
          })
        );
        return;
      }
      case "remove": {
        const totalItens = parseInt(itens) - 1;

        await interaction.editReply(
          menus.product.cart({
            product,
            itens: totalItens,
          })
        );
        return;
      }
    }
  },
});
