import { useEffect, useState } from 'react'

/**
 * Live clock for a given IANA time zone, formatted HH:MM:SS (24h).
 * Used to show Budhi's local time in the nav and footer.
 */
export function useLocalTime(timeZone: string): string {
  const [time, setTime] = useState('')

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone,
    })

    const tick = () => setTime(formatter.format(new Date()))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [timeZone])

  return time
}
