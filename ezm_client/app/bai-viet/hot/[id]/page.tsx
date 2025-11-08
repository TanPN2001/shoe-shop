import Rating from "@/components/ui/rating";
import { postDummy } from "@/components/post/post.dummy";
import ShareLinks from "@/components/common/share-links";

export default function HotPostPage({ params }: { params: any }) {
    const id = Number(params.id)
    const post = postDummy.find(p => p.postId === id)

    if (!post) {
        return (
            <div className="px-4 lg:px-12 py-12 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-3xl font-bold mb-2">Bài viết không tồn tại</h1>
                    {/* <p>Không tìm thấy bài viết với ID: {params.id}</p> */}
                    <p>Không tìm thấy bài viết</p>
                </div>
            </div>
        )
    }

    const related = postDummy.filter(p => p.postId !== id).slice(0, 6)

    return (
        <div className="w-full">
            <section className="ambition-section px-4 lg:px-12 py-6 lg:py-10">
                <div className="max-w-6xl text-white">
                    <nav className="flex items-center gap-2 mb-4 text-sm opacity-80">
                        <a href="/" className="hover:text-ezman-red transition-colors">EZMAN</a>
                        <span>/</span>
                        <a href="/" className="hover:text-ezman-red transition-colors">Bài viết hot</a>
                        <span>/</span>
                        <span className="line-clamp-1">{post.title}</span>
                    </nav>

                    <h1 className="text-2xl lg:text-4xl font-ezman font-semibold mb-2">{post.title}</h1>
                    <div className="flex items-center gap-4 text-sm">
                        <span className="text-neutral-300">{post.date}</span>
                        <div className="flex items-center gap-2">
                            <Rating defaultValue={4} />
                            <span className="text-neutral-300">4.0</span>
                            <span className="text-neutral-500">(128 đánh giá)</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="px-4 lg:px-12">
                <div className="max-w-6xl grid grid-cols-1 lg:grid-cols-[1.4fr_0.6fr] gap-8 lg:gap-12">
                    <article className="text-white">
                        <div className="w-full overflow-hidden rounded-xl border border-neutral-800/50 bg-neutral-900">
                            <img src={post.image} alt={post.title} className="w-full h-auto object-cover" />
                        </div>
                        <div className="prose prose-invert max-w-none mt-6 leading-relaxed">
                            <div dangerouslySetInnerHTML={{ __html: post.content }} />
                        </div>

                        <div className="mt-8 p-4 lg:p-6 rounded-xl border border-neutral-800/50 bg-neutral-900/60">
                            <h3 className="text-lg font-semibold mb-3">Chia sẻ bài viết</h3>
                            <ShareLinks title={post.title} />
                        </div>
                    </article>

                    <aside className="text-white">
                        <div className="sticky top-24">

                            <div className="p-4 rounded-xl border border-neutral-800/50 bg-neutral-900/60">
                                <h3 className="text-lg font-semibold mb-4">Bài viết liên quan</h3>
                                <div className="grid grid-cols-1 gap-5">
                                    {related.map(r => (
                                        <a key={"related:" + r.postId} href={`/hot/${r.postId}`} className="group grid grid-cols-[140px_1fr] gap-4 rounded-xl overflow-hidden border border-neutral-800/50 hover:border-ezman-red/60 transition-colors">
                                            <div className="w-full h-full bg-neutral-800/60">
                                                <img src={r.image} alt={r.title} className="w-full h-full object-cover aspect-[16/11]" />
                                            </div>
                                            <div className="py-2 pr-4">
                                                <p className="text-base font-medium group-hover:text-ezman-red transition-colors line-clamp-2">{r.title}</p>
                                                <p className="text-xs text-neutral-400 mt-2">{r.date}</p>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>

            <section className="px-4 lg:px-12 mt-12 lg:mt-16">
                <div className="max-w-6xl">
                    <h2 className="text-white text-xl lg:text-2xl font-semibold mb-4">Có thể bạn cũng thích</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {related.slice(0, 3).map(r => (
                            <a key={"suggest:" + r.postId} href={`/hot/${r.postId}`} className="group block rounded-xl overflow-hidden border border-neutral-800/50 hover:border-ezman-red/60 transition-colors">
                                <div className="aspect-[16/9] bg-neutral-900">
                                    <img src={r.image} alt={r.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="p-4">
                                    <h3 className="text-white font-medium group-hover:text-ezman-red transition-colors line-clamp-2">{r.title}</h3>
                                    <p className="text-xs text-neutral-400 mt-1">{r.date}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}


