import { atom } from "jotai"
import { load } from "./service.storage"

type ItemVariant = {
    size?: number
}

type UserDetailDocument = {
    id: number
    fullname: string
    phone: string
    username: string
}

export type CartItem = {
    product: ProductDocument
    variants: VariantDocument
    count: number
}

type orderItem = {
    product: ProductDocument
    variants: VariantDocument
    quantity: number
};

export const ORDER = atom<orderItem | null>(null);

export const USER_DETAIL = atom<UserDetailDocument | null>(null)
export const CART = atom<CartItem[]>(load())