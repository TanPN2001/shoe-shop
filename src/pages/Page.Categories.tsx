import { useState } from "react";
import { Table, Button, Modal, Form, Input, message, Popconfirm } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useAtom } from "jotai";
import { CATEGORIES, type Category } from "../store";
import { slugGen } from "../helpers/helper.slug";
import api from "../api";

function CategoriesPage() {
  const [categories, setCategories] = useAtom(CATEGORIES)
  const [buzz, context] = message.useMessage()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const load = () => {
    api.get("/item-type/get").then(res => {
      setCategories(res.data.data)
    })
  }

  const columns: ColumnsType<Category> = [
    {
      title: "ID",
      dataIndex: "itemTypeId",
      key: "id",
      width: 80,
    },
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, rec) => <div>

        <Popconfirm title="Xóa danh mục này?" onConfirm={() => deleteCategory(rec)}>
          <Button danger size="small" type="primary">Xóa danh mục</Button>
        </Popconfirm>

      </div>
    }
  ];

  const deleteCategory = async (rec: Category) => {
    await api.delete(`/item-type/delete/${rec.itemTypeId}`)
    load()
    buzz.success("Xóa thành công, vui lòng load lại")
  }

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
      const body = { ...values, slug: slugGen(values.name), status: 1 }
      await api.post("/item-type/create", body)
      message.success("Tạo danh mục thành công!");
      load()
      setIsModalOpen(false);
      form.resetFields();
    } catch (err: any) {
      message.error(err.message)
    }
  };

  return (
    <div>
      {context}
      <Button type="primary" style={{ marginBottom: 16 }} onClick={showModal}>
        Thêm danh mục
      </Button>
      <Table
        columns={columns}
        dataSource={categories}
        pagination={false}
      />
      <Modal
        title="Tạo danh mục mới"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Tạo"
        cancelText="Hủy"
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          preserve={false}
        >
          <Form.Item
            label="Tên danh mục"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}
          >
            <Input placeholder="Nhập tên danh mục" />
          </Form.Item>
          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
          >
            <Input.TextArea placeholder="Nhập mô tả danh mục" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default CategoriesPage
