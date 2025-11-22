/**
 * Browse all icons at: https://react-icons.github.io/react-icons/
 */

import { FaGoogle } from 'react-icons/fa'
import { SiLeetcode } from 'react-icons/si'
import type { IconBaseProps } from 'react-icons'

export const Icons = {
  google: FaGoogle,
  leetcode: SiLeetcode,
}

export type Icon = typeof Icons[keyof typeof Icons]
export type { IconBaseProps }
