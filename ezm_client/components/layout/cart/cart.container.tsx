"use client"
import { LabelWithIcon } from "@/components/common/label-icon";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CART } from "@/services/service.atom";
import { save } from "@/services/service.storage";
import { useAtom } from "jotai";
import Link from "next/link";
import { IoCartOutline } from "react-icons/io5";

function CartContainer() {

    const [cart, setCart] = useAtom(CART)

    // Có thể cài đặt chiều rộng cho sheet bằng cách truyền className vào SheetContent
    // Ví dụ: className="max-w-lg w-full" hoặc bất kỳ class Tailwind nào bạn muốn
    return <Sheet>
        <SheetTrigger>
            <LabelWithIcon className="cursor-pointer text-white" icon={<IoCartOutline className="text-[24px] lg:text-base" />}>
                <span className="lg:flex hidden">Giỏ hàng</span>
            </LabelWithIcon>
        </SheetTrigger>

        <SheetContent className="max-w-xl w-full sm:max-w-2xl"> {/* Thay đổi chiều rộng tại đây */}
            <SheetHeader className="flex flex-row space-x-6 items-center">
                <p className="text-2xl font-ezman font-bold text-ezman-red">EZM</p>
                <SheetTitle className="text-xl">Giỏ hàng của bạn</SheetTitle>
            </SheetHeader>

            <div className="px-4">
                {cart && cart.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                        {cart.map((item, idx) => (
                            <div key={item.product.itemId ?? idx} className="py-4 flex items-center gap-4 border-b border-gray-200">
                                <img
                                    src={item.product.thumbnail}
                                    alt="ádasdasdasd"
                                    className="w-22 h-22 object-cover rounded"
                                />
                                <div className="w-full flex justify-between">
                                    <div>
                                        <p className="font-semibold font-ezman text-ezman-red">/ {item.product.brand} /</p>
                                        <p className="text-base font-medium">{item.product.name}</p>

                                        <div className="variants">
                                            <span className="px-3 bg-ezman-red text-white">{item.variants.item_variant_item_size_fk.name}</span>
                                        </div>

                                        <div className="inline-block mt-2 border border-gray-300">
                                            <button
                                                className="font-ezman w-8 py-1 hover:bg-gray-300 text-lg font-bold"
                                                onClick={() => {
                                                    if (item.count > 1) {
                                                        const newCart = cart.map((cartItem, cartIdx) =>
                                                            cartIdx === idx
                                                                ? { ...cartItem, count: cartItem.count - 1 }
                                                                : cartItem
                                                        );
                                                        setCart(newCart)
                                                        save(newCart)
                                                    }
                                                }}
                                                aria-label="Giảm số lượng"
                                            >
                                                -
                                            </button>
                                            <span className="px-2">{item.count}</span>
                                            <button
                                                className="font-ezman w-8 py-1 hover:bg-gray-300 text-lg font-bold"
                                                onClick={() => {
                                                    const newCart = cart.map((cartItem, cartIdx) =>
                                                        cartIdx === idx
                                                            ? { ...cartItem, count: cartItem.count + 1 }
                                                            : cartItem
                                                    );
                                                    setCart(newCart)
                                                    save(newCart)
                                                }}
                                                aria-label="Tăng số lượng"
                                            >
                                                +
                                            </button>
                                        </div>

                                    </div>
                                    <div>
                                        <p className="text-ezman-red font-bold">
                                            {Number(item.variants.price).toLocaleString()}đ
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 py-8">
                        Giỏ hàng của bạn đang trống.
                    </div>
                )}
            </div>

            <div className="px-4 w-full">
                <div className="mb-2 flex justify-between items-center">
                    <p className="text-lg font-medium">Tạm tính</p>
                    <p className="text-lg font-medium">
                        {cart.reduce((total, item) => total + (Number(item.variants.price) * item.count), 0).toLocaleString()}đ
                    </p>
                </div>
                <SheetClose asChild>
                    <Link href="/dat-hang" className="block text-center cursor-pointer bg-ezman-red w-full py-2 text-lg font-medium text-white">Thanh toán</Link>
                </SheetClose>
            </div>

        </SheetContent>
    </Sheet>
}; export default CartContainer