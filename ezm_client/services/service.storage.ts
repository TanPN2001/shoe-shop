import { CartItem } from "./service.atom"

export const save = (cart: CartItem[]) => {
    localStorage.setItem("ezman-cart", JSON.stringify(cart))
}

export const load = () => {
    try {
        const raws = localStorage.getItem("ezman-cart")
        if (!raws) return []
        const data = JSON.parse(raws) as CartItem[]
        return data
    } catch (err) { return [] }
}