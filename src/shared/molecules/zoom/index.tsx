import React, { useEffect, useRef, useState } from 'react'
import * as S from './styled'
import { useAnatomyEvents } from '@/shared/events/anatomy-event-context'
import { OrganClassNames } from '@/anatomy'

interface Props {
  children: any

  childrenClassName: OrganClassNames

  zIndex: number
}

export type TransformXY = { x: number, y: number }

export type TouchPosition = { x: number, y: number }[]

export type ZoomedInEvent = {
  scale: number

  transformXY: TransformXY

  origin: OrganClassNames
}

export type ZoomedOutEvent = {
  scale: number

  transformXY: TransformXY

  origin: string
}

export type DragMoveEvent = {
  scale: number

  transformXY: TransformXY

  origin: string
}

const Zoom = ({ children, childrenClassName, zIndex }: Props) => {
  const [scale, setScale] = useState(1)
  const [transformXY, setTransformXY] = useState<TransformXY>({ x: 0, y: 0 })
  const [clicking, setClicking] = useState(false)
  const [touchPosition, setTouchPosition] = useState<TouchPosition | null>(null)
  const [isZoomed, setIsZoomed] = useState(false)

  const { triggerEvent } = useAnatomyEvents()

  const ref = useRef<HTMLDivElement>(null)
  const lastClickTime = useRef(0)
  const doubleClickThreshold = 300

  const isMobile = window.innerWidth <= 600

  const handleZoomInDirection = (x: number, y: number, isDoubleClick?: boolean) => {
    x = (window.innerWidth - (x * 1.6)) / ((scale + 0.5) * (isDoubleClick ? 1 : 7))
    y = (window.innerHeight - (y * 1.6)) / ((scale + 0.5) * (isDoubleClick ? 1 : 5))

    if (isMobile) {
      x = x / 5

      y = y / 5
    }

    
    setTransformXY(old => ({ x: old.x + x, y: old.y + y }))

    setTimeout(() => {
      triggerEvent<ZoomedInEvent>('zoomedIn', { scale, transformXY, origin: childrenClassName })
    }, 100)
  }

  const handleZoomOutDirection = () => {
    const increasementX = 50 / (isMobile ? scale + 10 : scale)
    const increasementY = 40 / (isMobile ? scale + 10 : scale)

    const x = transformXY.x < 0 ? transformXY.x + increasementX : transformXY.x - increasementX
    const y = transformXY.y < 0 ? transformXY.y + increasementY : transformXY.y - increasementY

    setTransformXY({ x, y })

    setTimeout(() => {
      triggerEvent<ZoomedOutEvent>('zoomedOut', { scale, transformXY, origin: childrenClassName })
    }, 100)
  }

  const onScroll = (evt: React.WheelEvent) => {
    if (isMobile) return

    const isZoomingIn = evt.deltaY < 0
    const increasement = isMobile ? 0.2 : 0.5

    if (isZoomingIn) {
      setScale(old => old + increasement)
      handleZoomInDirection(evt.clientX, evt.clientY)

      return
    }

    setScale(old => Math.max(old - increasement, 1))
    handleZoomOutDirection()
  }

  const onDoubleClick = (evt: React.MouseEvent) => {
    if (isZoomed) {
      setIsZoomed(false)
      setScale(1)
      setTransformXY({ x: 0, y: 0 })

      setTimeout(() => {
        triggerEvent<ZoomedOutEvent>('zoomedOut', { scale, transformXY, origin: childrenClassName })
      }, 100)

      return
    }
    setIsZoomed(true)
    setScale(3.5)

    handleZoomInDirection(evt.clientX, evt.clientY, true)
  }

  const onMouseMove = (evt: React.MouseEvent) => {
    if (touchPosition) return

    if (evt.buttons !== 1 || !isZoomed) {
      setClicking(false)

      return
    }

    const movementX = isMobile ? evt.movementX / 4 : evt.movementX
    const movementY = isMobile ? evt.movementY / 4 : evt.movementY

    setTransformXY(old => ({ x: old.x + movementX, y: old.y + movementY }))
    setClicking(true)

    setTimeout(() => {
      triggerEvent<DragMoveEvent>('drag-move', { scale, transformXY, origin: childrenClassName })
    }, 100)
  }

  const onTouchStart = (evt: React.TouchEvent) => {
    const currentTime = new Date().getTime()
    const timeDifference = currentTime - lastClickTime.current

    if (timeDifference < doubleClickThreshold) {
      if (isZoomed) {
        setScale(1)
        setTransformXY({ x: 0, y: 0 })

        setTimeout(() => {
          triggerEvent<ZoomedOutEvent>('zoomedOut', { scale, transformXY, origin: childrenClassName })
        }, 100)
      }

      if (!isZoomed) {
        setScale(3.5)
        handleZoomInDirection(evt.touches[0].clientX / 2, evt.touches[0].clientY / 2, true)
      }
    }

    lastClickTime.current = currentTime

    if (evt.touches.length !== 2) return

    const finger1 = evt.touches[0]
    const finger2 = evt.touches[1]

    setTouchPosition([{ x: finger1.clientX, y: finger1.clientY }, { x: finger2.clientX, y: finger2.clientY }])
  }

  const onTouchMove = (evt: React.TouchEvent) => {
    if (!touchPosition) return

    const initialDistance = Math.hypot(touchPosition[0].x - touchPosition[1].x, touchPosition[0].y - touchPosition[1].y)
    const movementDistance = Math.hypot(evt.touches[0].clientX - evt.touches[1].clientX, evt.touches[0].clientY - evt.touches[1].clientY)

    const isZoomingIn = initialDistance < movementDistance

    const increasement = isMobile ? 0.2 : 0.5

    const middlePoint = { x: (evt.touches[0].clientX + evt.touches[1].clientX) / 2, y: (evt.touches[0].clientY + evt.touches[1].clientY) / 2 }

    if (isZoomingIn) {
      setScale(old => old + increasement)
      handleZoomInDirection(middlePoint.x, middlePoint.y)

      return
    }

    setScale(old => Math.max(old - increasement, 1))
    handleZoomOutDirection()
  }

  const onTouchEnd = () => {
    setTouchPosition(null)
  }

  useEffect(() => {
    if (scale > 1 && isZoomed) return

    if (scale !== 1 && !isZoomed) {
      setIsZoomed(true)

      return
    }

    if (scale === 1 && !isZoomed) return

    setIsZoomed(false)
  }, [scale])

  return (
    <S.ZoomContainer
      ref={ref}
      onWheel={onScroll}
      onDoubleClick={onDoubleClick}
      onPointerMove={onMouseMove}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      scale={scale}
      transformXY={transformXY}
      childrenClassName={childrenClassName}
      clicking={clicking}
      style={{ zIndex }}
    >
      {children}
    </S.ZoomContainer>
  )
}

export default Zoom