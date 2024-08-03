import { motion, SVGMotionProps } from 'framer-motion'

interface Props {
  children?: any
}

export type BaseIconProps = Props & SVGMotionProps<any>

export const BaseIcon = ({ children, ...props }: BaseIconProps) => {
  return (
    <motion.svg {...props}>
      {children}
    </motion.svg>
  )
}
