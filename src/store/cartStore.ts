import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalAmount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const { items } = get();
        const existingItem = items.find((i) => i._id === item._id);
        const quantityToAdd = item.quantity || 1;
        
        if (existingItem) {
          set({
            items: items.map((i) =>
              i._id === item._id
                ? { ...i, quantity: i.quantity + quantityToAdd }
                : i
            ),
          });
        } else {
          set({ items: [...items, { ...item, quantity: quantityToAdd }] });
        }
      },
      
      removeItem: (id) => {
        const { items } = get();
        set({ items: items.filter((i) => i._id !== id) });
      },
      
      updateQuantity: (id, quantity) => {
        const { items } = get();
        if (quantity <= 0) {
          set({ items: items.filter((i) => i._id !== id) });
        } else {
          set({
            items: items.map((i) =>
              i._id === id ? { ...i, quantity } : i
            ),
          });
        }
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      totalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },
      
      totalAmount: () => {
        const { items } = get();
        return items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);