"use client"
import { toast } from "sonner"
import { CART, ORDER } from "@/services/service.atom"
import { useAtom } from "jotai"
import { ChangeEventHandler, useState, Suspense } from "react"
import { userService } from "@/services/service.api"
import { save } from "@/services/service.storage"
import { useSearchParams } from "next/navigation"

type OrderForm = {
    name: string,
    phone: string,
    email: string,
    address: string,
    voucherCode: string,
}

function OrderContent() {
    const [cart, setCart] = useAtom(CART);
    const [order, setOrder] = useAtom(ORDER);
    const searchParams = useSearchParams();
    const productParam = searchParams.get("product")
    const variantParam = searchParams.get("variant")

    const [form, setForm] = useState<OrderForm>({
        name: "",
        phone: "",
        email: "",
        address: "",
        voucherCode: "",
    })

    const changingForm: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
        const { name, value } = target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleOrder = async () => {
        try {
            let items: any[] = []

            if (order && productParam && variantParam) {
                items = [{ variantId: order.variants.itemVariantId, quantity: order.quantity }]
            } else {
                items = cart.map(item => ({
                    variantId: item.variants.itemVariantId,
                    quantity: item.count,
                }))
            }
            // const items = cart.map(item => {
            //     return { variantId: item.variants.itemVariantId, quantity: item.count }
            // })
            if (items.length == 0) {
                toast.error("Vui lòng chọn thêm sản phẩm để đặt hàng");
                return;
            }
            if (!form.name.trim()) {
                toast.error("Vui lòng nhập họ tên người nhận");
                return;
            }
            if (!form.phone.trim()) {
                toast.error("Vui lòng nhập số điện thoại");
                return;
            }
            if (!form.address.trim()) {
                toast.error("Vui lòng nhập địa chỉ cụ thể");
                return;
            }
            await userService.post("/order/place-order", { items, ...form })
            toast.success("Đặt hàng thành công", { position: "top-center" })
            // Clean giỏ hàng sau khi đặt hàng thành công
            setCart([]);
            save([]);
        } catch (err: any) {
            toast.error(err.message, { position: "top-center" })
        }
    }

    // const total = cart.reduce((total, item) => total + (Number(item.variants.price) * item.count), 0)

    const total = (order && productParam && variantParam)
        ? Number(order.variants?.price || 0) * (order?.quantity || 1)
        : cart.reduce((total, item) => total + Number(item.variants?.price) * item?.count, 0)

    return <div className="px-4 lg:px-12">
        <div className="text-white flex items-center gap-2">
            <p className="text-lg text-ezman-red font-bold font-ezman">EZMAN</p>
            <p> / </p>
            <p className="font-semibold">Đặt hàng</p>
        </div>
        <div className="mt-6 text-white">
            <p className="font-ezman text-2xl font-medium">Người nhận hàng</p>
            <div className="flex mt-4 space-x-12 flex-col lg:flex-row">
                <div className="w-full lg:w-auto">
                    <p className="text-xl">Thông tin vận chuyển</p>

                    <div className="mt-4 space-y-6">
                        <input name="name" onChange={changingForm} type="text" placeholder="Họ tên người nhận" className="w-full bg-white text-black px-4 py-2" />
                        <input name="phone" onChange={changingForm} type="text" placeholder="Số điện thoại" className="w-full bg-white text-black px-4 py-2" />
                        <input name="address" onChange={changingForm} type="text" placeholder="Địa chỉ cụ thể" className="w-full bg-white text-black px-4 py-2" />
                    </div>
                    <p className="mt-6 text-xl">Mã giảm giá</p>

                    <div className="mt-4 space-y-6">
                        <input name="voucherCode" onChange={changingForm} type="text" placeholder="Nhập mã giảm giá" className="w-full bg-white text-black px-4 py-2" />
                    </div>
                </div>

                <div className="flex-grow mt-6 lg:mt-0">
                    <p className="text-xl">Giỏ hàng</p>
                    {(order && productParam && variantParam) ? (
                        <div className="border-b border-gray-600 py-4 flex items-center gap-4">
                            <img
                                src={order?.product?.thumbnail || ''}
                                alt={order?.product?.name || ''}
                                className="w-32 h-32 object-cover rounded"
                            />
                            <div className="w-full flex justify-between">
                                <div>
                                    <p className="font-semibold font-ezman text-ezman-red">
                                        / {order?.product?.brand || ""} /
                                    </p>
                                    <p className="text-base">{order?.product?.name || ""}</p>
                                    <div className="variants">
                                        <span className="px-3 bg-ezman-red text-white">
                                            {order?.variants?.item_variant_item_size_fk ? order?.variants?.item_variant_item_size_fk?.name : ""}
                                            {order?.variants?.item_variant_item_color_fk ? `, ${order?.variants?.item_variant_item_color_fk?.name}` : ""}
                                        </span>
                                    </div>
                                    <div className="inline-block mt-2 border border-gray-300">
                                        <button
                                            className="font-ezman w-8 py-1 hover:bg-gray-300 text-lg font-bold"
                                            onClick={() => {
                                                if (order.quantity > 1) {
                                                    const newOrder = { ...order, quantity: order.quantity - 1 };
                                                    setOrder(newOrder);
                                                }
                                            }}
                                        >
                                            -
                                        </button>
                                        <span className="px-2">{order.quantity || 0}</span>
                                        <button
                                            className="font-ezman w-8 py-1 hover:bg-gray-300 text-lg font-bold"
                                            onClick={() => {
                                                const newOrder = { ...order, quantity: order?.quantity + 1 };
                                                setOrder(newOrder);
                                            }}
                                        >
                                            +
                                        </button>
                                    </div>

                                </div>

                                <div>
                                    <p className="text-ezman-red font-bold">
                                        {Number(order?.variants?.price || 0).toLocaleString()}đ
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (cart && cart.length > 0) ? (
                        <div className="divide-y divide-gray-200">
                            {cart.map((item, idx) => (
                                <div
                                    key={item.product.itemId ?? idx}
                                    className="border-b border-gray-600 py-4 flex items-center gap-4 "
                                >
                                    <img
                                        src={item.product.thumbnail}
                                        alt={item?.product?.name}
                                        className="w-32 h-32 object-cover rounded"
                                    />
                                    <div className="w-full flex justify-between">
                                        <div>
                                            <p className="font-semibold font-ezman text-ezman-red">
                                                / {item?.product?.brand || ''} /
                                            </p>
                                            <p className="text-base">{order?.product?.name || ""}</p>
                                            <div className="variants">
                                                <span className="px-3 bg-ezman-red text-white">
                                                    {order?.variants?.item_variant_item_size_fk ? order?.variants?.item_variant_item_size_fk?.name : ""}
                                                    {order?.variants?.item_variant_item_color_fk ? `, ${order?.variants?.item_variant_item_color_fk?.name}` : ""}
                                                </span>
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
                                                            setCart(newCart);
                                                            save(newCart);
                                                        }
                                                    }}
                                                >
                                                    -
                                                </button>
                                                <span className="px-2">{item.count || 0}</span>
                                                <button
                                                    className="font-ezman w-8 py-1 hover:bg-gray-300 text-lg font-bold"
                                                    onClick={() => {
                                                        const newCart = cart.map((cartItem, cartIdx) =>
                                                            cartIdx === idx
                                                                ? { ...cartItem, count: cartItem.count + 1 }
                                                                : cartItem
                                                        );
                                                        setCart(newCart);
                                                        save(newCart);
                                                    }}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-ezman-red font-bold">
                                                {Number(item?.variants?.price || 0).toLocaleString()}đ
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

                    <div className="w-full mt-4 space-y-2">
                        <div className="text-gray-500 flex justify-between items-center">
                            <span className="font-semibold text-lg">Phí vận chuyển</span>
                            <span className="font-semibold text-lg">{Number(30000).toLocaleString()}đ</span>
                        </div>
                        <div className="text-gray-500 flex justify-between items-center">
                            <span className="font-semibold text-lg">Giảm giá</span>
                            <span className="font-semibold text-lg">{Number(0).toLocaleString()}đ</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-lg">Tổng tiền</span>
                            <span className="font-semibold text-lg">{Number(total + 30000).toLocaleString()}đ</span>
                        </div>

                        <button onClick={handleOrder} className="mt-2 cursor-pointer bg-ezman-red w-full py-2 text-lg font-medium text-white">Đặt hàng</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

function OrderPage() {
    return (
        <Suspense fallback={<div className="px-4 lg:px-12 text-white">Đang tải...</div>}>
            <OrderContent />
        </Suspense>
    );
}

export default OrderPage;