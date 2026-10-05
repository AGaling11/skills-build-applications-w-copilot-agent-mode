export default function ResourceCollection({ title, records, loading, error }) {
  return (
    <main className="container py-5">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="mb-0">{title}</h1>
        {!loading && !error && (
          <span className="badge text-bg-secondary">
            {records.length} {records.length === 1 ? 'record' : 'records'}
          </span>
        )}
      </div>

      {loading && <p role="status">Loading {title.toLowerCase()}...</p>}
      {error && (
        <div className="alert alert-danger" role="alert">
          Unable to load {title.toLowerCase()}: {error}
        </div>
      )}
      {!loading && !error && records.length === 0 && (
        <p className="text-body-secondary">No {title.toLowerCase()} found.</p>
      )}
      {!loading && !error && records.length > 0 && (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
          {records.map((record, index) => (
            <div className="col" key={record._id ?? record.id ?? index}>
              <article className="card h-100">
                <div className="card-body">
                  <dl className="row mb-0">
                    {Object.entries(record)
                      .filter(([key]) => !['_id', '__v', 'passwordHash'].includes(key))
                      .map(([key, value]) => (
                        <div className="col-12 mb-2" key={key}>
                          <dt className="small text-body-secondary text-capitalize">
                            {key.replace(/([A-Z])/g, ' $1')}
                          </dt>
                          <dd className="mb-0">
                            {value && typeof value === 'object'
                              ? JSON.stringify(value)
                              : String(value ?? '—')}
                          </dd>
                        </div>
                      ))}
                  </dl>
                </div>
              </article>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
