import { useEffect, useState } from "react"
import api from "../api"
import { Button, message, Table, type TableProps } from "antd";
import type { OrderDocument } from "../types/Order";

function OrdersPage() {
    const [buzz, context] = message.useMessage()
    const [orders, setOrders] = useState<OrderDocument[]>([]);

    const load = () => {
        api.get("/order/get-with-products")
            .then(res => { setOrders(res.data.data) })
    }

    useEffect(() => { load() }, [])

    const $confirmOrder = async (order: OrderDocument) => {
        try {
            await api.post("/order/confirm", { orderCode: order.orderCode })
            buzz.success("Đã duyệt đơn này!")
            load()
        } catch { buzz.error("lỗi xảy ra") }
    }

    const $cancelOrder = async (order: OrderDocument) => {
        try {
            await api.post("/order/cancel", { orderCode: order.orderCode })
            buzz.success("Đã hủy đơn này!")
            load()
        } catch { buzz.error("lỗi xảy ra") }
    }

    const columns: TableProps<OrderDocument>['columns'] = [
        {
            title: "ID",
            dataIndex: "orderId",
            key: "orderId",
            width: 80,
        },
        {
            title: "Mã đơn hàng",
            dataIndex: "orderCode",
            key: "orderCode",
        },
        {
            title: "User ID",
            dataIndex: "userId",
            key: "userId",
        },
        {
            title: "Số lượng sản phẩm",
            key: "itemsCount",
            render: (_: any, record: OrderDocument) => record.items?.length ?? 0,
        },
        {
            title: "Thông tin vận chuyển",
            key: "delivery",
            render: (_, rec) => <>
                {rec.deliveryInfo ? <div>
                    <div>
                        <div><b>Tên:</b> {rec.deliveryInfo.name}</div>
                        <div><b>Email:</b> {rec.deliveryInfo.email}</div>
                        <div><b>Điện thoại:</b> {rec.deliveryInfo.phone}</div>
                        <div><b>Địa chỉ:</b> {rec.deliveryInfo.address}</div>
                    </div>
                </div> : <span>--</span>}
            </>
        },
        {
            title: "Thông tin sản phẩm",
            key: "info",
            render: (_, rec) => <div>
                {rec.items.map((item) => (
                    <div key={item.variantId} style={{ marginBottom: 8, padding: 8, border: "1px solid #eee", borderRadius: 4 }}>
                        <div><b>Tên sản phẩm:</b> {item.variant.item?.name}</div>
                        <div><b>Màu:</b> {item.variant.color?.name} ({item.variant.color?.color})</div>
                        <div><b>Size:</b> {item.variant.size?.name} ({item.variant.size?.size})</div>
                        <div><b>Số lượng mua:</b> {item.quantity}</div>
                    </div>
                ))}
            </div>
        },
        {
            title: "Tổng tiền",
            dataIndex: "amount",
            key: "amount",
            render: (amount: number) => amount?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status: number) => {
                switch (status) {
                    case 0: return "Đã hủy";
                    case 1: return "Đã đặt";
                    case 2: return "Đã xác nhận";
                    case 3: return "Hoàn thành";
                    case 4: return "Đã hủy";
                    default: return "Không xác định";
                }
            }
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date: string) => new Date(date).toLocaleString(),
        },
        {
            title: "Ngày cập nhật",
            dataIndex: "updatedAt",
            key: "updatedAt",
            render: (date: string) => new Date(date).toLocaleString(),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, rec) => <div style={{ display: "flex", gap: 4 }}>
                <Button onClick={() => $confirmOrder(rec)} size="small">Duyệt đơn</Button>
                <Button onClick={() => $cancelOrder(rec)} size="small" danger>Hủy đơn</Button>
            </div>
        }
    ];

    return (
        <div>
            {context}
            <Table
                columns={columns}
                dataSource={orders}
                rowKey="orderId"
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
}
export default OrdersPage;