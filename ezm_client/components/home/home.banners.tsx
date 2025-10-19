"use client"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import Image from "next/image"
import Link from "next/link"

function HomeBanners() {
    return <div className="banners w-full">
        <Carousel
            opts={{ loop: true, align: "start" }}
            plugins={[
                Autoplay({ delay: 5000 })
            ]} className="w-full">
            <CarouselContent className="">

                <CarouselItem>
                    <div className="w-full">
                        <Link target="_blank" className="w-full h-full" href="https://www.instagram.com/ezmansneaker.01?igsh=NDJoMnVvcG5xbzll&utm_source=qr">
                            <Image
                                src="/images/banners/banner1.jpg"
                                alt="banner1"
                                width={1280}
                                height={720}
                                loading="eager"
                                style={{ width: "100%", height: "auto" }}
                            />
                        </Link>
                    </div>
                </CarouselItem>

                <CarouselItem>
                    <div className="w-full">
                        <Link target="_blank" className="w-full h-full" href="https://www.tiktok.com/@ezman_sneaker01?_t=ZS-8zj5e7H2JwO&_r=1">
                            <Image
                                src="/images/banners/banner2.jpg"
                                alt="banner1"
                                width={1280}
                                height={720}
                                loading="eager"
                                style={{ width: "100%", height: "auto" }}
                            />
                        </Link>
                    </div>
                </CarouselItem>

                <CarouselItem>
                    <div className="w-full">
                        <Link target="_blank" className="w-full h-full" href="https://www.facebook.com/share/17FV4g31ta/?mibextid=wwXIfr">
                            <Image
                                src="/images/banners/banner3.jpg"
                                alt="banner1"
                                width={1280}
                                height={720}
                                loading="eager"
                                style={{ width: "100%", height: "auto" }}
                            />
                        </Link>
                    </div>
                </CarouselItem>

            </CarouselContent>
            <CarouselPrevious className="top-0 right-0 bg-red-500" />
            <CarouselNext className="w-8 lg:w-12 h-8 lg:h-12 cursor-pointer right-2 lg:right-12 top-[90%] lg:top-[92%]"/>
        </Carousel>
    </div>
}; export default HomeBanners
