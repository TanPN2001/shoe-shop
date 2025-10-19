"use client"
import {
    Carousel,
    CarouselContent,
    CarouselItem
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

const brands = [
    {
        src: "/images/brands/adias.png"
    },
    {
        src: "/images/brands/mlb.png"
    },
    {
        src: "/images/brands/converse.png"
    },
    {
        src: "/images/brands/dior.png"
    },
    {
        src: "/images/brands/asics.png"
    },
    {
        src: "/images/brands/newb.png"
    },
    {
        src: "/images/brands/vans.png"
    },
    {
        src: "/images/brands/nike.png"
    },
    {
        src: "/images/brands/mcqueen.png"
    },
    {
        src: "/images/brands/puma.png"
    },
    {
        src: "/images/brands/gucci.png"
    },
    {
        src: "/images/brands/lv.png"
    },
]

function HomeBrands() {
    return (
        <Carousel
            opts={{ loop: true, align: "start" }}
            plugins={[
                Autoplay({ delay: 2000 })
            ]} className="w-full">
            <CarouselContent className="-ml-1">
                {brands.map((item, index) => (
                    <CarouselItem key={index} className="pl-1 basis-1/3 lg:basis-1/6">
                        <div className="p-1">
                            <div>
                                <img src={item.src} className="w-[124px] lg:w-[257px] h-[64px] lg:h-[128px]" alt="" />
                            </div>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    )
}; export default HomeBrands
