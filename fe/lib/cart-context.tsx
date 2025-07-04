"use client"

import { createContext, useContext, useReducer, type ReactNode } from "react"

export interface CartItem {
  productId: string
  productName: string
  price: number
  quantity: number
  imageUrl?: string // Thêm trường imageUrl
}

interface CartState {
  cart: CartItem[]
}

type CartAction =
  | { type: "ADD_TO_CART"; payload: CartItem }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; quantity: number } }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "CLEAR_CART" }

const CartContext = createContext<{
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  updateQuantity: (productId: string, quantity: number) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void
  getTotalAmount: () => number
} | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existingItem = state.cart.find((item) => item.productId === action.payload.productId)
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.productId === action.payload.productId
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item,
          ),
        }
      }
      return {
        ...state,
        cart: [...state.cart, action.payload],
      }
    }
    case "UPDATE_QUANTITY":
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.productId === action.payload.productId ? { ...item, quantity: action.payload.quantity } : item,
        ),
      }
    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((item) => item.productId !== action.payload),
      }
    case "CLEAR_CART":
      return {
        ...state,
        cart: [],
      }
    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { cart: [] })

  const addToCart = (item: CartItem) => {
    dispatch({ type: "ADD_TO_CART", payload: item })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } })
  }

  const removeFromCart = (productId: string) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: productId })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  const getTotalAmount = () => {
    return state.cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cart: state.cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getTotalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
