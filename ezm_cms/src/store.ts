import { atom } from 'jotai'

export type Category = {
    itemTypeId: number
    name: string
    description: string
}

export type ItemSize = {
    itemSizeId: number
    size: string
    name: string
    gender: string
}

export type ItemColor = {
    itemColorId: number
    color: string
    name: string
}

export const CATEGORIES = atom<Category[]>([])
export const COLORS = atom<ItemColor[]>([])
export const SIZES = atom<ItemSize[]>([])

export type AuthState = {
    isAuthenticated: boolean
}

const initialAuthState = (() => {
    try {
        const raw = localStorage.getItem('auth')
        if (!raw) return { isAuthenticated: false }
        const parsed = JSON.parse(raw)
        return { isAuthenticated: !!parsed?.isAuthenticated }
    } catch {
        return { isAuthenticated: false }
    }
})()

export const AUTH = atom<AuthState>(initialAuthState)