"use client"

import api from "@/services/service.api"
import { useEffect, useState } from "react"
import ProductCard from "./product.card"

type Props = { keyword: string }

function ProductRecommender({ keyword }: Props) {

    const [products, setProducts] = useState<ProductDocument[]>([])

    const loader = async (keyword: string) => {
        try {
            const { data } = await api.get(`/dashboard/search-all?keyword=${keyword}`)
            const res = data.data.items as ProductDocument[]
            setProducts(res)
        } catch (err) { }
    }

    useEffect(() => {

        loader(keyword)

    }, [])

    return <div className="mt-6 grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-8">
        {
            products.map(item => <ProductCard key={"item_product:" + item.itemId} detail={item} />)
        }
    </div>
} export default ProductRecommender