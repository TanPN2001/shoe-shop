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

export const USER_DETAIL = atom<UserDetailDocument | null>(null)
export const CART = atom<CartItem[]>(load())