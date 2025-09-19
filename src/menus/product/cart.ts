import { formatPrice } from "#functions";
import { createContainer, createRow, createSeparator } from "@magicyan/discord";
import {
  bold,
  ButtonBuilder,
  ButtonStyle,
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

interface CartData {
  product: Product;
  itens: number;
}

export function cartMenu<R>(data: CartData): R {
  const rowItens = createRow(
    new ButtonBuilder({
      customId: `item/add/${data.product.id}/${data.itens}`,
      style: ButtonStyle.Success,
      label: "Adicionar",
      disabled: data.itens >= data.product.stock.length,
    }),
    new ButtonBuilder({
      customId: `item/remove/${data.product.id}/${data.itens}`,
      style: ButtonStyle.Danger,
      label: "Remover",
      disabled: data.itens <= 1,
    })
  );

  const rowCart = createRow(
    new ButtonBuilder({
      customId: `cart/confirm/${data.product.id}/${data.itens}`,
      style: ButtonStyle.Success,
      label: "Confirmar Comprar",
    }),
    new ButtonBuilder({
      customId: `cart/cancel/${data.product.id}/${data.itens}`,
      style: ButtonStyle.Danger,
      label: "Cancelar Comprar",
    })
  );

  const price = formatPrice(data.product.price);

  const container = createContainer({
    accentColor: constants.colors.default,
    components: [
      `## ${bold(italic(`Produto: ${data.product.name}`))}`,
      `💵・${italic("Preço:")} ${inlineCode(price)}`,
      `📦・${italic("Total de Itens:")} ${inlineCode(data.itens.toString())}`,
      createSeparator(),
      rowItens,
      rowCart,
    ],
  });

  return {
    flags: ["Ephemeral", "IsComponentsV2"],
    components: [container],
  } satisfies InteractionReplyOptions as R;
}
