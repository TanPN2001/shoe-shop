import CategoryFilter from "@/components/category/category.filter"
import ProductCard from "@/components/product/product.card"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import api, { server } from "@/services/service.api"
import { redirect } from "next/navigation"

type WithQueryParams = {
    sort?: string,
    itemSizeId?: string
    priceMax?: string
    priceMin?: string
}

async function Page(props: { params: any, searchParams: any }) {
    const { query } = await props.searchParams

    const { sort, itemSizeId, priceMin, priceMax } = await props.searchParams as WithQueryParams

    const loader = async (keyword: string) => {

        const params = {
            ...(itemSizeId ? { itemSizeId } : {}),
            ...(priceMin ? { priceMin } : {}),
            ...(priceMax ? { priceMax } : {}),
        }

        try {
            const { data } = await api.get(`/dashboard/search-all?keyword=${keyword}`, { params })

            return data.data.items as ProductDocument[]
        } catch (err) { redirect("/404") }
    }

    const products = await loader(query)

    return <div className="px-4 lg:px-12">
        <div className="text-white flex items-center gap-2">
            <p className="text-lg text-ezman-red font-bold font-ezman">EZMAN</p>
            <p>/</p>
            <p>Tìm kiếm</p>
        </div>

        <div className="text-white pt-12">
            <p className="text-4xl uppercase pb-6">Kết quả cho: {query}</p>
        </div>

        <div className="mt-3 page-tools flex border-b border-white py-3 justify-between">
            <p className="text-white text-xl">Có [{products.length}] sản phẩm trong danh mục này</p>
            <Sheet>
                <SheetTrigger asChild>
                    <Button className="cursor-pointer bg-white rounded-none hover:bg-gray-200 text-black hover:">Mở bộ lọc</Button>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader className="border-b border-gray-300">
                        <SheetTitle>Bộ lọc</SheetTitle>
                    </SheetHeader>
                    <CategoryFilter />
                </SheetContent>
            </Sheet>
        </div>

        <div className="mt-6 grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-8">
            {
                products.map(item => <ProductCard key={"item_product:" + item.itemId} detail={item} />)
            }
        </div>
    </div>

}; export default Page