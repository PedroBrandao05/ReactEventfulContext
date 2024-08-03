import { HumanIcon } from '@/shared/icons/human'
import * as S from '../styled'
import { OrganClassNames } from '..'
import { useEffect } from 'react'
import { useAnatomyEvents } from '@/shared/events/anatomy-event-context'
import { ZoomedInEvent } from '@/shared/molecules/zoom'

export const Human = () => {
  const { addEventListener } = useAnatomyEvents()

  useEffect(() => {
    addEventListener<ZoomedInEvent>(
      'zoomedIn',
      () => { },
      {
        repeatable: true,
        unique: false,
        callbackConfig: {
          conditionSatistied: (data) => { return (data.scale >= 8 && data.origin === OrganClassNames.HUMAN) },
          triggersEvent: 'show-brain'
        }
      }
    )
  }, [])

  return (
    <S.OrganContainer className={OrganClassNames.HUMAN} zIndex={1}>
      <HumanIcon />
    </S.OrganContainer>
  )
}
