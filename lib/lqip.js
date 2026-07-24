import pMap from 'p-map'

/**
 * Fallback LQIP without sharp (for local dev preview only).
 * Returns a tiny 1x1 transparent placeholder so pages can render
 * when the native sharp module is unavailable.
 */
export default async function lqipModern(input, opts = {}) {
  const { concurrency = 4 } = opts

  if (Array.isArray(input)) {
    return pMap(input, async () => fallbackResult(), { concurrency })
  }
  return fallbackResult()
}

function fallbackResult() {
  return {
    content: Buffer.from(
      'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      'base64'
    ),
    metadata: {
      originalWidth: 1,
      originalHeight: 1,
      width: 1,
      height: 1,
      type: 'gif',
      dataURIBase64:
        'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
    }
  }
}
