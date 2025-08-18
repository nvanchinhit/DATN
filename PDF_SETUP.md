# Hướng dẫn cài đặt chức năng xuất PDF

## Cài đặt dependencies

Để sử dụng chức năng xuất PDF, bạn cần cài đặt các thư viện sau:

```bash
npm install html2canvas jspdf
```

Hoặc chạy file batch:
```bash
install_pdf_deps.bat
```

## Chức năng đã được thêm

1. **Giao diện cải thiện:**
   - Header mỏng hơn và đẹp hơn
   - Các card có border và shadow nhẹ
   - Input fields mỏng hơn với focus states đẹp
   - Buttons có kích thước phù hợp

2. **Chức năng mới:**
   - Nút "Xem trước" để xem phiếu khám bệnh
   - Nút "Xuất PDF" để tải về file PDF
   - Nút "In" để in trực tiếp
   - Print preview modal đẹp hơn

3. **Cải thiện UX:**
   - Spacing và padding được tối ưu
   - Typography rõ ràng và dễ đọc
   - Responsive design tốt hơn
   - Loading states và error handling

## Sử dụng

1. **Xem trước:** Click nút "Eye" để xem phiếu khám bệnh
2. **Xuất PDF:** Click nút "Download" để tải PDF
3. **In:** Click nút "Printer" để in trực tiếp

## Lưu ý

- Chức năng PDF sẽ hoạt động sau khi cài đặt dependencies
- Nếu gặp lỗi, hãy kiểm tra console để debug
- PDF được tạo với chất lượng cao (scale: 2)
