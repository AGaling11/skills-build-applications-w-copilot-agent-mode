import ResourceCollection from './ResourceCollection.jsx'
import { useCollection } from '../hooks/useCollection.js'

export default function Leaderboard() {
  const { records, loading, error } = useCollection('/api/leaderboard/', fetch)

  return (
    <ResourceCollection
      title="Leaderboard"
      records={records}
      loading={loading}
      error={error}
    />
  )
}
