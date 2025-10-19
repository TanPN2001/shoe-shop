import Link from "next/link"
import { PostDoc } from "./post.dummy"

type Props = { item: PostDoc }

function PostContent({ item }: Props) {
    return <div className="space-y-4">
        <img src={item.image} alt="" className="w-full lg:w-[720px] h-[320px] lg:h-[405px]"/>
        <p className="font-ezman text-xl lg:text-3xl">{item.title}</p>
        <p className="text-gray-300 text-sm">{item.date}</p>
        <div dangerouslySetInnerHTML={{ __html: item.preview }} />
        <Link className="text-ezman-red" href={`/bai-viet/hot/${item.postId}`}>{"<"}Đọc tiếp{">"}</Link>
    </div>
} export default PostContent