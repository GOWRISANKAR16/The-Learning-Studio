import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import YouTube, { type YouTubeEvent, type YouTubePlayer } from 'react-youtube'

/** Safely get YouTube video ID from watch or youtu.be URL. Never throws. */
function getVideoId(youtubeUrl: string): string {
  if (!youtubeUrl || typeof youtubeUrl !== 'string') return ''
  try {
    const url = new URL(youtubeUrl.trim())
    if (url.hostname === 'youtu.be') {
      const id = url.pathname.slice(1).split('/')[0]
      return id || ''
    }
    if (url.hostname === 'www.youtube.com' || url.hostname === 'youtube.com') {
      return url.searchParams.get('v') ?? ''
    }
    return ''
  } catch {
    return ''
  }
}

const PLAYER_HEIGHT = 360
const PLAYER_WIDTH = '100%'

type Props = {
  youtubeUrl: string
  startSeconds?: number
  onProgress?: (seconds: number) => void
  onCompleted?: () => void
}

export function VideoPlayer({
  youtubeUrl,
  startSeconds = 0,
  onProgress,
  onCompleted,
}: Props) {
  const playerRef = useRef<YouTubePlayer | null>(null)
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<number | null>(null)
  const onProgressRef = useRef(onProgress)
  const onCompletedRef = useRef(onCompleted)
  onProgressRef.current = onProgress
  onCompletedRef.current = onCompleted

  const videoId = getVideoId(youtubeUrl)

  const opts = useMemo(
    () => ({
      width: PLAYER_WIDTH,
      height: String(PLAYER_HEIGHT),
      playerVars: {
        autoplay: 0,
        start: Math.floor(startSeconds),
      },
    }),
    [startSeconds],
  )

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const handleReady = useCallback((event: YouTubeEvent) => {
    try {
      playerRef.current = event.target
      if (startSeconds > 0 && event.target?.seekTo) {
        event.target.seekTo(startSeconds, true)
      }
    } catch (e) {
      console.warn('YouTube player ready handler:', e)
    }
  }, [startSeconds])

  const handleStateChange = useCallback((event: YouTubeEvent) => {
    try {
      const state = event.data
      if (event.target) playerRef.current = event.target

      if (state === 1) {
        clearTimer()
        if (onProgressRef.current) {
          intervalRef.current = window.setInterval(() => {
            const player = playerRef.current
            if (!player?.getCurrentTime) return
            player.getCurrentTime().then((current: number) => {
              onProgressRef.current?.(current)
            }).catch(() => {})
          }, 5000)
        }
      }
      if (state === 2 || state === 3) clearTimer()
      if (state === 0) {
        clearTimer()
        onCompletedRef.current?.()
      }
    } catch (e) {
      console.warn('YouTube state change:', e)
    }
  }, [clearTimer])

  const handleError = useCallback(() => {
    setError('Video failed to load from YouTube')
  }, [])

  useEffect(() => {
    return () => {
      clearTimer()
      playerRef.current = null
    }
  }, [clearTimer])

  if (!videoId) {
    return (
      <div
        className="flex h-64 items-center justify-center rounded-xl bg-slate-100 text-sm text-slate-500"
        style={{ minHeight: PLAYER_HEIGHT }}
      >
        Video unavailable
      </div>
    )
  }

  return (
    <div
      className="overflow-hidden rounded-xl bg-black"
      style={{ minHeight: PLAYER_HEIGHT }}
    >
      {error && (
        <div className="bg-red-600 px-3 py-2 text-xs text-white">
          {error} – try reloading the page.
        </div>
      )}
      <YouTube
        key={videoId}
        videoId={videoId}
        opts={opts}
        onReady={handleReady}
        onStateChange={handleStateChange}
        onError={handleError}
      />
    </div>
  )
}

