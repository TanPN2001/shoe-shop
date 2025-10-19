import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import ProductCard from "../product/product.card"
import HomeTabData from "./home.tab-data"

type Props = {
    categories: CategoryDocument[]
}

export default function HomeTab({ categories }: Props) {
    return (
        <div className="flex !w-full flex-col gap-6">
            <Tabs defaultValue={String(categories[0].itemTypeId)} className="w-full">
                <div className="overflow-x-auto w-full hide-scrollbar">
                    <TabsList className="bg-transparent gap-4 lg:gap-16 flex-nowrap min-w-max w-full">

                        {categories.map(item => <TabsTrigger
                            key={"category_key:" + item.itemTypeId}
                            value={String(item.itemTypeId)}
                            className="py-4 px-6 uppercase rounded-none text-base lg:text-2xl whitespace-nowrap font-ezman">
                            {item.name}
                        </TabsTrigger>)}

                    </TabsList>
                </div>

                {categories.map(item => <TabsContent key={"category_tab_key:" + item.itemTypeId} value={String(item.itemTypeId)} className="!pt-8 !w-full">
                    <HomeTabData category={item} />
                </TabsContent>)}

            </Tabs>
        </div>
    )
}
