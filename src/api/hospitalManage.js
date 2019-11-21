import axios from 'axios';
export async function uploadImg(page, file) {
  let filename = file.name;
  let ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
  if (ext !== '.jpg' && ext !== '.png' && ext !== '.gif' && ext !== '.jpeg' && ext !== '.bmp') {
    page.$alert('请选择图片类型的文件', '提示', {
      confirmButtonText: '确定',
      callback: action => {}
    });
    return false;
  }

  let form = new FormData();
  form.append('file', file, file.name);
  let config = {
    headers: { 'Content-Type': 'multipart/form-data' }
  };
  let rs = await axios.post(`${process.env.UPLOAD_HOST}`, form, config);
  return rs;
}
