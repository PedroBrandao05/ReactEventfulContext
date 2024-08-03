import { LiverIcon } from '@/shared/icons/liver'
import * as S from '../styled'
import { OrganClassNames } from '..'

export const Liver = () => {
  return (
    <S.OrganContainer className={OrganClassNames.LIVER} zIndex={2}>
      <LiverIcon />
    </S.OrganContainer>
  )
}
