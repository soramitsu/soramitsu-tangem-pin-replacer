import TLV from 'node-tlv'
import { sha256 } from 'js-sha256'
import APDU from './APDU'
import { Instruction, TlvTag } from './consts'
import { convertTlvToObject } from './TLV'
import { hexToBytes } from './index'

const pin = sha256.hex('000000')
const pinTLV = new TLV(TlvTag.Pin, pin)

export const changePin = async (reader, cardId, pin2, newPin1, newPin2) => {
  // console.log(cardId, pin2, newPin1, newPin2)
  const pin2TLV = new TLV(TlvTag.Pin2, sha256.hex(pin2))
  const cardIdTLV = new TLV(TlvTag.CardId, cardId)
  const newPinTLV = new TLV(TlvTag.NewPin, sha256.hex(newPin1))
  const newPin2TLV = new TLV(TlvTag.NewPin2, sha256.hex(newPin2))

  const signCommand = new APDU({
    ins: Instruction.SwapPIN,
    data: hexToBytes(
      pinTLV.getTLV() +
      cardIdTLV.getTLV() +
      pin2TLV.getTLV() +
      newPinTLV.getTLV() +
      newPin2TLV.getTLV()
    )
  })

  let response = await reader.transmit(signCommand.toBuffer(), 5000)
  while (response.toString('hex').slice('-4') === '9789') {
    response = await reader.transmit(signCommand.toBuffer(), 5000)
  }

  return convertTlvToObject(response.slice(0, -2))
}
