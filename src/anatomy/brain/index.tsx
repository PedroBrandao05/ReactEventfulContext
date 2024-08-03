import { BrainIcon } from '@/shared/icons/brain'
import * as S from '../styled'
import { OrganClassNames } from '..'
import { useEffect } from 'react'
import { useAnatomyEvents } from '@/shared/events/anatomy-event-context'
import { ZoomedOutEvent } from '@/shared/molecules/zoom'

export const Brain = () => {
  const { addEventListener, triggerEvent } = useAnatomyEvents()

  useEffect(() => {
    addEventListener<ZoomedOutEvent>('zoomedOut', (event) => {
      if (event.origin !== OrganClassNames.BRAIN || event.scale > 1) return

      triggerEvent('hide-brain')
    })
  }, [])

  return (
    <S.OrganContainer className={OrganClassNames.BRAIN} zIndex={2}>
      <BrainIcon width={'45rem'} height={'45rem'} />
    </S.OrganContainer>
  )
}
