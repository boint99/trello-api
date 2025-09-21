export const slugify = (val) => {
  if (!val) return '' // Nếu không có giá trị (null, undefined, rỗng) thì trả về chuỗi rỗng

  return val
    .normalize('NFKD') // Chuẩn hóa chuỗi thành dạng Unicode tách dấu (vd: "ế" -> "e" + "́")
    .replace(/[\u0300-\u036f]/g, '') // Xóa toàn bộ dấu thanh, dấu mũ (accent)
    .trim() // Xóa khoảng trắng ở đầu và cuối
    .toLowerCase() // Chuyển hết về chữ thường
    .replace(/[^\w\s-]/g, '') // Xóa tất cả ký tự không phải chữ, số, khoảng trắng, hoặc dấu gạch ngang
    .replace(/[\s_-]+/g, '-') // Thay nhiều khoảng trắng, dấu gạch dưới (_) hoặc gạch ngang liên tiếp bằng 1 dấu "-"
    .replace(/^-+|-+$/g, '') // Xóa gạch ngang ở đầu hoặc cuối chuỗi
}