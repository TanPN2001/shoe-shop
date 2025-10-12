import { useState } from "react";
import { Table, Button, Modal, Form, Input, message, Select, Popconfirm } from "antd";
import type { ColumnsType } from "antd/es/table";
import api from "../api";
import { useAtom } from "jotai";
import { SIZES, type ItemSize } from "../store";


function ProductSizesPage() {
  const [sizes, setSizes] = useAtom(SIZES)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm()

  const load = () => {
    api.get("/item-size/get").then(res => {
      setSizes(res.data.data)
    })
  }

  const deleteSize = async (rec: ItemSize) => {
    await api.delete(`/item-size/delete/${rec.itemSizeId}`)
    load()
  }

  const columns: ColumnsType<ItemSize> = [
    { title: "ID", dataIndex: "itemSizeId", key: "id", width: 80 },
    { title: "Tên size", dataIndex: "name", key: "name" },
    { title: "Giới tính", dataIndex: "gender", key: "gender" },
    { title: "Hành động", key: "actions", render: (_, rec) => <div>
      <Popconfirm
        title="Bạn có chắc chắn muốn xóa size này?"
        onConfirm={() => deleteSize(rec)}
        okText="Xóa"
        cancelText="Hủy"
      >
        <Button danger size="small" type="primary">Xóa</Button>
      </Popconfirm>
    </div> }
  ];

  const showModal = () => setIsModalOpen(true);

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = { name: values.name, size: values.name, gender: values.gender, status: 1 };
      try {
        await api.post("/item-size/create", payload);
        load()
      } catch { }

      message.success("Tạo size sản phẩm thành công!");
      setIsModalOpen(false);
      form.resetFields();
    } catch { }
  };

  return (
    <div>
      <Button type="primary" style={{ marginBottom: 16 }} onClick={showModal}>
        Thêm size sản phẩm
      </Button>
      <Table
        columns={columns}
        rowKey={"itemSizeId"}
        dataSource={sizes}
        pagination={false}
      />
      <Modal
        title="Tạo size sản phẩm"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Tạo"
        cancelText="Hủy"
        destroyOnHidden
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item
            label="Tên size"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên size, VD: 34, 35, ..." }]}
          >
            <Input placeholder="VD: 34, 35, ..." />
          </Form.Item>
          <Form.Item
            label="Giới tính"
            name="gender"
            rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
          >
            <Select options={[
              { value: "Nam", label: "Nam" },
              { value: "Nữ", label: "Nữ" }
            ]} placeholder="Chọn size" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ProductSizesPage


