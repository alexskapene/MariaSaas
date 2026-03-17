'use client'

import { useEffect, useState } from 'react'

export default function AnimatedCounter({ value, duration = 500 }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0

    const increment = value / (duration / 16)

    const timer = setInterval(() => {
      start += increment

      if (start >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [value, duration])

  return <span>{count}</span>
}
