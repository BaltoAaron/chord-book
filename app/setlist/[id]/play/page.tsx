import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

interface PlaySetlistPageProps {
  params: { id: string }
}

export default async function PlaySetlistPage({ params }: PlaySetlistPageProps) {
  const supabase = createClient()

  const [setlistResult, setlistSongsResult] = await Promise.all([
    supabase
      .from('setlists')
      .select('*')
      .eq('id', params.id)
      .single(),
    supabase
      .from('setlist_songs')
      .select('*, song:songs(*)')
      .eq('setlist_id', params.id)
      .order('position'),
  ])

  if (setlistResult.error || !setlistResult.data) {
    notFound()
  }

  const setlist = setlistResult.data
  const songs = (setlistSongsResult.data || [])
    .map((ss: any) => ss.song)
    .sort((a: any, b: any) => {
      const artistCompare = a.artist.localeCompare(b.artist)
      if (artistCompare !== 0) return artistCompare
      return a.title.localeCompare(b.title)
    })

  // Build alphabet index - find first song for each letter
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
  const letterToSongId: Record<string, string> = {}

  for (const song of songs) {
    const firstLetter = song.artist.charAt(0).toUpperCase()
    if (!letterToSongId[firstLetter]) {
      letterToSongId[firstLetter] = song.id
    }
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{setlist.name}</title>
        <style dangerouslySetInnerHTML={{ __html: `
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          html {
            scroll-behavior: smooth;
          }
          body {
            background: #fff;
            color: #111;
            font-family: system-ui, -apple-system, sans-serif;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
          }
          .back-link {
            display: inline-block;
            margin-bottom: 20px;
            color: #666;
            text-decoration: none;
          }
          .back-link:hover {
            color: #111;
          }
          .alphabet {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid #ddd;
          }
          .alphabet a {
            color: #0066cc;
            text-decoration: none;
            font-weight: 600;
            font-size: 16px;
          }
          .alphabet a:hover {
            text-decoration: underline;
          }
          .alphabet span {
            color: #ccc;
            font-size: 16px;
          }
          .song-index {
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 1px solid #ddd;
          }
          .song-index-item {
            margin-bottom: 4px;
          }
          .song-index-item a {
            color: #111;
            text-decoration: none;
          }
          .song-index-item a:hover {
            text-decoration: underline;
          }
          .song-content {
            margin-bottom: 50px;
            padding-top: 10px;
          }
          .song-header {
            font-weight: 600;
            font-size: 18px;
            margin-bottom: 16px;
          }
          .song-chords {
            font-family: 'Courier New', Courier, monospace;
            font-size: 16px;
            line-height: 1.6;
            white-space: pre-wrap;
            color: #333;
          }
          .empty {
            color: #666;
            font-style: italic;
          }
        `}} />
      </head>
      <body>
        <a href={`/setlist/${params.id}`} className="back-link">&larr; Back to Edit</a>

        {songs.length === 0 ? (
          <p className="empty">No songs in this setlist</p>
        ) : (
          <>
            {/* Section 1: Alphabet Header */}
            <div className="alphabet">
              {alphabet.map((letter) => (
                letterToSongId[letter] ? (
                  <a key={letter} href={`#letter-${letter}`}>{letter}</a>
                ) : (
                  <span key={letter}>{letter}</span>
                )
              ))}
            </div>

            {/* Section 2: Song Index */}
            <div className="song-index">
              {songs.map((song: any) => (
                <div key={song.id} className="song-index-item">
                  <a href={`#song-${song.id}`}>{song.artist} - {song.title}</a>
                </div>
              ))}
            </div>

            {/* Section 3: Song Contents */}
            {songs.map((song: any, index: number) => {
              const firstLetter = song.artist.charAt(0).toUpperCase()
              const isFirstForLetter = letterToSongId[firstLetter] === song.id

              return (
                <div
                  key={song.id}
                  id={`song-${song.id}`}
                  className="song-content"
                >
                  {isFirstForLetter && <div id={`letter-${firstLetter}`} />}
                  <div className="song-header">
                    {song.artist} - {song.title}
                  </div>
                  <div className="song-chords">{song.chords}</div>
                </div>
              )
            })}
          </>
        )}
      </body>
    </html>
  )
}
