export interface Song {
  id: string
  user_id: string
  artist: string
  title: string
  chords: string
  created_at: string
  updated_at: string
}

export interface Setlist {
  id: string
  user_id: string
  name: string
  created_at: string
  updated_at: string
}

export interface SetlistSong {
  id: string
  setlist_id: string
  song_id: string
  position: number
  song?: Song
}

export interface SetlistWithSongs extends Setlist {
  songs: (SetlistSong & { song: Song })[]
}
