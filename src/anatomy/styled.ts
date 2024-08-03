import styled from 'styled-components'
import { motion } from 'framer-motion'

export const Organ = styled.img`
  object-fit: cover;
  height: 100%;
`

export const OrganContainer = styled(motion.div)<{ zIndex: number }>`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 2rem;

  position: absolute;
  z-index: ${props => props.zIndex};
  top: 0;
  left: 0;
`

export const BackgroundWrapper = styled.div`
  background-color: #000;
  width: 100vw;
  height: 100dvh;
  padding: 2rem;

  display: flex;
  justify-content: center;
  align-items: center;

  position: absolute;
  top: 0;
  left: 0;
`