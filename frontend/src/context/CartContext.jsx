import { createContext, useContext, useReducer } from "react";

const CartContext = createContext(null);

const initialState = {
  items: [], // { id, name, price, image_url, stock, quantity }
  message: null,
};

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const product = action.payload;
      const stock = Number(product.stock ?? 0);
      const existing = state.items.find((item) => item.id === product.id);

      if (existing) {
        if (existing.quantity >= stock) {
          return {
            ...state,
            message: `Only ${stock} ${product.name} in stock.`,
          };
        }

        return {
          ...state,
          items: state.items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          message: null,
        };
      }

      if (stock <= 0) {
        return {
          ...state,
          message: `${product.name} is out of stock.`,
        };
      }

      return {
        ...state,
        items: [...state.items, { ...product, stock, quantity: 1 }],
        message: null,
      };
    }

    case "REMOVE_ITEM": {
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
      };
    }

    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload;

      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== id),
        };
      }

      const item = state.items.find((i) => i.id === id);

      if (item && quantity > item.stock) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: i.stock } : i
          ),
          message: `Only ${item.stock} ${item.name} in stock.`,
        };
      }

      return {
        ...state,
        items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        message: null,
      };
    }

    case "CLEAR_CART": {
      return { ...state, items: [] };
    }

    case "CLEAR_MESSAGE": {
      return { ...state, message: null };
    }

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = (product) => {
    dispatch({ type: "ADD_ITEM", payload: product });
  };

  const removeFromCart = (id) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id } });
  };

  const updateQuantity = (id, quantity) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const clearMessage = () => {
    dispatch({ type: "CLEAR_MESSAGE" });
  };

  const totalItems = state.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalPrice = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const value = {
    items: state.items,
    message: state.message,
    clearMessage,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  };

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
