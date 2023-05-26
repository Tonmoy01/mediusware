import { useLayoutEffect, useRef } from 'react'

export default (cb) => {
  const ref = useRef(false)
  useLayoutEffect(() => {
    if (ref.current) return
    ref.current = true
    cb()
  }, [])
}
