import { TabsContent } from "@/components/ui/tabs";
import { Keyword, keywords, lowLevelKeywords } from "./other.dummy";
import Link from "next/link";
import { DrawerClose } from "@/components/ui/drawer";

type Props = {
    value: string
    category: CategoryDocument
}

const LowLevelKeywords = (props: Keyword) => {

    const keys = lowLevelKeywords.filter(item => item.parent == props.id)

    return <div className="mt-2 flex flex-col gap-1 lg:gap-2">
        {keys.map(item => (
            <div key={item.id} className="text-gray-500 py-0.5 border-b last:border-b-0">
                <DrawerClose asChild>
                    <Link href={`/tim-kiem?query=${item.tag}`} className="cursor-pointer text-sm lg:text-base">
                        {item.name}
                    </Link>
                </DrawerClose>
            </div>
        ))}
    </div>
}

function OtherTabContent({ value, category }: Props) {

    const keywordsFounded = keywords.filter(item => item.category == category.itemTypeId)

    console.log(keywordsFounded)

    return <TabsContent value={value} className="px-0 lg:px-6">

        <p className="text-xl lg:text-5xl font-semibold font-ezman">{category.name}</p>

        <div className="mt-4 lg:mt-8 grid grid-cols-3 lg:grid-cols-6 gap-x-5 lg:gap-x-20 gap-y-2 lg:gap-y-4">
            {keywordsFounded.map(keyword => (
                <div key={keyword.id} className="">
                    <DrawerClose asChild>
                        <Link href={`/tim-kiem?query=${keyword.tag}`} className="cursor-pointer text-sm lg:text-base font-semibold">{keyword.name}</Link>
                    </DrawerClose>
                    <LowLevelKeywords {...keyword} />
                </div>
            ))}
        </div>

    </TabsContent>
}; export default OtherTabContent