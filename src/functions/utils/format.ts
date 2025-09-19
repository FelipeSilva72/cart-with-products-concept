export function formatPrice(price: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
}

export function formatStock(stock: string[]) {
  return stock.length == 0
    ? "Vazio"
    : stock.length < 2
    ? `${stock.length} Item`
    : `${stock.length} Itens`;
}
