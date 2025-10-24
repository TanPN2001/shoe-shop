import { useEffect, useState, useCallback } from "react"
import type { VoucherDocument } from "../types/Voucher"
import { Button, message, Table, Modal, Form, Input, InputNumber, Select, Tag, Switch } from "antd";
import type { TableProps } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import api from "../api";

function VouchersPage() {
    const [buzz, context] = message.useMessage()
    const [vouchers, setVouchers] = useState<VoucherDocument[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const [editingVoucher, setEditingVoucher] = useState<VoucherDocument | null>(null);

    const loadVouchers = useCallback(async () => {
        try {
            const res = await api.get<{ data: VoucherDocument[] }>("/voucher/get");
            setVouchers(res.data.data);
        } catch (err) {
            console.error("Error loading vouchers:", err);
            buzz.error("Không thể tải danh sách voucher");
        }
    }, [buzz]);

    useEffect(() => {
        loadVouchers();
    }, [loadVouchers]);

    const deleteVoucher = async (voucher: VoucherDocument) => {
        try {
            await api.post("/voucher/delete", { voucherId: voucher.voucherId });
            buzz.success("Xóa voucher thành công!");
            loadVouchers();
        } catch (err) {
            console.error("Error deleting voucher:", err);
            buzz.error("Không thể xóa voucher");
        }
    };

    const updateVoucherStatus = async (voucher: VoucherDocument, status: number) => {
        try {
            await api.post("/voucher/update-status", { 
                voucherId: voucher.voucherId, 
                status: status 
            });
            buzz.success("Cập nhật trạng thái thành công!");
            loadVouchers();
        } catch (err) {
            console.error("Error updating status:", err);
            buzz.error("Không thể cập nhật trạng thái");
        }
    };

    const columns: TableProps<VoucherDocument>['columns'] = [
        {
            title: "ID",
            dataIndex: "voucherId",
            key: "voucherId",
            width: 80,
        },
        {
            title: "Tiêu đề",
            dataIndex: "title",
            key: "title",
        },
        {
            title: "Mã voucher",
            dataIndex: "voucherCode",
            key: "voucherCode",
            render: (code: string) => (
                <Tag color="blue">{code}</Tag>
            ),
        },
        {
            title: "Giảm giá",
            dataIndex: "discount",
            key: "discount",
            render: (discount: number) => `${(discount * 100).toFixed(0)}%`,
        },
        {
            title: "Số tiền giảm",
            dataIndex: "amount",
            key: "amount",
            render: (amount: number) => Number(amount).toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
        },
        {
            title: "Số lượng",
            dataIndex: "quantity",
            key: "quantity",
        },
        {
            title: "Còn lại",
            dataIndex: "remainingQuantity",
            key: "remainingQuantity",
        },
        {
            title: "Tags",
            dataIndex: "tags",
            key: "tags",
            render: (tags: string[]) => (
                <div>
                    {tags?.map((tag, index) => (
                        <Tag key={index} color="green">{tag}</Tag>
                    ))}
                </div>
            ),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status: number, record: VoucherDocument) => (
                <Switch
                    checked={status === 1}
                    onChange={(checked) => updateVoucherStatus(record, checked ? 1 : 0)}
                />
            ),
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date: string) => new Date(date).toLocaleString(),
        },
        {
            title: "Hành động",
            key: "action",
            render: (_, record) => (
                <div style={{ display: "flex", gap: 4 }}>
                    <Button 
                        size="small" 
                        icon={<EditOutlined />}
                        onClick={() => handleEditVoucher(record)}
                    >
                        Sửa
                    </Button>
                    <Button 
                        size="small" 
                        danger 
                        icon={<DeleteOutlined />}
                        onClick={() => deleteVoucher(record)}
                    >
                        Xóa
                    </Button>
                </div>
            ),
        },
    ];

    // Handle modal functions
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            await api.post("/voucher/create", {
                ...values,
                status: 1,
            });
            buzz.success("Tạo voucher thành công!");
            setIsModalOpen(false);
            form.resetFields();
            loadVouchers();
        } catch (err) {
            console.error("Error creating voucher:", err);
            buzz.error("Không thể tạo voucher");
        }
    };

    const handleEditVoucher = (voucher: VoucherDocument) => {
        setEditingVoucher(voucher);
        setIsEditModalOpen(true);
        editForm.setFieldsValue({
            title: voucher.title,
            description: voucher.description,
            discount: voucher.discount,
            amount: voucher.amount,
            itemCodes: voucher.itemCodes,
            tags: voucher.tags,
            content: voucher.content,
            quantity: voucher.quantity,
            voucherCode: voucher.voucherCode,
        });
    };

    const handleEditCancel = () => {
        setIsEditModalOpen(false);
        setEditingVoucher(null);
        editForm.resetFields();
    };

    const handleEditOk = async () => {
        try {
            const values = await editForm.validateFields();
            if (!editingVoucher) return;

            await api.post("/voucher/update", {
                voucherId: editingVoucher.voucherId,
                ...values,
            });
            
            buzz.success("Cập nhật voucher thành công!");
            setIsEditModalOpen(false);
            setEditingVoucher(null);
            editForm.resetFields();
            loadVouchers();
        } catch (err) {
            console.error("Error updating voucher:", err);
            buzz.error("Không thể cập nhật voucher");
        }
    };

    return (
        <div>
            {context}
            <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: 16 }} onClick={showModal}>
                Thêm voucher
            </Button>
            <Table
                columns={columns}
                dataSource={vouchers}
                rowKey="voucherId"
                pagination={{ pageSize: 10 }}
            />

            {/* Modal tạo voucher */}
            <Modal
                title="Tạo voucher mới"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Tạo"
                cancelText="Hủy"
            >
                <Form
                    form={form}
                    layout="vertical"
                >
                    <Form.Item
                        label="Tiêu đề"
                        name="title"
                        rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
                    >
                        <Input placeholder="Nhập tiêu đề voucher" />
                    </Form.Item>

                    <Form.Item
                        label="Mô tả"
                        name="description"
                        rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
                    >
                        <Input.TextArea placeholder="Nhập mô tả voucher" />
                    </Form.Item>

                    <Form.Item
                        label="Mã voucher"
                        name="voucherCode"
                        rules={[{ required: true, message: "Vui lòng nhập mã voucher" }]}
                    >
                        <Input placeholder="Nhập mã voucher" />
                    </Form.Item>

                    <div style={{ display: "flex", gap: 16 }}>
                        <Form.Item
                            label="Tỷ lệ giảm giá (%)"
                            name="discount"
                            rules={[
                                { required: true, message: "Vui lòng nhập tỷ lệ giảm giá" },
                                { type: "number", min: 0, max: 1, message: "Tỷ lệ phải từ 0 đến 1" }
                            ]}
                            style={{ flex: 1 }}
                        >
                            <InputNumber 
                                placeholder="0.1" 
                                style={{ width: "100%" }} 
                                min={0} 
                                max={1} 
                                step={0.01}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Số tiền giảm (VND)"
                            name="amount"
                            rules={[
                                { required: true, message: "Vui lòng nhập số tiền giảm" },
                                { type: "number", min: 0, message: "Số tiền phải lớn hơn 0" }
                            ]}
                            style={{ flex: 1 }}
                        >
                            <InputNumber 
                                placeholder="10000" 
                                style={{ width: "100%" }} 
                                min={0}
                            />
                        </Form.Item>
                    </div>

                    <Form.Item
                        label="Số lượng"
                        name="quantity"
                        rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
                    >
                        <InputNumber 
                            placeholder="50" 
                            style={{ width: "100%" }} 
                            min={1}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Mã sản phẩm áp dụng"
                        name="itemCodes"
                        rules={[{ required: true, message: "Vui lòng nhập mã sản phẩm" }]}
                    >
                        <Select
                            mode="tags"
                            placeholder="Nhập mã sản phẩm (Enter để thêm)"
                            style={{ width: "100%" }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Tags"
                        name="tags"
                        rules={[{ required: true, message: "Vui lòng nhập tags" }]}
                    >
                        <Select
                            mode="tags"
                            placeholder="Nhập tags (Enter để thêm)"
                            style={{ width: "100%" }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Nội dung"
                        name="content"
                        rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
                    >
                        <Input.TextArea placeholder="Nhập nội dung mô tả" />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal chỉnh sửa voucher */}
            <Modal
                title="Chỉnh sửa voucher"
                open={isEditModalOpen}
                onOk={handleEditOk}
                onCancel={handleEditCancel}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form
                    form={editForm}
                    layout="vertical"
                >
                    <Form.Item
                        label="Tiêu đề"
                        name="title"
                        rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
                    >
                        <Input placeholder="Nhập tiêu đề voucher" />
                    </Form.Item>

                    <Form.Item
                        label="Mô tả"
                        name="description"
                        rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
                    >
                        <Input.TextArea placeholder="Nhập mô tả voucher" />
                    </Form.Item>

                    <Form.Item
                        label="Mã voucher"
                        name="voucherCode"
                        rules={[{ required: true, message: "Vui lòng nhập mã voucher" }]}
                    >
                        <Input placeholder="Nhập mã voucher" />
                    </Form.Item>

                    <div style={{ display: "flex", gap: 16 }}>
                        <Form.Item
                            label="Tỷ lệ giảm giá (%)"
                            name="discount"
                            rules={[
                                { required: true, message: "Vui lòng nhập tỷ lệ giảm giá" },
                                { type: "number", min: 0, max: 1, message: "Tỷ lệ phải từ 0 đến 1" }
                            ]}
                            style={{ flex: 1 }}
                        >
                            <InputNumber 
                                placeholder="0.1" 
                                style={{ width: "100%" }} 
                                min={0} 
                                max={1} 
                                step={0.01}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Số tiền giảm (VND)"
                            name="amount"
                            rules={[
                                { required: true, message: "Vui lòng nhập số tiền giảm" },
                                { type: "number", min: 0, message: "Số tiền phải lớn hơn 0" }
                            ]}
                            style={{ flex: 1 }}
                        >
                            <InputNumber 
                                placeholder="10000" 
                                style={{ width: "100%" }} 
                                min={0}
                            />
                        </Form.Item>
                    </div>

                    <Form.Item
                        label="Số lượng"
                        name="quantity"
                        rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
                    >
                        <InputNumber 
                            placeholder="50" 
                            style={{ width: "100%" }} 
                            min={1}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Mã sản phẩm áp dụng"
                        name="itemCodes"
                        rules={[{ required: true, message: "Vui lòng nhập mã sản phẩm" }]}
                    >
                        <Select
                            mode="tags"
                            placeholder="Nhập mã sản phẩm (Enter để thêm)"
                            style={{ width: "100%" }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Tags"
                        name="tags"
                        rules={[{ required: true, message: "Vui lòng nhập tags" }]}
                    >
                        <Select
                            mode="tags"
                            placeholder="Nhập tags (Enter để thêm)"
                            style={{ width: "100%" }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Nội dung"
                        name="content"
                        rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
                    >
                        <Input.TextArea placeholder="Nhập nội dung mô tả" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default VouchersPage;
