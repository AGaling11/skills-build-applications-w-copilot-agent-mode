import ResourceCollection from './ResourceCollection.jsx'
import { useCollection } from '../hooks/useCollection.js'

export default function Users() {
  const { records, loading, error } = useCollection('/api/users/', fetch)

  return (
    <ResourceCollection
      title="Users"
      records={records}
      loading={loading}
      error={error}
    />
  )
}
