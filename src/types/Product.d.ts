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
    numBuy: number
    averageStar: number
    tags: any
    slug: string
    createdBy: any
    createdAt: string
    updatedAt: string
    item_item_type_fk: ItemItemTypeFk
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
  