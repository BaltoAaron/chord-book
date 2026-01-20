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
  const songs = (setlistSongsResult.data || []).map((ss: any) => ss.song)

  // Serialize songs for client-side JS
  const songsJson = JSON.stringify(songs)

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <title>{setlist.name} - Gig View</title>
        <style dangerouslySetInnerHTML={{ __html: `
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          html, body {
            height: 100%;
            overflow: hidden;
            background: #f3f4f6;
            color: #111827;
            font-family: system-ui, -apple-system, sans-serif;
          }
          .container {
            display: flex;
            height: 100vh;
            width: 100vw;
          }
          .sidebar {
            width: 200px;
            background: #fff;
            border-right: 1px solid #e5e7eb;
            overflow-y: auto;
            flex-shrink: 0;
          }
          .back-link {
            display: block;
            padding: 12px 16px;
            color: #6b7280;
            text-decoration: none;
            border-bottom: 1px solid #e5e7eb;
            font-size: 14px;
          }
          .back-link:hover {
            color: #111827;
            background: #f9fafb;
          }
          .song-list {
            list-style: none;
          }
          .song-item {
            padding: 12px 16px;
            cursor: pointer;
            border-bottom: 1px solid #f3f4f6;
            transition: background 0.15s;
          }
          .song-item:hover {
            background: #f9fafb;
          }
          .song-item.active {
            background: #dbeafe;
            border-left: 3px solid #3b82f6;
          }
          .song-number {
            color: #9ca3af;
            font-size: 12px;
            font-family: monospace;
          }
          .song-title {
            font-weight: 600;
            font-size: 14px;
            margin-top: 2px;
            color: #111827;
          }
          .song-artist {
            color: #6b7280;
            font-size: 12px;
          }
          .main {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }
          .header {
            padding: 16px 24px;
            border-bottom: 1px solid #e5e7eb;
            background: #fff;
          }
          .header-title {
            font-size: 24px;
            font-weight: 700;
            color: #111827;
          }
          .header-artist {
            color: #6b7280;
            font-size: 16px;
          }
          .chords {
            flex: 1;
            padding: 24px;
            overflow: auto;
            font-family: 'Courier New', Courier, monospace;
            font-size: 18px;
            line-height: 1.6;
            white-space: pre-wrap;
            color: #374151;
            background: #fff;
          }
          .nav-hint {
            padding: 12px 24px;
            background: #fff;
            border-top: 1px solid #e5e7eb;
            color: #9ca3af;
            font-size: 12px;
            text-align: center;
          }
          .empty {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: #9ca3af;
            font-size: 18px;
          }
          @media (max-width: 640px) {
            .sidebar {
              width: 70px;
            }
            .song-title, .song-artist, .back-link span {
              display: none;
            }
            .song-number {
              font-size: 16px;
              font-weight: 600;
            }
            .song-item {
              text-align: center;
            }
            .chords {
              font-size: 14px;
              padding: 16px;
            }
            .header {
              padding: 12px 16px;
            }
            .header-title {
              font-size: 18px;
            }
            .header-artist {
              font-size: 14px;
            }
            .nav-hint {
              display: none;
            }
          }
        `}} />
      </head>
      <body>
        <div className="container">
          <nav className="sidebar">
            <a href={`/setlist/${params.id}`} className="back-link">
              &larr; <span>Edit</span>
            </a>
            <ul className="song-list" id="song-list">
              {songs.length === 0 ? (
                <li style={{ padding: '16px', color: '#666' }}>No songs</li>
              ) : (
                songs.map((song: any, index: number) => (
                  <li
                    key={song.id}
                    className={`song-item ${index === 0 ? 'active' : ''}`}
                    data-index={index}
                  >
                    <div className="song-number">{index + 1}</div>
                    <div className="song-title">{song.title}</div>
                    <div className="song-artist">{song.artist}</div>
                  </li>
                ))
              )}
            </ul>
          </nav>
          <main className="main">
            {songs.length === 0 ? (
              <div className="empty">Add songs to this setlist to begin</div>
            ) : (
              <>
                <div className="header">
                  <div className="header-title" id="current-title">{songs[0]?.title}</div>
                  <div className="header-artist" id="current-artist">{songs[0]?.artist}</div>
                </div>
                <div className="chords" id="current-chords">{songs[0]?.chords}</div>
                <div className="nav-hint">
                  Use arrow keys or number keys to navigate &bull; Swipe on mobile
                </div>
              </>
            )}
          </main>
        </div>

        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var songs = ${songsJson};
            if (songs.length === 0) return;

            var currentIndex = 0;
            var songItems = document.querySelectorAll('.song-item');
            var titleEl = document.getElementById('current-title');
            var artistEl = document.getElementById('current-artist');
            var chordsEl = document.getElementById('current-chords');

            function selectSong(index) {
              if (index < 0 || index >= songs.length) return;
              currentIndex = index;

              // Update sidebar
              songItems.forEach(function(item, i) {
                item.classList.toggle('active', i === index);
              });

              // Scroll active item into view
              var activeItem = songItems[index];
              if (activeItem) {
                activeItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
              }

              // Update content
              var song = songs[index];
              titleEl.textContent = song.title;
              artistEl.textContent = song.artist;
              chordsEl.textContent = song.chords;
              chordsEl.scrollTop = 0;
            }

            // Click handlers
            songItems.forEach(function(item, i) {
              item.addEventListener('click', function() {
                selectSong(i);
              });
            });

            // Keyboard navigation
            document.addEventListener('keydown', function(e) {
              if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                e.preventDefault();
                selectSong(currentIndex - 1);
              } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                e.preventDefault();
                selectSong(currentIndex + 1);
              } else if (e.key >= '1' && e.key <= '9') {
                var num = parseInt(e.key, 10) - 1;
                if (num < songs.length) {
                  selectSong(num);
                }
              } else if (e.key === '0' && songs.length >= 10) {
                selectSong(9);
              }
            });

            // Touch/swipe support
            var touchStartX = 0;
            var touchStartY = 0;
            var touchEndX = 0;
            var touchEndY = 0;

            document.addEventListener('touchstart', function(e) {
              touchStartX = e.changedTouches[0].screenX;
              touchStartY = e.changedTouches[0].screenY;
            }, { passive: true });

            document.addEventListener('touchend', function(e) {
              touchEndX = e.changedTouches[0].screenX;
              touchEndY = e.changedTouches[0].screenY;
              handleSwipe();
            }, { passive: true });

            function handleSwipe() {
              var dx = touchEndX - touchStartX;
              var dy = touchEndY - touchStartY;

              // Only handle horizontal swipes that are bigger than vertical
              if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
                if (dx > 0) {
                  selectSong(currentIndex - 1);
                } else {
                  selectSong(currentIndex + 1);
                }
              }
            }
          })();
        `}} />
      </body>
    </html>
  )
}
