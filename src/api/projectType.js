import axios from '@/libs/api.request'

// 分页获取项目类型信息
export const getProjectTypeList = (queryList) => {
  return axios.request({
    url: '/projectType/getPageList',
    method: 'get',
    params: queryList
  })
}

// 新增项目类型信息
export const addProjectType = (projectTypeTemp) => {
  return axios.request({
    url: '/projectType/addProjectType',
    method: 'post',
    data: projectTypeTemp
  })
}

// 修改项目类型信息
export const editProjectType = (projectTypeTemp) => {
  return axios.request({
    url: '/projectType/editProjectType',
    method: 'post',
    data: projectTypeTemp
  })
}

// 根据项目类型id获取项目类型信息
export const getprojectTypeById = (id) => {
  return axios.request({
    url: '/projectType/getById',
    method: 'get',
    params: { id: id }
  })
}

// 根据样本类型类型获取项目类型列表
export const getProjectTypeBySampleType = (sampleType) => {
  return axios.request({
    url: 'projectType/getProjectTypeBySampleType',
    method: 'get',
    params: {
      sampleType: sampleType
    }
  })
}

// 根据样本类型类型获取项目类型列表（未删除，可用）
export const getUnDeleteProjectTypeBySampleType = (sampleType) => {
  return axios.request({
    url: 'projectType/getUnDeleteProjectTypeBySampleType',
    method: 'get',
    params: {
      sampleType: sampleType
    }
  })
}

// 获取样本类型列表
export const getSampleTypeList = () => {
  return axios.request({
    url: 'projectType/getSampleTypeList',
    method: 'get'
  })
}

// 获取所有的项目类型
export const getAllProjectType = () => {
  return axios.request({
    url: 'projectType/getAllProjectType',
    method: 'get'
  })
}

// 删除项目类型
export const deleteProject = (id) => {
  return axios.request({
    url: 'projectType/delete',
    method: 'get',
    params: { id }
  })
}

// 判断项目类型是否已使用（使用返回true）
export const isUsedProjectType = (id) => {
  return axios.request({
    url: 'projectType/isUsedProjectType',
    method: 'get',
    params: {
      id
    }
  })
}
