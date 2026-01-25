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
  const setlistSongs = setlistSongsResult.data || []

  // Conditionally sort: alphabetically if setting enabled, otherwise keep position order
  const songs = setlist.settings?.alphabetical_order
    ? setlistSongs
        .map((ss: any) => ss.song)
        .sort((a: any, b: any) => {
          const artistCompare = a.artist.localeCompare(b.artist)
          if (artistCompare !== 0) return artistCompare
          return a.title.localeCompare(b.title)
        })
    : setlistSongs.map((ss: any) => ss.song)  // Already ordered by position from query

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
        <title>{setlist.name}</title>
        <style dangerouslySetInnerHTML={{ __html: `
          body {
            font-family: 'Courier';
            font-size: 22px;
          }
          h2 {font-family: 'Courier';font-size: 50px;}
          #content {
            padding-left: 50px;
          }
          a:link {
            color: #000000;
            background-color: transparent;
            text-decoration: none;
          }

          a:visited {
            color: #000000;
            background-color: transparent;
            text-decoration: none;
          }
        `}} />

      </head>
      <body>
      <div id="content">
      <pre>
        <a href={`/setlist/${params.id}`} className="back-link">&larr; Back to Edit</a> 
        <br></br><br></br>

        {/* Section 1: Alphabet Header or Ordered Setlist label */}
        {setlist.settings?.alphabetical_order ? (
          <>
            <b>Set: {`${setlist.name} (Alphabetical)`}</b>
            <br></br><br></br>
            <a href="#toca">A</a>  <a href="#tocb">B</a>  <a href="#tocc">C</a>  <a href="#tocd">D</a>  <a href="#toce">E</a>  <a href="#tocf">F</a>  <a href="#tocg">G</a>  <a href="#toch">H</a>  <a href="#toci">I</a>  <a href="#tocj">J</a>  <a href="#tock">K</a>  <a href="#tocl">L</a>  <a href="#tocm">M</a>  <a href="#tocn">N</a>  <a href="#toco">O</a>  <a href="#tocp">P</a>  <a href="#tocq">Q</a>  <a href="#tocr">R</a>  <a href="#tocs">S</a>  <a href="#toct">T</a>  <a href="#tocu">U</a>  <a href="#tocv">V</a>  <a href="#tocw">W</a>  <a href="#tocx">X</a>  <a href="#tocy">Y</a>  <a href="#tocz">Z</a>
          </>
        ) : (
          <b>Set: {`${setlist.name} (Ordered)`}</b>
        )}
        <br></br><br></br><br></br>

        {/* Section 2: Song Index */}
        {songs.map((song: any) => {
          const firstLetter = song.artist.charAt(0).toUpperCase()
          const isFirstForLetter = letterToSongId[firstLetter] === song.id

          return (
            <div key={song.id} id={`toc${song.artist.charAt(0).toLowerCase()}`} className="song-index-item">
              <a href={`#song-${song.id}`}>{song.artist.padEnd(22, ' ')}- {song.title}</a>
            </div>
          )
        })}
        <br></br><br></br><br></br>

        {/* Section 2: Song Index */}
        {songs.map((song: any) => (
          <div
            key={song.id}
            id={`song-${song.id}`}
            className="song-content"
          >
            <div className="song-header">
              <b>{song.artist} - {song.title}</b>
            </div>
            <a href="#">top</a>
            <br></br>
            <div className="song-chords">{song.chords}</div>
            <br></br><br></br>
          </div>
        ))}


      </pre>      
      </div>
      </body>
    </html>
  )
}
