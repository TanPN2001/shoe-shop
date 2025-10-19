export type Paging = {
    total: number
    pageIndex: number
    pageSize: number
}

export const InitPaging: Paging = { total: 0, pageIndex: 1, pageSize: 10 }