import { useEffect, useState } from 'react'
import { fetchCollection } from '../api.js'

export function useCollection(endpoint, fetchImpl = fetch) {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadRecords() {
      setLoading(true)
      setError('')

      try {
        const data = await fetchCollection(endpoint, (url) =>
          fetchImpl(url, { signal: controller.signal }),
        )
        setRecords(data)
      } catch (requestError) {
        if (!controller.signal.aborted) {
          setError(requestError instanceof Error ? requestError.message : 'Unable to load data.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadRecords()
    return () => controller.abort()
  }, [endpoint, fetchImpl])

  return { records, loading, error }
}
