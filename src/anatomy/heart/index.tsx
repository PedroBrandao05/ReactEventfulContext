import { HeartIcon } from '@/shared/icons/heart'
import * as S from '../styled'
import { OrganClassNames } from '..'

export const Heart = () => {
  return (
    <S.OrganContainer className={OrganClassNames.HEART} zIndex={2}>
      <HeartIcon />
    </S.OrganContainer>
  )
}
