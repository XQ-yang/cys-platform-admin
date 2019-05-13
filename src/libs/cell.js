/**
 * 根据细胞存储位置集合, 计算这些细胞所在罐,区,塔,盒管的位置文本
 * 每条数据都要求必须要有如下字段, 缺少下面字段无法执行
 * potCode: 罐号
 * regionCode: 区号
 * towerCode: 塔号
 * boxCode: 盒号
 * latticeNum: 管号
 *
 * @param {细胞存储位置} cellLocations
 */
export function caculateLocation(cellLocations) {
  if (!cellLocations || !cellLocations.length) {
    return ''
  }
  // item.potCode +' 罐-'+ item.regionCode +' 区-'+ item.towerCode +' 塔-'+ item.boxCode +' 盒-'+ item.latticeNum +' 号管'
  // 先按 罐, 区, 塔, 盒为键 分组
  let cellMap = groupByLocation(cellLocations)
  // 计算存储位置
  // 拼接字符串
  let locationText = ''
  // 先一个一个盒遍历循环
  Object.keys(cellMap).forEach((key, keyIndex) => {
    let arr = cellMap[key]
    // 上一个管号
    let lastlatticeNum = -1
    // 当前管号
    let currentlatticeNum = 0
    // 新开始位置管号
    let newStartlatticeNum = -1
    arr.forEach((item, index) => {
      // 填写主要信息
      if (index === 0) {
        locationText += item.potCode + ' 罐-' + item.regionCode + ' 区-' + item.towerCode + ' 塔-' + item.boxCode + ' 盒-'
      }
      lastlatticeNum = currentlatticeNum
      currentlatticeNum = item.latticeNum
      // 当前为第一管时
      if (index === 0) {
        newStartlatticeNum = currentlatticeNum
        locationText += '第 ' + currentlatticeNum
      }
      // 当号码不连续时
      if (index !== 0 && currentlatticeNum - lastlatticeNum !== 1) {
        // 单独一个(连续位置只有一个)
        if (lastlatticeNum === newStartlatticeNum) {
          locationText += ',' + currentlatticeNum
        } else { // 连续位置超过一个
          locationText += '-' + lastlatticeNum + ',' + currentlatticeNum
        }
        // 重新赋值连续开始位置
        newStartlatticeNum = currentlatticeNum
      }
      // 最后一管
      if (index === arr.length - 1) {
        // 判断最后是否只剩一管,且不连续
        if (currentlatticeNum === newStartlatticeNum) {
          locationText += ' 号管'
        } else { // 最后一管有连续
          locationText += '-' + currentlatticeNum + ' 号管'
        }
      }
    })
    // 跨盒时,每个盒用分号分隔
    if (keyIndex < Object.keys(cellMap).length - 1) {
      locationText += '; '
    }
  })
  return locationText
}

/**
 * 检测细胞存储位置是否连续
 * 有生产批次时按批次进行,没有批次时按盒进行
 *
 * @param {细胞存储位置} cellLocations
 */
export function isContinue(cellLocations) {
  if (!cellLocations || !cellLocations.length) {
    return true
  }
  let cellMap = {}
  let isContinue = true
  if (cellLocations[0].produceNumber) {
    // 按批号分组
    cellMap = groupByProduceNumber(cellLocations)
  } else {
    // 先按 罐, 区, 塔, 盒为键 分组
    cellMap = groupByLocation(cellLocations)
  }
  // 计算排序后的位置是否连续
  Object.keys(cellMap).forEach((key, keyIndex) => {
    let arr = cellMap[key]
    // 最大元素 - 最小元素 = 数组长度 - 1 则为连续的
    isContinue = (arr[arr.length - 1].latticeNum - arr[0].latticeNum === arr.length - 1) && isContinue
  })
  return isContinue
}

/**
 * 判断已选细胞管信息是否是整批次选取.
 * 所有细胞信息必须要有produceNumber属性
 *
 * @param {所有待选细胞管及位置信息} allCellLocations
 * @param {已选择细胞及位置信息} cellLocations
 */
export function checkProduceAll(allCellLocations, cellLocations) {
  if (!allCellLocations || !allCellLocations.length) {
    return true
  }
  if (!cellLocations || !cellLocations.length) {
    return true
  }

  // 对所有待选细胞按批号分组
  let allCellMap = groupByProduceNumber(allCellLocations)

  // 对所有已选细胞按批号分组
  let cellMap = groupByProduceNumber(cellLocations)

  let isSelectAll = true
  // 对按批号分组后的已选细胞进行判断, 判断是否选择了该批号下的所有细胞管
  Object.keys(cellMap).forEach(location => {
    isSelectAll = isSelectAll && cellMap[location].length >= allCellMap[location].length
  })

  return isSelectAll
}

/**
 * 将细胞按批号分组
 * 所有细胞信息必须要有produceNumber属性
 *
 * @param {细胞及位置信息} cellLocations
 */
export function groupByProduceNumber(cellLocations) {
  return groupBy(item => item.produceNumber, cellLocations)
}

/**
 * 将细胞按 罐, 区, 塔, 盒为键 分组(存储位置)
 * 每条数据都要求必须要有如下字段, 缺少下面字段无法执行
 * potCode: 罐号
 * regionCode: 区号
 * towerCode: 塔号
 * boxCode: 盒号
 * latticeNum: 管号
 *
 * @param {细胞及位置信息} cellLocations
 */
export function groupByLocation(cellLocations) {
  return groupBy(item => item.potCode + item.regionCode + item.towerCode + item.boxCode, cellLocations)
}

/**
 * 将细胞按 fun 分组, 按管号进行从小到大排序
 *
 * @param {分组函数} groupfun
 * @param {细胞及位置信息} cellLocations
 */
export function groupBy(groupfun, cellLocations) {
  if (!(groupfun instanceof Function)) {
    throw new Error('groupfun must is a function')
  }
  if (!cellLocations || !cellLocations.length) {
    return {}
  }
  let cellMap = {}
  // 按fun计算的键进行分组
  cellLocations.forEach((item, index) => {
    let key = groupfun(item)
    if (!cellMap[key]) {
      cellMap[key] = []
    }
    cellMap[key].push(item)
  })
  // 对分组后的数组按管号进行排序, 从小到大
  Object.keys(cellMap).forEach(key => {
    cellMap[key] = cellMap[key].sort((l1, l2) => l1.latticeNum - l2.latticeNum)
  })
  return cellMap
}

/**
 * 将细胞按批号分组, 然后每批从xx管到yy管显示
 * 每条数据都要求必须要有如下字段, 缺少下面字段无法执行
 * potCode: 罐号
 * regionCode: 区号
 * towerCode: 塔号
 * boxCode: 盒号
 * latticeNum: 管号
 * cellTotal: 细胞总量
 * cellViability: 细胞活率
 * cultureTime: 培养日期
 *
 * @param {细胞及位置信息} cellLocations
 */
export function transferLocation(cellLocations) {
  let cellMap = groupByProduceNumber(cellLocations)
  let newCells = []
  Object.keys(cellMap).forEach(produceNumber => {
    let onePnCells = cellMap[produceNumber]
    let locationText = caculateLocation(onePnCells)
    let cell = {
      locationText: locationText,
      produceNumber: produceNumber,
      cellTotal: onePnCells[0].cellTotal,
      cellViability: onePnCells[0].cellViability,
      cultureTime: onePnCells[0].cultureTime
    }
    newCells.push(cell)
  })
  return newCells
}

/**
 * 将细胞按 冰箱, 层, 试管架为键 分组(存储位置)
 * 每条数据都要求必须要有如下字段, 缺少下面字段无法执行
 * fridgeCode: 冰箱号
 * layerCode: 层号
 * rackCode: 试管架号
 * cuvetteNum: 管号
 *
 * @param {冰箱存储位置信息} serumLocations
 */
export function groupByFridgeLocation(serumLocations) {
  return groupBy(item => item.fridgeCode + item.layerCode + item.rackCode, serumLocations)
}

/**
 * 根据冰箱存储位置集合, 计算这些存储位置所在冰箱,层,试管架的位置文本
 * 每条数据都要求必须要有如下字段, 缺少下面字段无法执行
 * fridgeCode: 冰箱号
 * layerCode: 层号
 * rackCode: 试管架号
 * cuvetteNum: 管号
 *
 * @param {冰箱存储位置} serumLocations
 */
export function fridgeCaculateLocation(serumLocations) {
  if (!serumLocations || !serumLocations.length) {
    return ''
  }
  // fridgeCode +' 冰箱-'+ layerCode +' 层-'+ rackCode +' 试管架-第 '+ cuvetteNum +' 号管'
  // 先按 罐, 区, 塔, 盒为键 分组
  let cellMap = groupByFridgeLocation(serumLocations)
  // 计算存储位置
  // 拼接字符串
  let locationText = ''
  // 先一个一个试管架遍历循环
  Object.keys(cellMap).forEach((key, keyIndex) => {
    let arr = cellMap[key]
    // 上一个管号
    let lastcuvetteNum = -1
    // 当前管号
    let currentcuvetteNum = 0
    // 新开始位置管号
    let newStartcuvetteNum = -1
    arr.forEach((item, index) => {
      // 填写主要信息
      if (index === 0) {
        locationText += item.fridgeCode + ' 冰箱-' + item.layerCode + ' 层-' + item.rackCode + ' 试管架-'
      }
      lastcuvetteNum = currentcuvetteNum
      currentcuvetteNum = item.cuvetteNum
      // 当前为第一管时
      if (index === 0) {
        newStartcuvetteNum = currentcuvetteNum
        locationText += '第 ' + currentcuvetteNum
      }
      // 当号码不连续时
      if (index !== 0 && currentcuvetteNum - lastcuvetteNum !== 1) {
        // 单独一个(连续位置只有一个)
        if (lastcuvetteNum === newStartcuvetteNum) {
          locationText += ',' + currentcuvetteNum
        } else { // 连续位置超过一个
          locationText += '-' + lastcuvetteNum + ',' + currentcuvetteNum
        }
        // 重新赋值连续开始位置
        newStartcuvetteNum = currentcuvetteNum
      }
      // 最后一管
      if (index === arr.length - 1) {
        // 判断最后是否只剩一管,且不连续
        if (currentcuvetteNum === newStartcuvetteNum) {
          locationText += ' 号管'
        } else { // 最后一管有连续
          locationText += '-' + currentcuvetteNum + ' 号管'
        }
      }
    })
    // 跨盒时,每个盒用分号分隔
    if (keyIndex < Object.keys(cellMap).length - 1) {
      locationText += '; '
    }
  })
  return locationText
}
