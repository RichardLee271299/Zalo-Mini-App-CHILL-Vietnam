const fs = require('fs');
class GetImageController
{
    show(req,res)
    {
        // Đường dẫn đến thư mục public
        const image_path = './public/uploads/file_upload-1692351784233';
      
        fs.readFile(image_path, (err, data) => {
          if (err) {
            console.error('Error reading file:', err);
            res.status(500).send('Internal Server Error');
            return;
          }
      
          res.setHeader('Content-Type', 'image/jpeg'); // Thay đổi kiểu dữ liệu tùy theo định dạng ảnh
          res.end(data);
        });
    }
}
module.exports = new GetImageController