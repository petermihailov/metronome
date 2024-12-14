import { useLayoutEffect } from 'react'

const APP_HEIGHT = 695

export const useScale = (containerRef: React.RefObject<HTMLDivElement>) => {
  useLayoutEffect(() => {
    const scale = () => {
      const windowHeight = window.innerHeight

      containerRef.current!.style.transform = `scale(${(windowHeight * 0.9) / APP_HEIGHT})`
    }

    scale()
    window.addEventListener('resize', scale)
    return () => window.removeEventListener('resize', scale)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
