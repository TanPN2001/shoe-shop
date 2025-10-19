import { useState } from "react";
import { Table, Button, Modal, Form, Input, message, Popconfirm } from "antd";
import type { ColumnsType } from "antd/es/table";
import api from "../api";
import { useAtom } from "jotai";
import { COLORS, type ItemColor } from "../store";

function ProductColorsPage() {
  const [colors, setColors] = useAtom(COLORS)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const load = () => {
    api.get("/item-color/get").then(res => {
      setColors(res.data.data)
    })
  }

  const deleteColor = async (rec: ItemColor) => {
    await api.delete(`/item-color/delete/${rec.itemColorId}`)
    load()
  }

  const columns: ColumnsType<ItemColor> = [
    { title: "ID", dataIndex: "itemColorId", key: "id", width: 80 },
    { title: "Tên màu", dataIndex: "name", key: "name" },
    {
      title: "Hành động",
      render: (_, rec) => <div>
        <Popconfirm
          title="Bạn có chắc chắn muốn xóa màu này?"
          onConfirm={() => deleteColor(rec)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Button danger size="small" type="primary">Xóa</Button>
        </Popconfirm>
      </div>
    }
  ];

  const showModal = () => setIsModalOpen(true);

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = { name: values.name, color: values.name, status: 1 };
      try {
        await api.post("/item-color/create", payload)
        load()
      } catch { }
      message.success("Tạo màu sản phẩm thành công!");
      setIsModalOpen(false);
      form.resetFields();
    } catch { }
  };

  return (
    <div>
      <Button type="primary" style={{ marginBottom: 16 }} onClick={showModal}>
        Thêm màu sản phẩm
      </Button>
      <Table
        columns={columns}
        rowKey={"itemColorId"}
        dataSource={colors}
        pagination={false}
      />
      <Modal
        title="Tạo màu sản phẩm"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Tạo"
        cancelText="Hủy"
        destroyOnHidden
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item
            label="Tên màu"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên màu" }]}
          >
            <Input placeholder="Ví dụ: Đỏ" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ProductColorsPage


