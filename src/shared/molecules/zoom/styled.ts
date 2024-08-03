import styled, { css } from 'styled-components'
import { TransformXY } from '.'

export const ZoomContainer = styled.div<{
  childrenClassName: string
  scale: number
  transformXY: TransformXY
  clicking: boolean
}>`
  transition: all 150ms ease;
  cursor: ${props => props.clicking ? 'grabbing' : 'grab'};
  width: 100%;
  height: 100%;

  ${props => props.scale > 1 && css`
    position: absolute;
    z-index: 2;

    width: 100%;
    height: 100%;

    @media (max-width: 600px) {
      width: 100%;
    }
  `}

  ${props => `.${props.childrenClassName}`} {
    scale: ${props => props.scale};
    transition: all .1s ease;

    ${props => props.scale > 1 && css<{ transformXY: TransformXY }>`
      position: absolute;
      z-index: 1;
      transform: ${props => `translate3d(${props.transformXY.x}px, ${props.transformXY.y}px, 0)`};
    `}
  }
`