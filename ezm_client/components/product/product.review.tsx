"use client"
import { Textarea } from "@/components/ui/textarea"
import Rating from "@/components/ui/rating";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { userService } from "@/services/service.api";
import { toast } from "sonner"
import { generateRandomComments } from "./product.dummy-comment";

type Props = { item: ProductDocument }

function ProductReview({ item }: Props) {
    const [comments, setComments] = useState<CommentDoc[]>([])
    const [stars, setStars] = useState(0)
    const [content, setContent] = useState("")
    const [showAll, setShowAll] = useState(false)

    const load = async () => {
        // Sử dụng localStorage để cache comment, tránh phải generate lại
        const storageKey = `ezm-comments-${item.itemId}`;
        let cached = localStorage.getItem(storageKey);
        let comments: CommentDoc[];
        if (cached) {
            try {
                comments = JSON.parse(cached);
                // convert date strings back to Date objects
                comments = comments.map(c => ({
                    ...c,
                    createdAt: new Date(c.createdAt),
                    updatedAt: new Date(c.updatedAt)
                }));
            } catch {
                comments = generateRandomComments(item.itemId, 10);
                localStorage.setItem(storageKey, JSON.stringify(comments));
            }
        } else {
            comments = generateRandomComments(item.itemId, 10);
            localStorage.setItem(storageKey, JSON.stringify(comments));
        }
        setComments(comments);
    }

    useEffect(() => {
        load()
    }, [])

    const postComment = async () => {

        if (content.length == 0) {
            toast.error("Vui lòng nhập nội dung", { richColors: true })
            return
        }

        const lastComment = localStorage.getItem("ezm-last-comment")
        const now = Date.now();
        if (lastComment) {
            const lastTime = Number(lastComment);
            if (!isNaN(lastTime) && now - lastTime < 30 * 60 * 1000) {
                toast.error("Bạn vừa bình luận, vui lòng chờ 30 phút trước khi gửi tiếp!", { richColors: true })
                return;
            }
        }

        localStorage.setItem("ezm-last-comment", now.toString())

        await userService.post("/comment/create", {
            itemId: item.itemId,
            content,
            star: stars
        })

        toast.success("Bình luận của bạn đã được ghi nhận và đang kiểm duyệt")
        load()
    }

    // Determine which comments to show
    const visibleComments = showAll ? comments : comments.slice(0, 3);

    return <div className="pt-2 space-y-8">
        <p className="font-medium">Bình luận và đánh giá</p>
        <div className="relative">
            <div className="">
                {comments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center pb-4">
                        <img src="/images/empty.svg" alt="" />
                        <p className="font-semibold text-3xl">Sản phẩm chưa có đánh giá nào</p>
                    </div>
                ) : (
                    <div>
                        {visibleComments.map(comment => (
                            <div key={comment.commentId} className="mb-6 border-b border-gray-700 pb-4">
                                <div className="flex items-center space-x-2 mb-1">
                                    <Rating value={comment.star} readOnly size={18} />
                                    <span className="text-sm text-gray-400">{comment.star} sao</span>
                                    <span className="text-xs text-gray-500 ml-4">
                                        {new Date(comment.createdAt).toLocaleString("vi-VN")}
                                    </span>
                                </div>
                                <div className="text-base text-white">{comment.content}</div>
                            </div>
                        ))}
                        {!showAll && comments.length > 3 && (
                            <div className="flex justify-center">
                                <Button
                                    className="rounded-none border border-background px-6"
                                    onClick={() => setShowAll(true)}
                                >
                                    Xem thêm
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className=" pt-2 bg-ezman-bg space-y-2">
                <div className="flex star-picker space-x-2 items-center">
                    <Rating value={stars} onChange={setStars} />
                    <p>Đã chọn: {stars} sao</p>
                </div>
                <Textarea onChange={({ target }) => setContent(target.value)} className="rounded-none border-red-900" placeholder="Hãy để lại 1 vài bình luận của bạn về sản phẩm này" />
                <Button onClick={postComment} className="w-full cursor-pointer rounded-none border border-background">Đánh giá</Button>
            </div>
        </div>
    </div>
}
export default ProductReview