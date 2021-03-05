import axios from '@/libs/api.request'

// ----流程部署相关----------------------------------------
// 分页获取流程部署列表
export const getProcessDefinitionPageList = (query) => {
  return axios.request({
    url: '/process-definition/get_page',
    method: 'get',
    params: query
  })
}

// 删除部署流程
export const deleteProcessDefinition = (deploymentId) => {
  return axios.request({
    url: '/process-definition/remove',
    method: 'get',
    params: { deploymentId }
  })
}

// 激活/挂起部署流程
export const activeSuspendProcessDefinition = (processDefinitionId) => {
  return axios.request({
    url: '/process-definition/active_suspend',
    method: 'get',
    params: { processDefinitionId }
  })
}

// 部署流程
export const deploySuspendProcessDefinition = (mediaId) => {
  return axios.request({
    url: '/process-definition/deploy',
    method: 'get',
    params: { mediaId }
  })
}

// -------流程实例相关-------------------------------------
// 分页获取流程实例列表
export const getProcessInstancePageList = (query) => {
  return axios.request({
    url: '/process-instance/get_page',
    method: 'get',
    params: query
  })
}

// 删除流程实例
export const deleteProcessInstance = (processInstanceId, deleteReason) => {
  return axios.request({
    url: '/process-instance/remove',
    method: 'get',
    params: { processInstanceId, deleteReason }
  })
}

// 激活/挂起流程实例
export const activeSuspendProcessInstance = (processInstanceId) => {
  return axios.request({
    url: '/process-instance/active_suspend',
    method: 'get',
    params: { processInstanceId }
  })
}

// 启动流程实例
export const startProcessInstance = (processDefinitionKey) => {
  return axios.request({
    url: '/process-instance/start_process',
    method: 'get',
    params: { processDefinitionKey }
  })
}

// -------代办任务相关-------------------------------------
// 分页获取代办任务列表
export const getActTaskPageList = (query) => {
  return axios.request({
    url: '/act-task/get_page',
    method: 'get',
    params: query
  })
}

// 完成代办任务
export const completeTask = (taskId) => {
  return axios.request({
    url: '/act-task/complete_task',
    method: 'get',
    params: { taskId }
  })
}

// -------历史任务相关-------------------------------------
// 分页获取历史任务列表
export const getActHistoryPageList = (query) => {
  return axios.request({
    url: '/act-history/get_page',
    method: 'get',
    params: query
  })
}

// 流程图高亮
export const getHighLine = (instanceId) => {
  return axios.request({
    url: '/act-history/get_high_line',
    method: 'get',
    params: { instanceId }
  })
}
