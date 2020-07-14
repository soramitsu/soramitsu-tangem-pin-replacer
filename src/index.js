import { NFC } from 'nfc-pcsc'
import { read } from './hsm/ReadCommand'
import { changePin } from './hsm/ChangePin'
import { TlvTag } from './hsm/consts'

import fs from 'fs'
const nfc = new NFC()

let DEFAULT_PIN = process.env.DEFAULT_PIN || '000'
let PIN_LENGTH = process.env.PIN_LENGTH || 3

function randomInteger(length) {
  return Math.floor(Math.pow(10, length-1) + Math.random() * 9 * Math.pow(10, length-1));
}

nfc.on('reader', async reader => {
  reader.autoProcessing = false
  console.log('Reader is ready.')

  reader.on('card', async card => {
    let cardData = await read(reader)
    console.info(cardData)

    const newPin = randomInteger(PIN_LENGTH)

    let changePinResult = await changePin(
      reader,
      cardData[TlvTag.CardId.toString(16)],
      DEFAULT_PIN,
      '000000',
      newPin.toString()
    )
    console.log(`CardId: ${cardData[TlvTag.CardId.toString(16)]}. New PIN code: ${newPin}`)
    console.log(`Save it manually if something goes wrong`)

    if (changePinResult['f'] === '03') {
      console.log('Pin successfully changed')
      fs.appendFileSync('pins.txt', `${cardData[TlvTag.CardId.toString(16)]}: ${newPin}\n`)
    } else {
      console.log('Something went wrong. Please, try again.')
    }
  })

  reader.on('card.off', () => {

  })

  reader.on('error', () => {

  })

  reader.on('end', () => {

  })
})

nfc.on('error', () => {

})

