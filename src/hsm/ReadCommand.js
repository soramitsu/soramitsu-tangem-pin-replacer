import TLV from 'node-tlv'
import { sha256 } from 'js-sha256'
import APDU from './APDU'
import { Instruction, TlvTag } from './consts'
import { hexToBytes } from './index'
import { convertTlvToObject } from './TLV'
const pin = sha256.hex('000000')
const pinTLV = new TLV(TlvTag.Pin, pin)

const readCommand = new APDU({
  ins: Instruction.Read,
  data: hexToBytes(pinTLV.getTLV())
})

export const read = async (reader) => {
  if (reader) {
    let result = await reader.transmit(readCommand.toBuffer(), 5000)

    let cardData = result.slice(0, -2)

    return convertTlvToObject(cardData)
  }

  return null
}
