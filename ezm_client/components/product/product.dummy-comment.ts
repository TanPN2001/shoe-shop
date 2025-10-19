export const productDummyComments: string[] = [
  "Giày rất đẹp, chất lượng tuyệt vời!",
  "Mình rất hài lòng với sản phẩm này.",
  "Đôi giày mang rất êm chân, đi cả ngày không đau.",
  "Giá cả hợp lý, chất lượng vượt mong đợi.",
  "Shop giao hàng nhanh, đóng gói cẩn thận.",
  "Màu sắc giống hình, rất thời trang.",
  "Giày nhẹ, dễ phối đồ, mình rất thích.",
  "Đã mua lần 2, vẫn rất hài lòng.",
  "Đôi giày này thực sự đáng tiền.",
  "Chất liệu tốt, đường may chắc chắn.",
  "Mang đi học, đi làm đều phù hợp.",
  "Bạn bè ai cũng khen đẹp.",
  "Sẽ ủng hộ shop dài dài.",
  "Giày không bị hôi chân, rất thoáng khí.",
  "Form giày chuẩn, đi vừa vặn.",
  "Mình đã giới thiệu cho bạn bè cùng mua.",
  "Shop tư vấn nhiệt tình, hỗ trợ tốt.",
  "Giày bền, đi mấy tháng vẫn như mới.",
  "Đế giày êm, chống trơn trượt tốt.",
  "Mình rất thích thiết kế của đôi này.",
  "Giày hợp xu hướng, trẻ trung.",
  "Đóng gói đẹp, có cả túi chống ẩm.",
  "Mua online mà nhận được hàng rất ưng ý.",
  "Giày không bị bong keo, rất chắc chắn.",
  "Màu sắc tươi sáng, nổi bật.",
  "Đôi giày này đi chơi hay đi làm đều ổn.",
  "Shop giao hàng đúng hẹn.",
  "Giày nhẹ, không bị đau gót chân.",
  "Chất lượng vượt xa mong đợi.",
  "Giày không bị phai màu sau khi giặt.",
  "Đế giày cao su, bám đường tốt.",
  "Mình sẽ mua thêm màu khác.",
  "Giày phù hợp với nhiều loại trang phục.",
  "Rất hài lòng với dịch vụ của shop.",
  "Giày không bị chật hay rộng quá.",
  "Đôi này đi thể thao cũng rất ổn.",
  "Giày không bị gãy form sau khi sử dụng.",
  "Shop đóng gói kỹ càng, không bị móp méo.",
  "Giày đẹp hơn cả trong hình.",
  "Mình nhận được nhiều lời khen khi mang đôi này.",
  "Giày không bị trầy xước khi nhận hàng.",
  "Đôi giày này thực sự đáng mua.",
  "Chất lượng sản phẩm tuyệt vời.",
  "Giày rất dễ vệ sinh, không bám bẩn.",
  "Mình rất thích phong cách của đôi này.",
  "Giày không bị nặng chân.",
  "Shop phản hồi tin nhắn rất nhanh.",
  "Giày phù hợp với mọi lứa tuổi.",
  "Sản phẩm đúng mô tả, rất hài lòng.",
  "Giày mang đi du lịch rất tiện lợi."
];

export const dummyUsernames = [
  "minhhoang97",
  "bichngoc_2001",
  "tuanle.official",
  "linhchi_2000",
  "ngocmai.tran",
  "bichngoc_2010",
  "minhhoang.01",
  "nguyetquynh_",
  "khanhlinh.99",
  "duongtuananh",
  "trangpham_123",
  "sonle.1997",
  "huyenmy.ng",
  "kimngan_88",
  "phuonganhhihi",
  "trungkien.9x",
  "thuyduong_rose",
  "quanghieu.official",
  "huonggiang_94",
  "tuananh1234",
  "thanhdat.97",
  "thanhtruc_02",
  "ngocbao.98",
  "minhthu03",
  "tienthanh96",
  "loanloan_2001",
  "quynhnhu97",
  "phatthanh99",
  "trungtrung.2000",
  "huyenhuyen_98",
  "ngathanh95",
  "binhbinh_02",
  "thao_xinh97",
  "xuanxuan_01",
  "phuonghoang_",
  "truongxuan.le",
  "hieupham_1998",
  "ngan.nguyen",
  "tientran.official",
  "ngoclinh.95",
  "manhbuiblog",
  "thao.dang88",
  "quyenpham02",
  "anhnguyet03",
  "kien.trung99",
  "chau.minh96",
  "sonthanh2001",
  "gianghuong94",
  "ngan.kim2002",
  "namhoang95"
];

type CommentDoc = {
    commentId: number
    itemId: number
    content: string
    star: number
    createdAt: Date
    updatedAt: Date
}

export function generateRandomComments(itemId: number, count: number): CommentDoc[] {
    const comments: CommentDoc[] = [];
    const usedIndexes = new Set<number>();
    for (let i = 0; i < count; i++) {
        // Chọn ngẫu nhiên username và nội dung, không trùng lặp username
        let usernameIdx: number;
        do {
            usernameIdx = Math.floor(Math.random() * dummyUsernames.length);
        } while (usedIndexes.has(usernameIdx) && usedIndexes.size < dummyUsernames.length);
        usedIndexes.add(usernameIdx);

        const username = dummyUsernames[usernameIdx];
        const content = productDummyComments[Math.floor(Math.random() * productDummyComments.length)];
        const star = Math.random() < 0.7 ? 5 : 4; // 70% là 5 sao, 30% là 4 sao

        // Tạo thời gian ngẫu nhiên trong 30 ngày gần đây
        const now = new Date();
        const daysAgo = Math.floor(Math.random() * 30);
        const createdAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
        const updatedAt = new Date(createdAt);

        comments.push({
            commentId: Number(`${itemId}${i}${Date.now()}`), // unique id
            itemId,
            content: `[${username}]: ${content}`,
            star,
            createdAt,
            updatedAt
        });
    }
    return comments;
}
