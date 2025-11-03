import { useEffect, useState } from "react";
import type { ProductDocument } from "../types/Product";
import { Button, Modal, Popconfirm, Table, Tag } from "antd";
import api from "../api";
import type { ColumnsType } from "antd/es/table";
import type { VariantDoc } from "../types/Variant";

type Props = { item: ProductDocument }

function ListVariant({ item }: Props) {
    const [open, setOpen] = useState(false)
    const [variants, setVariants] = useState<VariantDoc[]>([])

    const toggle = () => {

        if (!open) {
            load()
        }

        setOpen(prev => !prev)
    }

    const load = async () => {
        const { data } = await api.get(`/item-variant/detail-by-item/${item.itemId}`)
        setVariants(data.data)
    }

    const deleteVariant = async (rec: VariantDoc) => {
        await api.delete(`/item-variant/delete/${rec.itemVariantId}`)
        load()
    }

    const columns: ColumnsType<VariantDoc> = [
        {
            title: "Sản phẩm",
            key: "name",
            render: (_, rec) => <div>
                {rec?.item_variant_item_fk?.name || ''}
            </div>
        },
        {
            title: "Giá",
            dataIndex: "price",
            key: "price"
        },
        {
            title: "Size",
            key: "size",
            render: (_, rec) => <div style={{ display: "flex", gap: 8 }}>
                <Tag>{rec?.item_variant_item_size_fk?.name || ''}</Tag>
                <span>{rec?.item_variant_item_size_fk?.gender || ''}</span>
            </div>
        },
        {
            title: "Màu sắc",
            key: "color",
            render: (_, rec) => <div>
                <span>{rec?.item_variant_item_color_fk?.name || ''}</span>
            </div>
        },
        {
            title: "Tồn kho",
            key: "quantity",
            dataIndex: 'quantity'
        },
        {
            title: "Hành động",
            key: "actions",
            render: (_, rec) => <div style={{ display: "flex", gap: 6 }}>
                <Popconfirm title="Xóa biến thể này?" onConfirm={() => deleteVariant(rec)}>
                    <Button size="small" danger>Xóa biến thể</Button>
                </Popconfirm>
            </div>
        }
    ]

    useEffect(() => {
        if (!open) load();
    }, [open]);

    return <div>

        <Button onClick={toggle} size="small" type="primary">Các biến thể</Button>

        <Modal open={open} onCancel={toggle} onOk={toggle} title="Danh sách các biến thể" width={680}>

            <Table
                columns={columns}
                dataSource={variants}
                pagination={false}
            />

        </Modal>

    </div>
}

export default ListVariant