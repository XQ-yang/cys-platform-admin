import Mock from 'mockjs'

export const fetchList = req => {
  const list = []
  const count = 20
  for (let i = 0; i < count; i++) {
    list.push(Mock.mock({
      Id: '@guid()',
      Name: '@cname',
      Phone: /^1[385][1-9]\d{8}/,
      Gender: '@integer(0,1)',
      IdNumber: Mock.Random.natural(),
      Ethnic: '汉族',
      'BloodType|1': ['A', 'B', 'AB', 'O'],
      'MaritalStatus|1': [0, 1, 2, 3],
      Birthday: Mock.Random.date('yyyy-MM-dd')
    }))
  }
  return {
    total: list.length,
    list: list
  }
}
