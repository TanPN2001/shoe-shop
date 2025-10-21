import CommonSection from "@/components/common/section";
import CommonSlogan from "@/components/common/slogan";
import HomeBanners from "@/components/home/home.banners";
import HomeBrands from "@/components/home/home.brand";
import HomeTab from "@/components/home/home.tab";
import PostContent from "@/components/post/post.content";
import { postDummy } from "@/components/post/post.dummy";
import PostWrapper from "@/components/post/post.wrapper";
import { server } from "@/services/service.api";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {

  const loader = async () => {
    try {
      const { data: res } = await server.get("/item-type/get")
      return { categories: (res.data as any[]).sort((a, b) => a.itemTypeId || 0 - b.itemTypeId || 0) }
    } catch (err) {
      return { categories: [] }
    }
  }

  const { categories } = await loader()
  return <div>
    <div className="ambition-section py-2 lg:!py-8 px-4 lg:!px-12">
      <CommonSlogan text="Ezman Sneaker" className="text-4xl lg:text-8xl font-ezman font-medium text-ezman-red" />
    </div>

    <HomeBanners />

    <div className="lg:py-12 py-4 w-full px-4 lg:px-12">
      <HomeBrands />
    </div>

    <CommonSection label={<p className='text-lg lg:text-3xl font-ezman font-semibold'>NỔI BẬT</p>}>
      <HomeTab categories={categories} />
    </CommonSection>

    <div className="mt-12 lg:py-12 py-4 w-full px-4 lg:px-12 space-y-6">

      <div className="flex flex-col lg:flex-row space-x-0 lg:space-x-6 space-y-6 lg:space-y-0">

        <Link href="/danh-muc/giay-sneaker" className="block w-full lg:w-[50%] relative group">
          <div className="w-full h-full relative group">
            <div className="absolute top-0 left-0 w-full h-full duration-200 bg-transparent group-hover:bg-black/50 flex items-center justify-center">
              <div className="text-center">
                <p className="font-ezman text-white text-4xl font-semibold">Giày sneaker</p>
                <br />
                <p className="text-white">{"<"}Khám phá{">"}</p>
              </div>
            </div>
            <img src={"/images/posts/pp1.jpg"} alt="anh1" className="w-full h-full" />
          </div>
        </Link>

        <Link href="/danh-muc/giay-the-thao" className="block w-full lg:w-[50%] relative group">
          <div className="w-full h-full relative group">
            <div className="absolute top-0 left-0 w-full h-full duration-200 bg-transparent group-hover:bg-black/50 flex items-center justify-center">
              <div className="text-center">
                <p className="font-ezman text-white text-4xl font-semibold">Giày thể thao</p>
                <br />
                <p className="text-white">{"<"}Khám phá{">"}</p>
              </div>
            </div>
            <img src={"/images/posts/pp2.jpg"} alt="anh2" className="w-full h-full" />
          </div>
        </Link>

      </div>

      <Link href="/danh-muc/ma-hottrend" className="block w-full relative group">
        <div className="w-full h-full relative group">
          <div className="absolute top-0 left-0 w-full h-full duration-200 bg-transparent group-hover:bg-black/50 flex items-center justify-center">
            <div className="text-center">
              <p className="font-ezman text-white text-4xl font-semibold">Mã hottrend</p>
              <br />
              <p className="text-white">{"<"}Khám phá{">"}</p>
            </div>
          </div>
          <img src={"/images/posts/pp3.jpg"} className="w-full h-full" alt="anh1" />
        </div>
      </Link>

    </div>

    <br />

    <PostWrapper />

    <div className="mt-12 flex flex-col lg:flex-row gap-6 lg:py-12 py-4 w-full px-4 lg:px-12">

      <iframe
        src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fprofile.php%3Fid%3D61562763856109&tabs=timeline&width=400&height=500&small_header=false&adapt_container_width=false&hide_cover=false&show_facepile=true&appId=235818695517651"
        width={400}
        height={500}
        style={{ border: "none", overflow: "hidden" }}
        scrolling="no"
        frameBorder={0}
        allowFullScreen={true}
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
      />

      <iframe
        name="__tt_embed__v37236099563691610"
        sandbox="allow-popups allow-popups-to-escape-sandbox allow-scripts allow-top-navigation allow-same-origin"
        src="https://www.tiktok.com/embed/@ezman_sneaker01?lang=vi&referrer=https://ezmansneaker.com?embedFrom=embed_page"
        style={{
          width: "100%",
          height: 495,
          display: "block",
          visibility: "unset",
          maxHeight: 495
        }}

      />

      <iframe
        width={400}
        className="flex min-h-[400px] w-[400px] flex-1 bg-white"
        src="https://www.instagram.com/ezmansneaker.01/embed/"></iframe>
    </div>

  </div>
}
