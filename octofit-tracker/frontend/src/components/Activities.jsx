import ResourceCollection from './ResourceCollection.jsx'
import { useCollection } from '../hooks/useCollection.js'

export default function Activities() {
  const { records, loading, error } = useCollection('/api/activities/', fetch)

  return (
    <ResourceCollection
      title="Activities"
      records={records}
      loading={loading}
      error={error}
    />
  )
}
