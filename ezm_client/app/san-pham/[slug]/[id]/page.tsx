import ProductImages from "@/components/product/product.images"
import ProductRecommender from "@/components/product/product.recommend"
import ProductReview from "@/components/product/product.review"
import ProductTool from "@/components/product/product.tool"
import Rating from "@/components/ui/rating"
import { genRandomNumberInRange } from "@/lib/utils"
import { server } from "@/services/service.api"

async function ProductPage(props: { params: any }) {
    const { slug, id } = await props.params
    const loader = async (id: string | number, slug: string) => {
        const [getItemDetail, getItemVariants] = await Promise.all([
            server.get(`/item/by-slug/${slug}`),
            server.get(`/item-variant/detail-by-item/${id}`)
        ])
        return {
            detail: getItemDetail.data.data as ProductDocument,
            variants: getItemVariants.data.data as VariantDocument[]
        }
    }

    const { detail, variants } = await loader(id, slug)

    return <div className="px-4 lg:px-12">
        <div className="text-white flex items-center gap-2 mb-6">
            <p className="text-lg text-ezman-red font-bold font-ezman">EZMAN</p>
            <p> / </p>
            <p className="font-semibold">{detail.name}</p>
        </div>

        <div className="text-white pt-8">

        </div>

        <div className="mt-3 page-tools flex py-3 justify-between">

        </div>

        <div className="">
            <ProductImages detail={detail} />
        </div>

        <div className="mt-6 gap-4 product-details flex flex-col lg:flex-row justify-between space-x-12">
            <div className="text-white w-auto lg:w-[720px]">
                <div className="flex items-center justify-between">
                    <span className="text-ezman-red font-ezman brand-text text-3xl font-semibold">/ {detail.brand} /</span>
                    <div className="stars flex items-center gap-2">
                        <Rating value={5} readOnly />
                        <p>({genRandomNumberInRange(44, 55)})</p>
                    </div>
                </div>
                <p className="mt-2 text-3xl font-semibold">{detail.name}</p>
                <div className="mt-2 flex gap-2">

                    {variants.map(item => <div key={"variant-size-key:" + item.itemVariantId}>
                        <button style={{ borderColor: item.quantity == 0 ? "gray" : "red" }} className="border-l-3 cursor-pointer px-2 lg:px-5 py-3 text-sm bg-[#2e2e2e]">
                            {item.item_variant_item_size_fk.gender}, {item.item_variant_item_color_fk.name}, {item.item_variant_item_size_fk.name} - (Còn {item.quantity} cái)
                        </button>
                    </div>)}
                </div>

            </div>
            <div className="relative text-white flex-grow">
                <div className="flex items-center gap-4">
                    <p className="text-2xl font-medium">{(
                        Number(detail.price) * (1 - (Number(detail.discount ?? 0) / 100))
                    ).toLocaleString()}đ</p>
                    <p className="text-2xl font-medium line-through text-gray-400">{Number(detail.price).toLocaleString()}đ</p>
                    <p className="text-ezman-red text-2xl font-semibold">[-{detail.discount}%]</p>
                </div>
                <div className="mt-10 border-b border-ezman-red  pb-3">
                    <p className="font-medium">Thông tin sản phẩm</p>
                    <p>- Mã sản phẩm: <span className="text-red-500 font-semibold">[ {detail.code} ]</span></p>
                    <p>- Xuất sứ: <span className="text-red-500 font-semibold">EZMAN</span></p>
                </div>
                <div className="mt-4 border-b border-ezman-red pb-3">
                    <p className="font-medium">Mô tả về sản phẩm</p>
                    <p>{detail.description}</p>
                </div>
                <div className="mt-4  pb-3">
                    <p className="font-medium">Liên hệ tư vấn</p>
                    <p>- Zalo: <a href="" className="text-sky-600">abcde.com</a></p>
                    <p>- Facebook: <a href={process.env.NEXT_PUBLIC_FACEBOOK} target="_blank" className="text-sky-600">Truy cập ngay</a></p>
                    <p>- Tiktok: <a href="" className="text-sky-600">abcde.com</a></p>
                    <p>- Shopee: <a href="" className="text-sky-600">abcde.com</a></p>
                </div>

                <ProductReview item={detail} />
                <ProductTool product={detail} variants={variants} />
            </div>


        </div>

        <div className="mt-10 text-white">
            <p className="text-xl lg:text-3xl uppercase">Sản phẩm liên quan</p>
            <ProductRecommender keyword={detail.brand} />
        </div>
    </div>

}; export default ProductPage