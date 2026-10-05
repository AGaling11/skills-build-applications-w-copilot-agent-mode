import ResourceCollection from './ResourceCollection.jsx'
import { useCollection } from '../hooks/useCollection.js'

export default function Workouts() {
  const { records, loading, error } = useCollection('/api/workouts/', fetch)

  return (
    <ResourceCollection
      title="Workouts"
      records={records}
      loading={loading}
      error={error}
    />
  )
}
