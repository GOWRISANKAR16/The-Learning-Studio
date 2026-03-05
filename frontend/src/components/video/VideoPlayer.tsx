import { useEffect, useRef, useState } from 'react'
import YouTube, { type YouTubeEvent, type YouTubePlayer } from 'react-youtube'

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

  const videoId = new URL(youtubeUrl).searchParams.get('v') ?? ''

  const clearTimer = () => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const handleReady = (event: YouTubeEvent) => {
    playerRef.current = event.target
    if (startSeconds > 0) {
      event.target.seekTo(startSeconds, true)
    }
  }

  const handleStateChange = (event: YouTubeEvent) => {
    const state = event.data

    // playing
    if (state === 1) {
      clearTimer()
      if (onProgress) {
        intervalRef.current = window.setInterval(async () => {
          try {
            const current = await event.target.getCurrentTime()
            onProgress(current)
          } catch {
            // ignore polling errors
          }
        }, 5000)
      }
    }

    // paused or buffering
    if (state === 2 || state === 3) {
      clearTimer()
    }

    // ended
    if (state === 0) {
      clearTimer()
      if (onCompleted) onCompleted()
    }
  }

  useEffect(() => {
    return () => {
      clearTimer()
    }
  }, [])

  if (!videoId) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl bg-slate-100 text-sm text-slate-500">
        Video unavailable
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl bg-black">
      {error && (
        <div className="bg-red-600 px-3 py-2 text-xs text-white">
          {error} – try reloading the page.
        </div>
      )}
      <YouTube
        videoId={videoId}
        opts={{
          width: '100%',
          height: '360',
          playerVars: {
            autoplay: 0,
            start: Math.floor(startSeconds),
          },
        }}
        onReady={handleReady}
        onStateChange={handleStateChange}
        onError={() => setError('Video failed to load from YouTube')}
      />
    </div>
  )
}

