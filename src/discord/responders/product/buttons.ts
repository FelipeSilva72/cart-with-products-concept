import { createResponder, logger, ResponderType } from "#base";
import { res } from "#functions";
import { menus } from "#menus";
import { products } from "#store";
import { createLinkButton, createRow, findChannel } from "@magicyan/discord";
import { ChannelType, TextChannel } from "discord.js";

createResponder({
  customId: "buy/product/:id",
  cache: "cached",
  types: [ResponderType.Button],
  async run(interaction, { id }) {
    await interaction.deferUpdate();

    const product = products.find((p) => p.id == id);

    if (!product) {
      await interaction.editReply(
        res.warning("Desculpe, o produto não existe no banco de dados.")
      );
      return;
    }

    const { guild, member, channel } = interaction;

    if (!(channel instanceof TextChannel)) return;

    const cart = findChannel(guild).byName(`carrinho-${member.id}`);

    if (cart) {
      const row = createRow(
        createLinkButton({
          url: cart.url,
          label: "Ir para Carrinho",
        })
      );

      await interaction.followUp(
        res.primary("Desculpe, você já possui um carrinho em aberto.", row)
      );
      return;
    }

    await guild.channels
      .create({
        name: `carrinho-${member.id}`,
        parent: channel.parentId,
        type: ChannelType.GuildText,
        permissionOverwrites: [
          {
            id: guild.roles.everyone.id,
            deny: ["ViewChannel", "SendMessages", "AddReactions"],
          },
          {
            id: member.id,
            allow: ["ViewChannel"],
          },
        ],
      })
      .then(async (cartCreated) => {
        const message = await cartCreated.send(
          menus.product.cart({
            product,
            itens: 1,
          })
        );

        const row = createRow(
          createLinkButton({
            url: message.url,
            label: "Ir para Carrinho",
          })
        );

        await interaction.followUp(
          res.success("Parabéns, seu carrinho foi iniciado com sucesso.", row)
        );
      })
      .catch(async (err) => {
        logger.error(err);
        await interaction.followUp(
          res.danger("Desculpe, não foi possível iniciar seu carrinho.")
        );
      });
  },
});
