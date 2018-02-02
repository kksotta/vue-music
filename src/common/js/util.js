function getRandomInt(min, max) {
  /**
   * 在区间内取最大值与最小值的整数，包括最大值 、最小值
   */
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle(arr) {
  /**
   * arr.slice() 复制该数组，处理后不会改变原数组
   * @type {[type]}
   */
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}

export function debounce(func, delay) {
  let timer

  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}