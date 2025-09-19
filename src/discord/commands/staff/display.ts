import { createCommand, logger } from "#base";
import { res } from "#functions";
import { menus } from "#menus";
import { products } from "#store";
import { createLinkButton, createRow, limitText } from "@magicyan/discord";
import { ApplicationCommandOptionType, TextChannel } from "discord.js";

createCommand({
  name: "exibir",
  description: "Comando de Exibição",
  defaultMemberPermissions: ["Administrator"],
  options: [
    {
      name: "produto",
      description: "Exibir um produto",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "id",
          description: "ID do Produto",
          type: ApplicationCommandOptionType.String,
          required,
          autocomplete,
        },
      ],
    },
  ],
  async autocomplete({ options }) {
    const query = options.getFocused();

    const filtered = products.filter((p) => p.id.includes(query));

    return filtered.map((p) => ({
      name: `${p.id} - ${limitText(p.name, 27, "...")}`,
      value: p.id,
    }));
  },
  async run(interaction) {
    await interaction.deferReply({ flags });

    const { options, channel } = interaction;
    const subCommand = options.getSubcommand();

    if (!(channel instanceof TextChannel)) return;

    switch (subCommand) {
      case "produto": {
        const id = options.getString("id", true);
        const product = products.find((p) => p.id == id);

        if (!product) {
          await interaction.editReply(
            res.warning(
              "Desculpe, o produto informado não existe no banco de dados."
            )
          );
          return;
        }

        await channel
          .send(menus.product.buy(product))
          .then(async (m) => {
            const row = createRow(
              createLinkButton({
                url: m.url,
                label: "Ir para Mensagem",
              })
            );

            await interaction.editReply(
              res.success("Parabéns, o produto foi exibido com sucesso.", row)
            );
          })
          .catch(async (err) => {
            logger.error(err);
            await interaction.editReply(
              res.danger("Desculpe, não foi possível exibir o produto.")
            );
          });
        return;
      }
    }
  },
});
