import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';

type Track = {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: string;
  genre: string;
};

type Band = {
  id: number;
  name: string;
  genre: string;
  listeners: string;
};

type Playlist = {
  id: number;
  name: string;
  trackIds: number[];
};

const Index = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'bands' | 'upload' | 'playlists' | 'profile'>('home');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [volume, setVolume] = useState([70]);
  const [favoriteTracks, setFavoriteTracks] = useState<number[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([
    { id: 1, name: 'Любимое', trackIds: [] },
    { id: 2, name: 'Рок классика', trackIds: [] },
    { id: 3, name: 'Метал 2024', trackIds: [] },
  ]);
  const [showPlaylistDialog, setShowPlaylistDialog] = useState(false);
  const [selectedTrackForPlaylist, setSelectedTrackForPlaylist] = useState<Track | null>(null);
  const [showCreatePlaylistDialog, setShowCreatePlaylistDialog] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const trendingTracks: Track[] = [
    { id: 1, title: 'Enter Sandman', artist: 'Metallica', album: 'Metallica', duration: '5:32', genre: 'Metal' },
    { id: 2, title: 'Smells Like Teen Spirit', artist: 'Nirvana', album: 'Nevermind', duration: '5:01', genre: 'Grunge' },
    { id: 3, title: 'Paranoid', artist: 'Black Sabbath', album: 'Paranoid', duration: '2:50', genre: 'Metal' },
    { id: 4, title: 'Back in Black', artist: 'AC/DC', album: 'Back in Black', duration: '4:15', genre: 'Rock' },
    { id: 5, title: 'Kashmir', artist: 'Led Zeppelin', album: 'Physical Graffiti', duration: '8:37', genre: 'Rock' },
  ];

  const topBands: Band[] = [
    { id: 1, name: 'Metallica', genre: 'Thrash Metal', listeners: '18.2M' },
    { id: 2, name: 'Iron Maiden', genre: 'Heavy Metal', listeners: '15.7M' },
    { id: 3, name: 'Led Zeppelin', genre: 'Hard Rock', listeners: '22.1M' },
    { id: 4, name: 'Black Sabbath', genre: 'Doom Metal', listeners: '12.4M' },
    { id: 5, name: 'Slayer', genre: 'Thrash Metal', listeners: '8.9M' },
  ];

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleFavorite = (trackId: number) => {
    setFavoriteTracks(prev => 
      prev.includes(trackId) 
        ? prev.filter(id => id !== trackId)
        : [...prev, trackId]
    );
    
    setPlaylists(prev => prev.map(playlist => 
      playlist.id === 1 
        ? { 
            ...playlist, 
            trackIds: favoriteTracks.includes(trackId)
              ? playlist.trackIds.filter(id => id !== trackId)
              : [...playlist.trackIds, trackId]
          }
        : playlist
    ));
  };

  const openPlaylistDialog = (track: Track) => {
    setSelectedTrackForPlaylist(track);
    setShowPlaylistDialog(true);
  };

  const addToPlaylist = (playlistId: number) => {
    if (!selectedTrackForPlaylist) return;
    
    setPlaylists(prev => prev.map(playlist => 
      playlist.id === playlistId && !playlist.trackIds.includes(selectedTrackForPlaylist.id)
        ? { ...playlist, trackIds: [...playlist.trackIds, selectedTrackForPlaylist.id] }
        : playlist
    ));
    
    setShowPlaylistDialog(false);
    setSelectedTrackForPlaylist(null);
  };

  const getPlaylistTracks = (playlistId: number): Track[] => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) return [];
    return trendingTracks.filter(track => playlist.trackIds.includes(track.id));
  };

  const createPlaylist = () => {
    if (!newPlaylistName.trim()) return;
    
    const newPlaylist: Playlist = {
      id: Math.max(...playlists.map(p => p.id), 0) + 1,
      name: newPlaylistName.trim(),
      trackIds: []
    };
    
    setPlaylists([...playlists, newPlaylist]);
    setNewPlaylistName('');
    setShowCreatePlaylistDialog(false);
  };

  const deletePlaylist = (playlistId: number) => {
    if (playlistId === 1) return;
    setPlaylists(playlists.filter(p => p.id !== playlistId));
  };

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="https://cdn.poehali.dev/files/87e477b8-5036-48f6-baa4-eb9b3bf3dbab.png" 
                alt="Рокоман" 
                className="w-12 h-12 rounded-full"
              />
              <h1 className="text-2xl font-bold text-primary">РОКОМАН</h1>
            </div>
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Input 
                  placeholder="Поиск треков, групп..." 
                  className="bg-muted border-primary/20 text-white placeholder:text-muted-foreground pr-10"
                />
                <Icon name="Search" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              </div>
            </div>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-black">
              <Icon name="User" size={18} className="mr-2" />
              Профиль
            </Button>
          </div>
        </div>
      </header>

      <nav className="sticky top-[73px] z-40 bg-black/90 backdrop-blur-sm border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            {[
              { id: 'home', label: 'Главная', icon: 'Home' },
              { id: 'bands', label: 'Группы', icon: 'Music2' },
              { id: 'upload', label: 'Загрузить', icon: 'Upload' },
              { id: 'playlists', label: 'Плейлисты', icon: 'ListMusic' },
              { id: 'profile', label: 'Профиль', icon: 'User' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 transition-all ${
                  activeTab === tab.id
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-white'
                }`}
              >
                <Icon name={tab.icon as any} size={18} />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'home' && (
          <div className="space-y-8">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Icon name="TrendingUp" size={28} className="text-primary" />
                <h2 className="text-3xl font-bold">Популярное сейчас</h2>
              </div>
              <div className="grid gap-4">
                {trendingTracks.map((track) => (
                  <Card 
                    key={track.id} 
                    className="bg-card border-primary/10 hover:border-primary/30 transition-all group cursor-pointer"
                    onClick={() => playTrack(track)}
                  >
                    <div className="flex items-center gap-4 p-4">
                      <Button 
                        size="icon" 
                        className="bg-primary text-black hover:bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Icon name="Play" size={20} />
                      </Button>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">{track.title}</h3>
                        <p className="text-sm text-muted-foreground">{track.artist} • {track.album}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="text-sm px-3 py-1 rounded-full bg-secondary/20 text-secondary">
                          {track.genre}
                        </span>
                        <span className="text-sm text-muted-foreground">{track.duration}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-muted-foreground hover:text-accent"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(track.id);
                          }}
                        >
                          <Icon 
                            name={favoriteTracks.includes(track.id) ? "Heart" : "Heart"} 
                            size={20}
                            className={favoriteTracks.includes(track.id) ? "fill-accent text-accent" : ""}
                          />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-muted-foreground hover:text-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            openPlaylistDialog(track);
                          }}
                        >
                          <Icon name="ListPlus" size={20} />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <Icon name="Music2" size={28} className="text-secondary" />
                <h2 className="text-3xl font-bold">Топ-группы</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {topBands.map((band) => (
                  <Card 
                    key={band.id} 
                    className="bg-card border-primary/10 hover:border-secondary/50 transition-all cursor-pointer group"
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl font-bold">
                          {band.name[0]}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-xl">{band.name}</h3>
                          <p className="text-sm text-muted-foreground">{band.genre}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          <Icon name="Users" size={16} className="inline mr-1" />
                          {band.listeners} слушателей
                        </span>
                        <Button size="sm" variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-black">
                          Слушать
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'upload' && (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Icon name="Upload" size={28} className="text-accent" />
              <h2 className="text-3xl font-bold">Загрузить трек</h2>
            </div>
            <Card className="bg-card border-primary/10 p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Название трека</label>
                  <Input placeholder="Введите название..." className="bg-muted border-primary/20" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Исполнитель</label>
                  <Input placeholder="Имя группы или артиста..." className="bg-muted border-primary/20" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Жанр</label>
                  <Input placeholder="Например: Thrash Metal..." className="bg-muted border-primary/20" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Аудиофайл</label>
                  <div className="border-2 border-dashed border-primary/30 rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Icon name="Upload" size={48} className="mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground mb-2">Перетащите файл сюда или нажмите для выбора</p>
                    <p className="text-sm text-muted-foreground">MP3, WAV, FLAC (макс. 50MB)</p>
                  </div>
                </div>
                <Button className="w-full bg-accent hover:bg-accent/90 text-white">
                  <Icon name="Upload" size={20} className="mr-2" />
                  Загрузить трек
                </Button>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'bands' && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Icon name="Music2" size={28} className="text-secondary" />
              <h2 className="text-3xl font-bold">Все группы</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {topBands.map((band) => (
                <Card 
                  key={band.id} 
                  className="bg-card border-primary/10 hover:border-secondary/50 transition-all cursor-pointer"
                >
                  <div className="p-6 text-center">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl font-bold">
                      {band.name[0]}
                    </div>
                    <h3 className="font-bold text-lg mb-1">{band.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{band.genre}</p>
                    <p className="text-xs text-muted-foreground mb-4">
                      <Icon name="Users" size={14} className="inline mr-1" />
                      {band.listeners}
                    </p>
                    <Button size="sm" className="w-full bg-secondary hover:bg-secondary/90 text-black">
                      Слушать
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'playlists' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Icon name="ListMusic" size={28} className="text-primary" />
                <h2 className="text-3xl font-bold">Мои плейлисты</h2>
              </div>
              <Button 
                className="bg-primary hover:bg-primary/90 text-black"
                onClick={() => setShowCreatePlaylistDialog(true)}
              >
                <Icon name="Plus" size={20} className="mr-2" />
                Создать плейлист
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {playlists.map((playlist) => (
                <Card key={playlist.id} className="bg-card border-primary/10 hover:border-primary/30 transition-all group relative">
                  <div className="p-6">
                    {playlist.id !== 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-accent"
                        onClick={() => deletePlaylist(playlist.id)}
                      >
                        <Icon name="Trash2" size={18} />
                      </Button>
                    )}
                    <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-primary via-secondary to-accent mb-4 flex items-center justify-center">
                      <Icon name="Music" size={64} className="text-black/50" />
                    </div>
                    <h3 className="font-bold text-xl mb-2">{playlist.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {playlist.trackIds.length} {playlist.trackIds.length === 1 ? 'трек' : playlist.trackIds.length < 5 ? 'трека' : 'треков'}
                    </p>
                    <Button 
                      size="sm" 
                      className="w-full bg-primary hover:bg-primary/90 text-black"
                      disabled={playlist.trackIds.length === 0}
                    >
                      <Icon name="Play" size={16} className="mr-2" />
                      {playlist.trackIds.length === 0 ? 'Пусто' : 'Слушать'}
                    </Button>
                    {playlist.trackIds.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-primary/10">
                        <p className="text-xs text-muted-foreground mb-2">Треки:</p>
                        <div className="space-y-1">
                          {getPlaylistTracks(playlist.id).slice(0, 3).map(track => (
                            <p key={track.id} className="text-xs truncate">{track.title}</p>
                          ))}
                          {playlist.trackIds.length > 3 && (
                            <p className="text-xs text-muted-foreground">+{playlist.trackIds.length - 3} ещё</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Icon name="User" size={28} className="text-primary" />
              <h2 className="text-3xl font-bold">Мой профиль</h2>
            </div>
            <Card className="bg-card border-primary/10 p-8">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl font-bold">
                  РМ
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">Рок-Маньяк</h3>
                  <p className="text-muted-foreground">Любитель качественного звука</p>
                </div>
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-black">
                  Редактировать
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-primary">42</p>
                  <p className="text-sm text-muted-foreground">Треков загружено</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-secondary">156</p>
                  <p className="text-sm text-muted-foreground">Любимых</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-accent">8</p>
                  <p className="text-sm text-muted-foreground">Плейлистов</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>

      {showCreatePlaylistDialog && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setShowCreatePlaylistDialog(false)}>
          <Card className="bg-card border-primary/20 p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Создать плейлист</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowCreatePlaylistDialog(false)}>
                <Icon name="X" size={20} />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Название плейлиста</label>
                <Input 
                  placeholder="Например: Моя коллекция металла..."
                  className="bg-muted border-primary/20"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && createPlaylist()}
                  autoFocus
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-primary hover:bg-primary/90 text-black"
                  onClick={createPlaylist}
                  disabled={!newPlaylistName.trim()}
                >
                  <Icon name="Plus" size={20} className="mr-2" />
                  Создать
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 border-primary/20"
                  onClick={() => setShowCreatePlaylistDialog(false)}
                >
                  Отмена
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {showPlaylistDialog && selectedTrackForPlaylist && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setShowPlaylistDialog(false)}>
          <Card className="bg-card border-primary/20 p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Добавить в плейлист</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowPlaylistDialog(false)}>
                <Icon name="X" size={20} />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {selectedTrackForPlaylist.title} - {selectedTrackForPlaylist.artist}
            </p>
            <div className="space-y-2">
              {playlists.map(playlist => (
                <Button
                  key={playlist.id}
                  variant="outline"
                  className={`w-full justify-start ${
                    playlist.trackIds.includes(selectedTrackForPlaylist.id)
                      ? 'border-primary text-primary'
                      : 'border-primary/20'
                  }`}
                  onClick={() => addToPlaylist(playlist.id)}
                  disabled={playlist.trackIds.includes(selectedTrackForPlaylist.id)}
                >
                  <Icon name="ListMusic" size={18} className="mr-2" />
                  {playlist.name}
                  {playlist.trackIds.includes(selectedTrackForPlaylist.id) && (
                    <Icon name="Check" size={18} className="ml-auto" />
                  )}
                </Button>
              ))}
            </div>
          </Card>
        </div>
      )}

      {currentTrack && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-lg border-t border-primary/20 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-14 h-14 rounded bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Icon name="Music" size={24} className="text-black" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold truncate">{currentTrack.title}</h4>
                  <p className="text-sm text-muted-foreground truncate">{currentTrack.artist}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-muted-foreground hover:text-accent"
                  onClick={() => currentTrack && toggleFavorite(currentTrack.id)}
                >
                  <Icon 
                    name="Heart" 
                    size={20}
                    className={currentTrack && favoriteTracks.includes(currentTrack.id) ? "fill-accent text-accent" : ""}
                  />
                </Button>
              </div>

              <div className="flex flex-col items-center gap-2 flex-1">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white">
                    <Icon name="Shuffle" size={20} />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white">
                    <Icon name="SkipBack" size={20} />
                  </Button>
                  <Button 
                    size="icon" 
                    className="bg-primary hover:bg-primary/90 text-black w-12 h-12"
                    onClick={togglePlay}
                  >
                    <Icon name={isPlaying ? 'Pause' : 'Play'} size={24} />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white">
                    <Icon name="SkipForward" size={20} />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white">
                    <Icon name="Repeat" size={20} />
                  </Button>
                </div>
                <div className="flex items-center gap-3 w-full max-w-md">
                  <span className="text-xs text-muted-foreground">0:00</span>
                  <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-1/3"></div>
                  </div>
                  <span className="text-xs text-muted-foreground">{currentTrack.duration}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-1 justify-end">
                <Icon name="Volume2" size={20} className="text-muted-foreground" />
                <Slider 
                  value={volume} 
                  onValueChange={setVolume}
                  max={100} 
                  step={1} 
                  className="w-24"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;