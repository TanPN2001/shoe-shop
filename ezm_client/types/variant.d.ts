type VariantDocument = {
    itemVariantId: number
    itemId: number
    itemColorId: number
    itemSizeId: number
    quantity: number
    price: string
    discount: any
    status: number
    createdBy: any
    createdAt: string
    updatedAt: string
    item_variant_item_color_fk: ItemVariantItemColorFk
    item_variant_item_size_fk: ItemVariantItemSizeFk
    item_variant_item_fk: ItemVariantItemFk
}

interface ItemVariantItemColorFk {
    itemColorId: number
    color: string
    name: string
    status: number
    createdBy: any
    createdAt: string
    updatedAt: string
}

interface ItemVariantItemSizeFk {
    itemSizeId: number
    size: string
    name: string
    gender: string
    status: number
    createdBy: any
    createdAt: string
    updatedAt: string
}

interface ItemVariantItemFk {
    itemId: number
    name: string
    code: string
    itemTypeId: number
    description: string
    brand: string
    thumbnail: string
    images: any[]
    status: number
    price: string
    discount: any
    numBuy: number
    averageStar: number
    tags: any
    slug: string
    createdBy: any
    createdAt: string
    updatedAt: string
}
