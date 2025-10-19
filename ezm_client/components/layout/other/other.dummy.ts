export type Keyword = { id: number, name: string, tag: string, category: number }

export const keywords = [
    {
        id: 1,
        name: "Giày Sneaker Nam",
        tag: "sneaker-nam",
        category: 1
    },
    {
        id: 2,
        name: "Giày Sneaker Nữ",
        tag: "sneaker-nu",
        category: 1
    },
    {
        id: 8,
        name: "Giày Sandals",
        tag: "sandals",
        category: 1
    },
    {
        id: 9,
        name: "Giày Bóng Đá",
        tag: "bong-da",
        category: 1
    },
    {
        id: 3,
        name: "Giày Chạy Bộ",
        tag: "chay-bo",
        category: 1
    },
    {
        id: 4,
        name: "Giày Thể Thao",
        tag: "the-thao",
        category: 1
    },
    {
        id: 5,
        name: "Giày Nike",
        tag: "nike",
        category: 1
    },
    {
        id: 6,
        name: "Giày Adidas",
        tag: "adidas",
        category: 1
    },
    {
        id: 7,
        name: "Giày MLB",
        tag: "mlb",
        category: 1
    }
]

export type LowLevelKeyword = {
    id: number
    name: string
    parent: number
    tag: string
}

export const lowLevelKeywords: LowLevelKeyword[] = [
    // nike
    {
        id: 1,
        name: "Nike Zoom",
        parent: 5,
        tag: "nike-zoom"
    },
    {
        id: 2,
        name: "Nike Air Force",
        parent: 5,
        tag: "nike-air-force"
    },
    {
        id: 3,
        name: "Nike Air Max",
        parent: 5,
        tag: "nike-air-max"
    },
    {
        id: 4,
        name: "Nike Air Jordan",
        parent: 5,
        tag: "nike-air-jordan"
    },
    {
        id: 5,
        name: "Nike Running",
        parent: 5,
        tag: "nike-running"
    },
    {
        id: 6,
        name: "Nike Cortez",
        parent: 5,
        tag: "nike-cortez"
    },
    // adidas
    {
        id: 7,
        name: "Adidas Alpha Bounce",
        parent: 6,
        tag: "adidas-alpha-bounce"
    },
    {
        id: 8,
        name: "Adidas Samba",
        parent: 6,
        tag: "adidas-samba"
    },
    {
        id: 9,
        name: "Adidas NMD",
        parent: 6,
        tag: "adidas-nmd"
    },
    {
        id: 10,
        name: "Adidas Spezial",
        parent: 6,
        tag: "adidas-spezial"
    },
    {
        id: 11,
        name: "Adidas Stan Smith",
        parent: 6,
        tag: "adidas-stan-smith"
    },
    {
        id: 12,
        name: "Adidas Originals",
        parent: 6,
        tag: "adidas-originals"
    },
    {
        id: 13,
        name: "Adidas Superstar",
        parent: 6,
        tag: "adidas-superstar"
    },
    {
        id: 14,
        name: "Adidas Ultraboost",
        parent: 6,
        tag: "adidas-ultraboost"
    },
    {
        id: 15,
        name: "Adidas Yeezy",
        parent: 6,
        tag: "adidas-yeezy"
    },
    {
        id: 16,
        name: "Adidas Forum",
        parent: 6,
        tag: "adidas-forum"
    },
    // mlb
    {
        id: 17,
        name: "BIGBALL CHUNKY",
        parent: 7,
        tag: "mlb-bigball-chunky"
    },
    {
        id: 18,
        name: "PLAYBALL ORIGIN",
        parent: 7,
        tag: "mlb-playball-origin"
    },
    {
        id: 19,
        name: "PLAYBALL MULE",
        parent: 7,
        tag: "mlb-playball-mule"
    },
]