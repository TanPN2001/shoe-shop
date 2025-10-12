import type { ProductDocument } from "./Product"

export type OrderDocument = {
    orderId: number
    orderCode: string
    userId: number
    items: Item[]
    amount: number
    reasonFailed: any
    deliveryInfo: Delivery | null
    status: number
    createdAt: string
    updatedAt: string
}

type Delivery = {
    name: string
    email: string
    phone: string
    address: string
}

type Item = {
    variantId: number
    quantity: number
    variant: {
        price: string
        discount: string | null
        item: ProductDocument
        color: { color: string, name: string }
        size: { size: string, name: string }
    }
}