"use client"

import { userService } from "@/services/service.api"
import { OrderDoc } from "@/types/order"
import moment from "moment"
import Link from "next/link"
import { useEffect, useState } from "react"

type OrderItem = {
    productName: string
    productThumbnail: string
    variantName: string
    quantity: number
    price: number
}

type Order = {
    orderId: number
    createdAt: string
    status: string
    total: number
    items: OrderItem[]
}

const ORDER_STATUS: { [key: string]: string } = {
    0: "Đặt đơn",
    1: "Xác nhận đơn",
    2: "Hủy đơn",
    3: "Hoàn thành"
}

export default function MyOrdersPage() {
    const [orders, setOrders] = useState<OrderDoc[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true)
                setError(null)
                const { data: res } = await userService.get("/order/get-by-user")
                // Giả sử API trả về mảng đơn hàng
                setOrders(res.data)
            } catch (err: any) {
                setError("Không thể tải danh sách đơn hàng.")
            } finally {
                setLoading(false)
            }
        }
        fetchOrders()
    }, [])

    return (
        <div className="px-4 lg:px-12 py-8 min-h-[60vh]">
            <div className="text-white flex items-center gap-2 mb-6">
                <p className="text-lg text-ezman-red font-bold font-ezman"><Link href="/" className="cursor-pointer">EZMAN</Link></p>
                <p> / </p>
                <p className="font-semibold">Đơn hàng của tôi</p>
            </div>
            <h1 className="text-2xl font-ezman text-white mb-6">Danh sách đơn hàng đã đặt</h1>
            {loading && <p className="text-white">Đang tải...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && orders.length === 0 && (
                <p className="text-white">Bạn chưa có đơn hàng nào.</p>
            )}
            {(!loading && !error && orders.length > 0) && (
                <div className="space-y-8">
                    {orders.map((order) => (
                        <div key={order.orderId} className="border-2 border-ezman-red text-white rounded-lg shadow p-4">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                                <div>
                                    <span className="font-semibold text-ezman-red">Mã đơn hàng:</span>{" "}
                                    <span className="font-mono">{order.orderId}</span>
                                </div>
                                <div className="text-sm text-gray-300">
                                    Ngày đặt: {moment(order?.createdAt).format("DD/MM/YYYY hh:mm")}
                                </div>
                            </div>
                            <div className="mb-2">
                                <span className="font-semibold">Trạng thái:</span>{" "}
                                <span>
                                    {ORDER_STATUS[order?.status ?? '-']}
                                </span>
                            </div>
                            <div className="mb-2">
                                <span className="font-semibold">Tổng thanh toán:</span>{" "}
                                <span className="text-ezman-red font-bold">
                                    {order?.amount ? order?.amount.toLocaleString() : "--"} đ
                                </span>
                            </div>
                            <div>
                                <span className="font-semibold">Sản phẩm:</span>
                                <ul className="divide-y divide-gray-200 mt-2">
                                    {order.items.map((item, idx) => (
                                        <li key={idx} className="flex items-center py-2">
                                            <img
                                                src={item?.variant?.item?.thumbnail}
                                                alt={item?.variant?.item?.name ?? 'image'}
                                                className="w-14 h-14 object-cover rounded mr-3 border"
                                            />
                                            <div className="flex-1">
                                                <div className="font-medium">{item?.variant?.item?.name ?? ''}</div>
                                                <div className="text-xs text-gray-500">{item?.variant?.color?.name ?? ''}, {item?.variant?.size?.name ?? ''}</div>
                                            </div>
                                            <div className="text-sm text-gray-400 mr-4">x{item?.quantity ?? 0}</div>
                                            <div className="text-sm font-semibold text-ezman-red">
                                                {Number(item?.variant?.price ?? 0).toLocaleString()}đ
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
