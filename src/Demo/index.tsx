import * as React from 'react'
import * as ReactDOM from 'react-dom'

import WorldEngine from '..'

import * as charset1 from './charset1.png'
import * as charset2 from './charset2.png'
import * as charset3 from './charset3.png'

const mapData = require('./demo.gamemap.json')

ReactDOM.render(
  <WorldEngine
    mapData={mapData}
    viewport={{ width: 19, height: 15 }}
    controllableChar={{ name: 'Heroine', image: charset1, x: 36, y: 12 }}
    chars={[
      { name: 'Stranger', image: charset2, x: 32, y: 13, looksTo: 'top' }, // bottom is default
      { name: 'Other Person', image: charset3, x: 44, y: 12 }
    ]}
    onWalksTo={({ prev, next }) => console.log('walked to', next.x, next.y, next.looksAt.x, next.looksAt.y, next.special)}
    onPressEnter={({ x, y, special, looksAt }) => console.log('pressed enter', looksAt.x, looksAt.y, special)}
    />,
  document.getElementById('app')
)
