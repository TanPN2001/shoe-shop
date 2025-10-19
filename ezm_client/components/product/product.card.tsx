import Link from "next/link";
import { GoStar, GoStarFill } from "react-icons/go";

type Props = { detail: ProductDocument }

function ProductCard(props: Props) {

    return <Link href={"/san-pham/" + props.detail.slug + "/" + props.detail.itemId} className="block">
        <div className="w-full">
            <div className="relative group product-card-img">
                <div className="absolute top-0 left-0 z-2 w-full h-full duration-300 hover:bg-black/30 opacity-0 hover:opacity-100 flex flex-col justify-between">
                    <div className="w-full flex justify-end p-4">

                    </div>
                    <div className="bg-black/70 font-medium flex p-2 justify-center gap-2 text-sm text-white">
                        <button className="cursor-pointer hover:underline">Nhãn hiệu: {props.detail.brand}</button>
                        <button className="cursor-pointer hover:underline">Mã code: {props.detail.code}</button>
                    </div>
                </div>
                <img src={props.detail.thumbnail} className="relative w-full h-[187px] lg:h-[336px]" alt="ádfasdf" />
            </div>
            <div className="product-card-detail">
                <div className="top flex justify-between text-white items-center !py-1">
                    <p className="text-ezman-red font-ezman uppercase">/{props.detail.brand}/</p>
                    <div className="flex items-center">
                        <GoStarFill className="text-sm text-yellow-400" />
                        <GoStarFill className="text-sm text-yellow-400" />
                        <GoStarFill className="text-sm text-yellow-400" />
                        <GoStarFill className="text-sm text-yellow-400" />
                        <GoStar className="text-sm text-yellow-400" />
                        <span className="!ml-1 text-sm">({props.detail.averageStar})</span>
                    </div>
                </div>
                <div className="text-gray-100">
                    <p>{props.detail.name}</p>

                    <div className="flex gap-6 items-center">
                        <span className="font-medium text-white text-sm lg:text-base">
                            {(
                                Number(props.detail.price) * (1 - (Number(props.detail.discount ?? 0) / 100))
                            ).toLocaleString()}đ
                        </span>
                        <span className="font-medium text-gray-400 text-sm lg:text-base line-through">{Number(props.detail.price).toLocaleString()}đ</span>
                        <span className="hidden lg:flex text-red-400">[-{props.detail.discount}%]</span>
                    </div>
                </div>
            </div>
        </div>
    </Link>
}

export default ProductCard