import { Category, Product } from './types';

export const CATEGORIES: Category[] = ['Sofa', 'Bed', 'Table', 'Chair', 'Decor'];

export const INITIAL_PRODUCTS: Partial<Product>[] = [
  {
    name: 'Nordic Velvet Sofa',
    description: 'A luxurious 3-seater sofa with premium velvet upholstery and gold-finished legs. Perfect for modern living rooms.',
    price: 1299,
    category: 'Sofa',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
    stock: 10
  },
  {
    name: 'Minimalist Oak Bed',
    description: 'Crafted from solid white oak, this bed frame offers timeless elegance and sturdy support for a restful sleep.',
    price: 1599,
    category: 'Bed',
    image: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&q=80&w=800',
    stock: 5
  },
  {
    name: 'Marble Dining Table',
    description: 'Statutario marble top with a sculptural walnut base. A statement piece for your dining area.',
    price: 2100,
    category: 'Table',
    image: 'https://images.unsplash.com/photo-1577145785726-23902ee1f4ac?auto=format&fit=crop&q=80&w=800',
    stock: 3
  },
  {
    name: 'Ergonomic Lounge Chair',
    description: 'Bespoke design meeting ultimate comfort. Features premium leather and an adjustable headrest.',
    price: 850,
    category: 'Chair',
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=800',
    stock: 15
  },
  {
    name: 'Arched Living Mirror',
    description: 'A large minimalist mirror with a thin black metal frame. Expands your space visually.',
    price: 350,
    category: 'Decor',
    image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=800',
    stock: 20
  }
];
