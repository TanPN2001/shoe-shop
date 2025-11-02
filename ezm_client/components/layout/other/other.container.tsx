"use client"

import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
    DrawerClose
} from "@/components/ui/drawer"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import api from "@/services/service.api"
import { useEffect, useState } from "react"
import OtherTabContent from "./other.tab"
import { DialogClose } from "@/components/ui/dialog"
import { X } from "lucide-react"

function OtherContainer() {

    const [categories, setCategories] = useState<CategoryDocument[]>([])

    const loader = async () => {
        try {
            const { data: res } = await api.get("/item-type/get")
            const temp = res.data as CategoryDocument[]
            setCategories(temp.sort((a, b) => a.itemTypeId - b.itemTypeId))
        } catch (err) {

        }
    }

    useEffect(() => {
        loader()
    }, [])

    return <Drawer direction="top">
        <DrawerTrigger className="text-white text-sm lg:text-base">{'{Danh mục khác}'}</DrawerTrigger>
        <DrawerContent style={{ margin: 0, padding: 0, borderRadius: 0, height: "95vh" }}>
            <div className="p-4 lg:p-12 w-full h-full">
                <div className="flex justify-between">
                    <p className="text-3xl lg:text-6xl text-ezman-red font-extrabold font-ezman">EZM</p>
                    <DrawerClose className="cursor-pointer flex text-gray-500"><X /> Đóng</DrawerClose>
                </div>
                <Tabs defaultValue={"0"} className="!p-0 flex flex-col lg:flex-row !items-start">

                    <div className="w-[280px] mt-4">
                        <TabsList className="h-full flex flex-row lg:flex-col !p-0">
                            {
                                categories.map((item, idx) => <TabsTrigger key={":tablist-item:" + item?.itemTypeId} style={{ textAlign: "start" }}
                                    value={String(idx)}
                                    className="w-full cursor-pointer tab-triggle-vertical !pr-5 lg:!pr-0">
                                    {item.name}
                                </TabsTrigger>)
                            }

                        </TabsList>
                    </div>

                    <div className="overflow-y-auto">

                        {categories.map((item, idx) => <OtherTabContent
                            value={String(idx)}
                            category={item}
                            key={":tablist-content:" + item?.itemTypeId} />)}
                    </div>
                </Tabs>
            </div>
        </DrawerContent>
    </Drawer>
} export default OtherContainer