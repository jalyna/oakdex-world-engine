import * as React from 'react'
import * as ReactDOM from 'react-dom'

import WorldEngine from '..'

import charset1 from './charset1.png'
import charset2 from './charset2.png'
import charset3 from './charset3.png'

const mapData = require('./demo.gamemap.json')

ReactDOM.render(
  <WorldEngine
    mapData={mapData}
    viewport={{ width: 12, height: 10 }}
    controllableChar={{ name: 'Heroine', image: charset1, x: 12, y: 14 }}
    chars={[
      { name: 'Stranger', image: charset2, x: 13, y: 12, looksTo: 'top' }, // bottom is default
      { name: 'Other Person', image: charset3, x: 15, y: 12 }
    ]}
    onWalksTo={({ prev, next }) => console.log('walked to', next.x, next.y, next.looksAt.x, next.looksAt.y, next.special)}
    onPressEnter={({ x, y, special, looksAt }) => console.log('pressed enter', looksAt.x, looksAt.y, special)}
    />,
  document.getElementById('app')
)
