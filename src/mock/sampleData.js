import Mock from 'mockjs'

export const getSampleList = req => {
  const list = []
  const count = 20
  for (let i = 0; i < count; i++) {
    list.push(Mock.mock({
      id: '@guid()',
      customerId: '@guid()',
      'sampleType|1': [1, 2, 3],
      'projectType|1': [1, 2, 3],
      customerName: '@cname',
      customerPhone: /^1[385][1-9]\d{8}/,
      collectHospita: '深圳市人民医院',
      planCollectTime: Mock.Random.date('yyyy-MM-dd')
    }))
  }
  return {
    msg: '',
    data: { total: list.length, list: list },
    code: 0
  }
}
