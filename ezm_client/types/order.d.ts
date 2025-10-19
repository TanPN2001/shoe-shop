import { OrderInfoDoc } from "./order.info"

export interface OrderDoc {
    orderId: number
    orderCode: string
    userId: number
    items: OrderInfoDoc[]
    amount: number
    reasonFailed: any
    deliveryInfo: DeliveryInfo
    status: number
    createdAt: string
    updatedAt: string
  }
  
  export interface DeliveryInfo {
    name: string
    email: string
    phone: string
    address: string
  }