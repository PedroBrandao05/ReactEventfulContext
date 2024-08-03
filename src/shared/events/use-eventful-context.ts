import { useState } from 'react'

export type Listener<TData = any> = (data: TData) => void

export interface IEventfulContext<T = string> {
  triggerEvent: <TData = any>(event: T, data?: TData) => void

  addEventListener: <TData = any>(event: T, listen: Listener<TData>, config?: Omit<AppEventListener<T, TData>, 'event' | 'listen'>) => void

  eventListeners: AppEventListener<T, any>[]
}

export type AppEventListener<T = string, TData = any> = { 
  event: T, 
  listen: Listener<TData>,
  unique: boolean,
  repeatable: boolean,
  callbackConfig?: {
    triggersEvent: T,
    conditionSatistied: (data: TData) => boolean
  }
}

export const useEventfulContext = <T = string>(): IEventfulContext<T> => {
  const [eventListeners, setEventListeners] = useState<AppEventListener<T, any>[]>([])

  const triggerEvent = <TData = any>(event: T, data: TData = {} as TData) => {
    const nonRepeatableEventsIndexes: number[] = []

    for (const { listener, index } of eventListeners.map((listener, index) => ({ listener, index })).filter(({ listener }) => listener.event === event)) {
      listener.listen(data)

      if (listener.callbackConfig && listener.callbackConfig.conditionSatistied(data)) {
        triggerEvent(listener.callbackConfig.triggersEvent)
      }

      if (listener.repeatable) return

      nonRepeatableEventsIndexes.push(index)
    }

    setEventListeners(old => [...old.filter((_, index) => !nonRepeatableEventsIndexes.some(i => i === index))])
  }

  const addEventListener = <TData = any>(event: T, listen: Listener<TData>, config?: Omit<AppEventListener<T, TData>, 'event' | 'listen'>) => {
    const configToUse = config ?? { repeatable: true, unique: false }

    const alreadySettedEvent = eventListeners.some(listener => `${listener.event}` === `${event}` && configToUse.unique)

    if (alreadySettedEvent) {
      setEventListeners(old => old.map(listener => {
        if (listener.event === event) {
          return { event, listen, ...configToUse }
        }

        return listener
      }))

      return
    }
    
    setEventListeners(old => [...old, { event, listen, ...configToUse }])
  }

  return {
    triggerEvent,
    addEventListener,
    eventListeners
  }
}