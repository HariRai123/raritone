import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "raritone_cart";

function readCart() {
  try {
    const savedCart = localStorage.getItem(STORAGE_KEY);

    if (!savedCart) {
      return [];
    }

    const parsedCart = JSON.parse(savedCart);

    return Array.isArray(parsedCart) ? parsedCart : [];
  } catch (error) {
    console.error("Failed to read cart:", error);
    return [];
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(readCart);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(cart),
      );
    } catch (error) {
      console.error(
        "Failed to save cart:",
        error,
      );
    }
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    if (!product?._id) {
      console.error(
        "Cannot add product without an ID.",
      );
      return;
    }

    setCart((currentCart) => {
      const productId = product._id;

      const existingProduct = currentCart.find(
        (item) => item.productId === productId,
      );

      const stock =
        Number(product.stock) || 999;

      const requestedQuantity =
        Math.max(
          Number(quantity) || 1,
          1,
        );

      if (existingProduct) {
        return currentCart.map((item) => {
          if (item.productId !== productId) {
            return item;
          }

          return {
            ...item,
            quantity: Math.min(
              item.quantity +
                requestedQuantity,
              stock,
            ),
            stock,
            price:
              Number(product.price) || 0,
            name: product.name,
            image: product.image,
          };
        });
      }

      return [
        ...currentCart,
        {
          productId,
          name: product.name,
          image: product.image,
          price:
            Number(product.price) || 0,
          quantity: Math.min(
            requestedQuantity,
            stock,
          ),
          stock,
        },
      ];
    });
  };

  const updateQuantity = (
    productId,
    quantity,
  ) => {
    setCart((currentCart) =>
      currentCart.map((item) => {
        if (
          item.productId !== productId
        ) {
          return item;
        }

        const stock =
          Number(item.stock) || 999;

        const requestedQuantity =
          Number(quantity);

        const newQuantity = Math.max(
          1,
          Math.min(
            Number.isFinite(
              requestedQuantity,
            )
              ? requestedQuantity
              : 1,
            stock,
          ),
        );

        return {
          ...item,
          quantity: newQuantity,
        };
      }),
    );
  };

  const removeFromCart = (productId) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) =>
          item.productId !== productId,
      ),
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce(
    (total, item) =>
      total +
      Number(item.quantity || 0),
    0,
  );

  const cartTotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
        Number(item.quantity || 0),
    0,
  );

  const value = useMemo(
    () => ({
      cart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      cartCount,
      cartTotal,
    }),
    [
      cart,
      cartCount,
      cartTotal,
    ],
  );

  return (
    <CartContext.Provider
      value={value}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider",
    );
  }

  return context;
}