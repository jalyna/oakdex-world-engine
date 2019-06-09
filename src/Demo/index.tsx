import * as React from 'react'
import * as ReactDOM from 'react-dom'

import WorldEngine, { Direction, ActionHandler, EvenType, timeout } from '..'

import * as charset1 from './charset1.png'
import * as charset2 from './charset2.png'
import * as charset3 from './charset3.png'
import * as charset4 from './charset4.png'
import * as charset6 from './charset6.png'

const mapData = require('./demo_with_events.gamemap.json') // created through http://world-editor.oakdex.org

console.log(mapData)

let actionHandler: ActionHandler

async function onEnterStranger () {
  console.log('TRIGGERED STRANGER')
  if (!actionHandler) {
    return
  }
  actionHandler.disableMovement()
  await actionHandler.changeCharDir('stranger-woman', Direction.Left)
  await timeout(300)
  await actionHandler.changeCharDir('stranger-woman', Direction.Down)
  actionHandler.hideChar('stranger-woman')
  await timeout(600)
  await actionHandler.changeCharDir('stranger-woman', Direction.Right)
  actionHandler.showChar('stranger-woman')
  await timeout(600)
  const up1 = await actionHandler.moveChar('stranger-woman', Direction.Up, { msPerFrame: 100 })
  const up2 = await actionHandler.moveChar('stranger-woman', Direction.Up)
  if (up1) {
    await actionHandler.moveChar('stranger-woman', Direction.Down, { msPerFrame: 150 })
  }
  if (up2) {
    await actionHandler.moveChar('stranger-woman', Direction.Down)
  }
  await actionHandler.moveCharTo('stranger-woman', 7, 3)
  await actionHandler.moveCharTo('stranger-woman', 9, 4)
  actionHandler.enableMovement()
  console.log('DONE')
}

ReactDOM.render(
  <WorldEngine
    mapData={mapData}
    viewport={{ width: 19, height: 15 }}
    controllableChar={{ id: 'heroine', name: 'Heroine', image: charset6, x: 7, y: 3 }}
    onLoaded={(mapActionHandler) => { actionHandler = mapActionHandler }}
    chars={[]}
    onEvent={(charId: string, eventType: EvenType, event: object) => console.log(charId, eventType, event)}
    />,
  document.getElementById('app')
)
