import * as React from 'react'
import { Direction } from '.'

declare global {
  interface Window { DocumentTouch: any; }
}

function isTouchDevice(): boolean {
  return !!(typeof window !== 'undefined' && ('ontouchstart' in window || window!.DocumentTouch && typeof document !== 'undefined' && document instanceof window!.DocumentTouch)) || !!(typeof navigator !== 'undefined' && (navigator.maxTouchPoints || navigator.msMaxTouchPoints))
}

const BUTTON_SIZE = 32

const BUTTON_STYLE = {
  outline: 'none',
  border: 0,
  boxSizing: 'border-box' as 'border-box',
  textAlign: 'center' as 'center',
  padding: 0,
  margin: 1,
  fontFamily: 'Verdana',
  fontSize: 24,
  lineHeight: BUTTON_SIZE - 2 + 'px',
  borderRadius: '5px',
  background: 'rgba(255, 255, 255, 0.6)',
  color: 'rgba(0, 0, 0, 0.8)',
  width: BUTTON_SIZE - 2,
  height: BUTTON_SIZE - 2,
  position: 'absolute' as 'absolute',
  userSelect: 'none' as 'none',
  MozUserSelect: 'none' as 'none',
  WebkitUserSelect: 'none' as 'none',
  WebkitTouchCallOut: 'none' as 'none'
}

const BIG_BUTTON_STYLE = {
  ...BUTTON_STYLE,
  fontSize: 40,
  lineHeight: BUTTON_SIZE * 1.5 - 2 + 'px',
  width: BUTTON_SIZE * 1.5 - 2,
  height: BUTTON_SIZE * 1.5 - 2
}

export interface TouchPadProps {
  onMouseDown: (dir: Direction | string) => void,
  onMouseUp: (dir: Direction | string) => void
}

export default function ({ onMouseDown, onMouseUp }: TouchPadProps) {
  if (!isTouchDevice()) {
    return null
  }

  return (
    <React.Fragment>
      <div style={{
        position: 'absolute',
        left: 8,
        bottom: 8
      }}>
        <div style={{
          position: 'relative',
          width: BUTTON_SIZE * 3,
          height: BUTTON_SIZE * 3
        }}>
          <button
            style={{
              ...BUTTON_STYLE,
              top: BUTTON_SIZE * 0,
              left: BUTTON_SIZE * 1
            }}
            onContextMenu={(e) => e.preventDefault()}
            onTouchStart={onMouseDown.bind(this, Direction.Up)}
            onTouchEnd={onMouseUp.bind(this, Direction.Up)}
          >
            ⇧
          </button>
          <button
            style={{
              ...BUTTON_STYLE,
              top: BUTTON_SIZE * 1,
              left: BUTTON_SIZE * 0
            }}
            onContextMenu={(e) => e.preventDefault()}
            onTouchStart={onMouseDown.bind(this, Direction.Left)}
            onTouchEnd={onMouseUp.bind(this, Direction.Left)}
          >
            ⇦
          </button>
          <button
            style={{
              ...BUTTON_STYLE,
              top: BUTTON_SIZE * 1,
              left: BUTTON_SIZE * 2
            }}
            onContextMenu={(e) => e.preventDefault()}
            onTouchStart={onMouseDown.bind(this, Direction.Right)}
            onTouchEnd={onMouseUp.bind(this, Direction.Right)}
          >
            ⇨
          </button>
          <button
            style={{
              ...BUTTON_STYLE,
              top: BUTTON_SIZE * 2,
              left: BUTTON_SIZE * 1
            }}
            onContextMenu={(e) => e.preventDefault()}
            onTouchStart={onMouseDown.bind(this, Direction.Down)}
            onTouchEnd={onMouseUp.bind(this, Direction.Down)}
          >
            ⇩
          </button>
        </div>
      </div>
      <div style={{
        position: 'absolute',
        right: 8,
        bottom: 8
      }}>
        <button
          style={{
            ...BIG_BUTTON_STYLE,
            position: 'static'
          }}
          onContextMenu={(e) => e.preventDefault()}
          onTouchStart={onMouseDown.bind(this, 'Enter')}
          onTouchEnd={onMouseUp.bind(this, 'Enter')}
        >
          ◎
        </button>
      </div>
    </React.Fragment>
  )
}
