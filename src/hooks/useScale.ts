import { useLayoutEffect } from 'react'

const APP_HEIGHT = 712

export const useScale = (containerRef: React.RefObject<HTMLDivElement>) => {
  useLayoutEffect(() => {
    const scale = () => {
      const windowHeight = window.innerHeight
      const value = (windowHeight * 0.9) / APP_HEIGHT

      if (value > 1) {
        containerRef.current!.style.transform = `scale(${value})`
      }
    }

    scale()
    window.addEventListener('resize', scale)
    return () => window.removeEventListener('resize', scale)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
