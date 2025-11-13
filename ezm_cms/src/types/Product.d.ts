type ProductDocument = {
    itemId: number
    name: string
    code: string
    itemTypeId: number
    description: string
    brand: string
    thumbnail: string
    images: string[]
    status: number
    price: string
    discount: any
    amountOff: any
    numBuy: number
    averageStar: number
    tags: any
    slug: string
    totalVariants?: number
    createdBy: any
    createdAt: string
    updatedAt: string
    item_item_type_fk: ItemItemTypeFk
    item__variant_item_fk?: any[]
    listSizeVariants?: any[]
  }
  
  export interface ItemItemTypeFk {
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
  