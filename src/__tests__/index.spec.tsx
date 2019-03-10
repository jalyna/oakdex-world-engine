import * as React from 'react'
import { mount } from 'enzyme'
import toJson from 'enzyme-to-json'

import WorldEngine, { Direction } from '..'

const mapData = require('./demo.gamemap.json')

describe('<WorldEngine>', () => {
  const viewport = { 
    width: 5,
    height: 5
  }
  const char1 = {
    id: 'heroine',
    image: 'some-base64',
    name: 'Heroine',
    dir: Direction.Up,
    x: 36,
    y: 12
  }
  it('renders correctly', () => {
    const wrapper = mount(<WorldEngine
      mapData={mapData}
      viewport={viewport}
      controllableChar={char1}
      chars={[]}
    />)
    expect(toJson(wrapper, { noKey: false, mode: 'deep' })).toMatchSnapshot()
  })
})
