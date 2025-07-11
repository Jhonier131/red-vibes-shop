export interface CarItem {
  _id?: string; // opcional si lo genera MongoDB
  name: string;
  image: any;
  price: number;
  description: string;
  offSale: number;
  size: string[]; // tallas disponibles
  category: number;
  gender: string; // puedes ajustarlo a string si no quieres limitar
  stock: any
  sizeSelected: string;
  quantity: number;
}