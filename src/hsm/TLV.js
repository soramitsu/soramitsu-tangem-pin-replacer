export function convertTlvToObject (data) {
  let result = {}
  let index = 0

  while (index < data.length) {
    let tlv = {
      tag: data[index].toString(16),
      length: data[index + 1],
      value: data.slice(index + 2, index + 2 + data[index + 1])
    }

    result[tlv.tag] = tlv.value.toString('hex')
    index = index + 2 + tlv.length
  }

  return result
}

export function convertObjectToTlv (tag, value) {
  let a = []
  let val = Buffer.from(value, 'hex')
  a.push(tag)
  if (val.length > 0xFF) {
    a.push(0)
  }
  a.push(...Buffer.from(val.length.toString(16), 'hex'))
  a.push(...val)

  return Buffer.from(a)
}
