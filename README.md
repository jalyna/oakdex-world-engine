# <img src="https://v20.imgup.net/oakdex_logfbad.png" alt="fixer" width=282>

[![Build Status](https://travis-ci.org/jalyna/oakdex-world-engine.svg?branch=master)](https://travis-ci.org/jalyna/oakdex-world-engine) ![David](https://img.shields.io/david/jalyna/oakdex-world-engine.svg)

## Getting Started

```
npm install oakdex-world-engine --save
```

```jsx
import * as React from 'react'
import * as ReactDOM from 'react-dom'

import WorldEngine from 'oakdex-world-engine'

import * as charset1 from './charset1.png'
import * as charset2 from './charset2.png'
import * as charset3 from './charset3.png'

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
```


## Contributing

I would be happy if you want to add your contribution to the project. In order to contribute, you just have to fork this repository.

Please respect the [Code of Conduct](//github.com/jalyna/oakdex-world-engine/blob/master/CODE_OF_CONDUCT.md).

```
$ npm install
```

### Build

```
$ npm run build
```

### Running in dev mode

```
$ npm run start
```

Go to `http://localhost:8080/`

### Run tests

```
$ npm test
```

## License

MIT License. See the included MIT-LICENSE file.

## Credits

Logo Icon by [Roundicons Freebies](http://www.flaticon.com/authors/roundicons-freebies).
