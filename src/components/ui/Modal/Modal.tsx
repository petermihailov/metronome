import { memo } from 'react'
import { createPortal } from 'react-dom'

import { getModalContainer } from '../../../utils/page'

export interface ModalProps {
  children: React.ReactNode
}

const Modal = ({ children }: ModalProps) => {
  return createPortal(children, getModalContainer())
}

export default memo(Modal)
