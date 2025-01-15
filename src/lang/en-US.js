function translateObject(obj) {
    const translatedObj = {}

    for (const key in obj) {
        if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            translatedObj[key] = translateObject(obj[key])
        } else {
            translatedObj[key] = key
        }
    }

    return translatedObj
}

import zhCN from './zh-CN.js'

const original = zhCN
const translated = translateObject(original)
console.log('【translated】:', translated)
export default translated
