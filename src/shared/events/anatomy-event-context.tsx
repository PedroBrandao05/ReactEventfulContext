import { createContext, useContext } from 'react'
import { IEventfulContext, useEventfulContext } from './use-eventful-context'

export type AnatomyEvents = 'zoomedIn' 
  | 'zoomedOut' 
  | 'drag-move' 
  | 'show-brain' 
  | 'show-heart'
  | 'show-liver'
  | 'hide-brain'
  | 'hide-liver'
  | 'hide-heart'

const AnatomyEventContext = createContext<IEventfulContext<AnatomyEvents>>({} as IEventfulContext<AnatomyEvents>)

interface Props {
  children: any
}

export const AnatomyEventContextProvider = ({ children }: Props) => {
  const value = useEventfulContext<AnatomyEvents>()

  return (
    <AnatomyEventContext.Provider value={{ ...value }}>
      {children}
    </AnatomyEventContext.Provider>
  )
}

export const useAnatomyEvents = () => {
  const total = useContext(AnatomyEventContext)

  return total
}