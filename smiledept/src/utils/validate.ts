/**
 * 判断是否为外部链接
 * @param {string} path
 * @returns {boolean}
 */
export function isExternal(path: string) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * 判断是否为数组
 * @param {any} arg
 * @returns {boolean}
 */
export function isArray(arg: any) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

/**
 * 判断是否为空
 * @param {any} val
 * @returns {boolean}
 */
export function isEmpty(val: any) {
  if (val === null || val === undefined) return true

  if (typeof val === 'boolean') return false

  if (typeof val === 'number') return !val

  if (val instanceof Error) return val.message === ''

  switch (Object.prototype.toString.call(val)) {
    case '[object String]':
    case '[object Array]':
      return !val.length
    case '[object File]':
    case '[object Map]':
    case '[object Set]':
      return !val.size
    case '[object Object]':
      return !Object.keys(val).length
    default:
      return false
  }
}
