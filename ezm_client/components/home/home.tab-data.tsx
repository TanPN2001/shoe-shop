"use client"

import api from "@/services/service.api"
import { useEffect, useState } from "react"
import ProductCard from "../product/product.card"

type Props = {
    category: CategoryDocument
}

function HomeTabData({ category }: Props) {
    const [products, setProducts] = useState<ProductDocument[]>([])
    const load = async () => {
        const { data: res } = await api.get(`/item/get?itemTypeId=${category.itemTypeId}`)
        setProducts(res.data)
    }

    useEffect(() => {
        load()
    }, [])

    return <div className="">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-8">
            {
                products.map(item => <ProductCard key={"item_product:" + item.itemId} detail={item} />)
            }
        </div>
        {products.length == 0 && <div>
            <div className="w-full h-52 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg text-gray-400">
                Không có sản phẩm nào
            </div>
        </div>}
    </div>
}; export default HomeTabData