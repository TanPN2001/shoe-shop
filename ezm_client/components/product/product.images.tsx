"use client"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

type Props = { detail: ProductDocument }
function ProductImages({ detail }: Props) {

    return <Carousel
        opts={{ loop: true, align: "start" }}
        plugins={[
            Autoplay({ delay: 2000 })
        ]} className="w-full">
        <CarouselContent className="-ml-1">
            {detail.images.map((item, index) => (
                <CarouselItem key={"key_images_product:" + index} className="pl-1 basis-1/1 lg:basis-1/3">
                    <div className="p-1">
                        <div className="">
                            <img src={item} alt="" className="w-full lg:w-[600px] max-h-[400px] lg:max-h-[600px] h-[600px]" />
                        </div>
                    </div>
                </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselPrevious className="bg-gray-200"/>
        <CarouselNext className="bg-gray-200 right-1 lg:-right-12" />
    </Carousel>
}; export default ProductImages