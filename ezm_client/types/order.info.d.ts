export interface OrderInfoDoc {
    variantId: number
    quantity: number
    variant: Variant
}

export interface Variant {
    itemVariantId: number
    price: string
    discount: any
    item: Item
    color: Color
    size: Size
}

export interface Item {
    itemId: number
    name: string
    code: string
    description: string
    brand: string
    thumbnail: string
    images: string[]
    itemType: ItemType
}

export interface ItemType {
    itemTypeId: number
    name: string
    code: any
    description: string
    thumbnail: string
    images: string[]
    status: number
    slug: string
    createdBy: any
    createdAt: string
    updatedAt: string
}

export interface Color {
    itemColorId: number
    color: string
    name: string
    status: number
    createdBy: any
    createdAt: string
    updatedAt: string
}

export interface Size {
    itemSizeId: number
    size: string
    gender: string
    name: string
    status: number
    createdBy: any
    createdAt: string
    updatedAt: string
}
