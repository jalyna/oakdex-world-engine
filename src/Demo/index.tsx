import * as React from 'react'
import * as ReactDOM from 'react-dom'

import WorldEngine, { Direction, ActionHandler, timeout } from '..'

import * as charset1 from './charset1.png'
import * as charset2 from './charset2.png'
import * as charset3 from './charset3.png'
import * as charset4 from './charset4.png'

const mapData = require('./small_demo.gamemap.json') // created through http://world-editor.oakdex.org

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
    controllableChar={{ id: 'heroine', name: 'Heroine', image: charset1, x: 7, y: 3 }}
    chars={[
      { id: 'stranger-woman', name: 'Stranger', image: charset2, x: 9, y: 4, dir: Direction.Up }, // bottom is default
      { id: 'guy', image: charset3, x: 10, y: 1, lookNotInDirection: true },
      { id: 'umbrella-woman', image: charset4, x: 4, y: 1, dir: Direction.Left, walkThrough: true }
    ]}
    onLoaded={(mapActionHandler) => { actionHandler = mapActionHandler }}
    onPressEnter={(charId, triggeredChar) => triggeredChar.id === 'stranger-woman' ? onEnterStranger() : console.log('Pressing Enter For', triggeredChar.id)}
    onOver={(charId, triggeredChar) => console.log('Walked over', triggeredChar.id)}
    onWalksTo={(charId, { prev, next }) => console.log(charId, 'walked to', next.x, next.y, next.looksAt.x, next.looksAt.y, next.special)}
    />,
  document.getElementById('app')
)
