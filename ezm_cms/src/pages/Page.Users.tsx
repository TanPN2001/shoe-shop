import { useEffect, useState } from "react"
import { InitPaging, type Paging } from "../paging"
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import api from "../api";
// Handler for search input

export type UserDocument = {
    id: number
    email: string
    createdAt: Date
    updatedAt: Date
}

// Dummy data for 20 users
const dummyUsers: UserDocument[] = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    email: `user${i + 1}@example.com`,
    createdAt: new Date(2023, 0, 1 + i),
    updatedAt: new Date(2023, 0, 15 + i),
}));


function UsersPage() {

    const [listUser, _setListUser] = useState<{ data: UserDocument[], paging: Paging }>({
        data: dummyUsers,
        paging: InitPaging
    })

    // Table columns
    const columns: ColumnsType<UserDocument> = [
        {
            title: "Tên đăng nhập",
            dataIndex: "username",
            key: "username",
        },
        {
            title: "Tên hiển thị",
            dataIndex: "fullname",
            key: "fullname",
        },
        {
            title: "Số điện thoại",
            dataIndex: "phone",
            key: "phone",
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date: Date) => new Date(date).toLocaleString(),
        },
           {
            title: "Điểm",
            dataIndex: "point",
            key: "point",
            // render: (date: Date) => new Date(date).toLocaleString(),
        },
        {
            title: "Ngày cập nhật",
            dataIndex: "updatedAt",
            key: "updatedAt",
            render: (date: Date) => new Date(date).toLocaleString(),
        },
    ];

    useEffect(() => {
        api.get("/user/list").then(res => {
            console.log(res.data.data)

            _setListUser({ data: res.data.data, paging: InitPaging })

        })
    }, [])

    return (
        <div>

            <Table
                columns={columns}
                dataSource={listUser.data}
                pagination={{
                    current: listUser.paging.pageIndex,
                    pageSize: listUser.paging.pageSize,
                    total: listUser.paging.total,
                    showSizeChanger: true,
                }}
            />
        </div>
    );
}

export default UsersPage