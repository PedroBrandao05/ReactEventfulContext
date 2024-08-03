import Zoom from '@/shared/molecules/zoom'
import { Human } from './human'
import * as S from './styled'
import { useEffect, useState } from 'react'
import { Brain } from './brain'
import { Heart } from './heart'
import { Liver } from './liver'
import { useAnatomyEvents } from '@/shared/events/anatomy-event-context'

export enum OrganClassNames {
  HEART = 'heart',

  BRAIN = 'brain',

  LIVER = 'liver',

  HUMAN = 'human'
}

const Anatomy = () => {
  const [showBrain, setShowBrain] = useState(false)
  const [showHeart, setShowHeart] = useState(false)
  const [showLiver, setShowLiver] = useState(false)

  const { addEventListener } = useAnatomyEvents()

  useEffect(() => {
    addEventListener('show-brain', () => { setShowBrain(true) }, { repeatable: true, unique: true })
    addEventListener('show-heart', () => { setShowHeart(true) }, { repeatable: true, unique: true })
    addEventListener('show-liver', () => { setShowLiver(true) }, { repeatable: true, unique: true })
    addEventListener('hide-brain', () => { setShowBrain(false) }, { repeatable: true, unique: true })
    addEventListener('hide-heart', () => { setShowHeart(false) }, { repeatable: true, unique: true })
    addEventListener('hide-liver', () => { setShowLiver(false) }, { repeatable: true, unique: true })
  }, [])

  return (
    <S.BackgroundWrapper>
      <Zoom zIndex={1} childrenClassName={OrganClassNames.HUMAN}>
        <Human />
      </Zoom>
      {showBrain && 
        <Zoom zIndex={2} childrenClassName={OrganClassNames.BRAIN}>
          <Brain />
        </Zoom>
      }
      {showHeart && 
        <Zoom zIndex={2} childrenClassName={OrganClassNames.HEART}>
          <Heart />
        </Zoom>
      }
      {showLiver && 
        <Zoom zIndex={2} childrenClassName={OrganClassNames.LIVER}>
          <Liver />
        </Zoom>
      }
    </S.BackgroundWrapper>
  )
}

export default Anatomy