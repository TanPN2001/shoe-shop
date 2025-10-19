"use client"
import Autoplay from "embla-carousel-autoplay";
import CommonSection from "../common/section";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import PostContent from "./post.content";
import { postDummy } from "./post.dummy";
import Link from "next/link";
import Image from "next/image";

function PostWrapper() {
    return <CommonSection label={<p className='text-lg lg:text-3xl font-ezman font-semibold'>BÀI VIẾT</p>}>
        <Carousel
            opts={{ loop: true, align: "start" }}
            plugins={[
                Autoplay({ delay: 5000 })
            ]} className="w-full">
            <CarouselContent className="">

                {postDummy.map(item => <CarouselItem key={"post::" + item.postId} className="basis-1/1 lg:basis-1/3">
                    <PostContent key={"post_item:" + item.postId} item={item} />
                </CarouselItem>
                )}

            </CarouselContent>
            <CarouselPrevious className="lg:hidden flex bg-gray-400 -left-12" />
            <CarouselNext className="lg:hidden flex bg-gray-400 right-1 lg:-right-12" />
        </Carousel>
    </CommonSection>
}; export default PostWrapper