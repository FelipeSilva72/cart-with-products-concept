import { formatPrice, formatStock } from "#functions";
import { createContainer, createRow, createSeparator } from "@magicyan/discord";
import {
  bold,
  ButtonBuilder,
  ButtonStyle,
  codeBlock,
  inlineCode,
  italic,
  type InteractionReplyOptions,
} from "discord.js";

type Product = {
  id: string;
  name: string;
  price: number;
  stock: string[];
};

export function buyMenu<R>(product: Product): R {
  const price = formatPrice(product.price);
  const stock = formatStock(product.stock);

  const buyButton = new ButtonBuilder({
    customId: `buy/product/${product.id}`,
    style: ButtonStyle.Success,
    label: "Adicionar ao Carrinho",
    emoji: "🛒",
    disabled: product.stock.length == 0,
  });

  const container = createContainer({
    accentColor: constants.colors.default,
    components: [
      `## ${bold(italic("Produto a venda:"))}`,
      codeBlock(product.name),
      `💵・${italic("Valor do produto:")} ${inlineCode(price)}`,
      `📦・${italic("Estoque disponível:")} ${inlineCode(stock)}`,
      createSeparator(),
      createRow(buyButton),
    ],
  });

  return {
    flags: ["Ephemeral", "IsComponentsV2"],
    components: [container],
  } satisfies InteractionReplyOptions as R;
}
