const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()

export const API_BASE_URL = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000'

export function getCollectionRecords(payload) {
  if (Array.isArray(payload)) {
    return payload
  }

  if (payload && typeof payload === 'object') {
    for (const key of ['results', 'items', 'content']) {
      if (Array.isArray(payload[key])) {
        return payload[key]
      }
    }

    if (Array.isArray(payload.data)) {
      return payload.data
    }

    if (payload.data && typeof payload.data === 'object') {
      for (const key of ['results', 'items', 'content']) {
        if (Array.isArray(payload.data[key])) {
          return payload.data[key]
        }
      }
    }
  }

  throw new Error('The API returned an unsupported collection response.')
}

export async function fetchCollection(endpoint, fetchImpl = fetch) {
  const response = await fetchImpl(`${API_BASE_URL}${endpoint}`)
  if (!response.ok) {
    throw new Error(`API request failed (${response.status} ${response.statusText}).`)
  }

  return getCollectionRecords(await response.json())
}
