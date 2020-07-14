function APDU (command) {
  this.class = command.class || 0x00
  this.ins = command.ins
  this.p1 = command.p1 || 0x00
  this.p2 = command.p2 || 0x00
  this.data = command.data

  this.bytes = []
  this.bytes.push(this.class)
  this.bytes.push(this.ins)
  this.bytes.push(this.p1)
  this.bytes.push(this.p2)

  if (this.data) {
    this.lc = this.data.length
    this.bytes.push(0)
    this.bytes.push(this.lc >> 8)
    this.bytes.push(this.lc & 0xFF)
    this.bytes = this.bytes.concat(this.data)
  }
}

APDU.prototype.toString = function () {
  return this.toBuffer().toString('hex')
}

APDU.prototype.toByteArray = function () {
  return this.bytes
}

APDU.prototype.toBuffer = function () {
  return Buffer.from(this.bytes)
}

export default APDU
