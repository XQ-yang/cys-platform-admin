import axios from '@/libs/api.request'

// 根据id集合获取上传文件信息
export const getMediaListInfo = (ids) => {
  return axios.request({
    url: '/media/get_media_list_info',
    method: 'post',
    data: ids
  })
}

// 打开文件
export const openWindow = (url, title) => {
  let win = window.open(url)
  if (win && win.document) {
    win.document.title = title
    if (win.document.head) {
      win.document.head.title = title
    }
  }
}
