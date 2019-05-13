import axios from '@/libs/api.request'
// 根据上传资源表id删除文件及数据
export const deleteFileAndData = (mediaId) => {
  return axios.request({
    url: '/media/deleteFileAndData',
    method: 'get',
    params: {
      mediaId
    }
  })
}
