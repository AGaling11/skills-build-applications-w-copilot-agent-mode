import ResourceCollection from './ResourceCollection.jsx'
import { useCollection } from '../hooks/useCollection.js'

export default function Teams() {
  const { records, loading, error } = useCollection('/api/teams/', fetch)

  return (
    <ResourceCollection
      title="Teams"
      records={records}
      loading={loading}
      error={error}
    />
  )
}
