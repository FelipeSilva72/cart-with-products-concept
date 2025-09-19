type Product = {
  id: string;
  name: string;
  price: number;
  stock: string[];
};

export const products: Product[] = [
  {
    id: "1",
    name: "Produto 1",
    price: 10,
    stock: [],
  },
  {
    id: "2",
    name: "Produto 2",
    price: 5.5,
    stock: ["a", "b"],
  },
  {
    id: "3",
    name: "Produto 3",
    price: 0.5,
    stock: ["a", "b", "c"],
  },
  {
    id: "4",
    name: "Produto 4",
    price: 10.5,
    stock: ["a"],
  },
];
