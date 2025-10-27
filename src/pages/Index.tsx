import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import StatsChart from '@/components/StatsChart';
import ListeningActivity from '@/components/ListeningActivity';
import Notifications from '@/components/Notifications';

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

type Review = {
  id: number;
  trackId?: number;
  bandId?: number;
  userName: string;
  userAvatar: string;
  rating: number;
  text: string;
  date: string;
};

type User = {
  id: number;
  name: string;
  avatar: string;
  favoriteGenres: string[];
  bio: string;
  commonTracks: number;
};

type Concert = {
  id: number;
  bandId: number;
  city: string;
  venue: string;
  date: string;
  price: string;
};

type Achievement = {
  id: number;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
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
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0);
  const [currentPlaylistTracks, setCurrentPlaylistTracks] = useState<Track[]>([]);
  const [showReviews, setShowReviews] = useState(false);
  const [selectedItemForReview, setSelectedItemForReview] = useState<{type: 'track' | 'band', id: number} | null>(null);
  const [showCommunity, setShowCommunity] = useState(false);
  const [showConcerts, setShowConcerts] = useState(false);
  const [selectedBandForConcerts, setSelectedBandForConcerts] = useState<number | null>(null);
  const [showAchievements, setShowAchievements] = useState(false);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [listenTime, setListenTime] = useState(12847);
  const [showStats, setShowStats] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'concert' as const, title: 'Новый концерт', message: 'Metallica выступят в Москве 15 декабря', time: '2 часа назад', unread: true },
    { id: 2, type: 'achievement' as const, title: 'Достижение получено!', message: 'Вы получили достижение "Меломан"', time: '5 часов назад', unread: true },
    { id: 3, type: 'new_music' as const, title: 'Новая музыка', message: 'Добавлены новые треки Кино', time: '1 день назад', unread: false },
    { id: 4, type: 'friend' as const, title: 'Новый подписчик', message: 'MetalHead666 подписался на вас', time: '2 дня назад', unread: false },
  ]);

  const genreStats = [
    { genre: 'Metal', minutes: 4523, percentage: 35 },
    { genre: 'Rock', minutes: 3876, percentage: 30 },
    { genre: 'Punk Rock', minutes: 2584, percentage: 20 },
    { genre: 'Grunge', minutes: 1938, percentage: 15 },
  ];

  const weekActivity = [
    { day: 'Пн', tracks: 12 },
    { day: 'Вт', tracks: 18 },
    { day: 'Ср', tracks: 8 },
    { day: 'Чт', tracks: 22 },
    { day: 'Пт', tracks: 15 },
    { day: 'Сб', tracks: 28 },
    { day: 'Вс', tracks: 25 },
  ];

  useEffect(() => {
    if (isPlaying) {
      const timer = setInterval(() => {
        setListenTime(prev => prev + 1);
      }, 60000);
      return () => clearInterval(timer);
    }
  }, [isPlaying]);

  const trendingTracks: Track[] = [
    { id: 1, title: 'Enter Sandman', artist: 'Metallica', album: 'Metallica', duration: '5:32', genre: 'Metal' },
    { id: 2, title: 'Smells Like Teen Spirit', artist: 'Nirvana', album: 'Nevermind', duration: '5:01', genre: 'Grunge' },
    { id: 3, title: 'Paranoid', artist: 'Black Sabbath', album: 'Paranoid', duration: '2:50', genre: 'Metal' },
    { id: 4, title: 'Back in Black', artist: 'AC/DC', album: 'Back in Black', duration: '4:15', genre: 'Rock' },
    { id: 5, title: 'Kashmir', artist: 'Led Zeppelin', album: 'Physical Graffiti', duration: '8:37', genre: 'Rock' },
    { id: 6, title: 'Кукла колдуна', artist: 'Король и Шут', album: 'Король и Шут', duration: '3:45', genre: 'Punk Rock' },
    { id: 7, title: 'Группа крови', artist: 'Кино', album: 'Группа крови', duration: '4:42', genre: 'Rock' },
    { id: 8, title: 'Лирика', artist: 'Сектор Газа', album: 'Кащей Бессмертный', duration: '3:18', genre: 'Punk Rock' },
  ];

  const reviews: Review[] = [
    { id: 1, trackId: 1, userName: 'Рок-Маньяк', userAvatar: 'РМ', rating: 5, text: 'Легендарный трек! Metallica в лучшей форме!', date: '2 дня назад' },
    { id: 2, trackId: 1, userName: 'MetalHead666', userAvatar: 'MH', rating: 5, text: 'Классика жанра, слушаю уже 20 лет', date: '5 дней назад' },
    { id: 3, bandId: 1, userName: 'ThrashFan', userAvatar: 'TF', rating: 5, text: 'Metallica - короли трэш-метала!', date: '1 неделю назад' },
    { id: 4, trackId: 7, userName: 'СоветскийРок', userAvatar: 'СР', rating: 5, text: 'Виктор Цой жив! Вечная классика', date: '3 дня назад' },
    { id: 5, bandId: 6, userName: 'ПанкРокер', userAvatar: 'ПР', rating: 5, text: 'КиШ - лучшие в русском панке!', date: '1 день назад' },
  ];

  const suggestedUsers: User[] = [
    { id: 1, name: 'MetalHead666', avatar: 'MH', favoriteGenres: ['Metal', 'Thrash Metal'], bio: 'Живу металлом 🤘', commonTracks: 42 },
    { id: 2, name: 'RockStar92', avatar: 'RS', favoriteGenres: ['Rock', 'Hard Rock'], bio: 'Рок - это жизнь!', commonTracks: 38 },
    { id: 3, name: 'GrungeLover', avatar: 'GL', favoriteGenres: ['Grunge', 'Rock'], bio: 'Nirvana forever', commonTracks: 31 },
    { id: 4, name: 'РусскийРокер', avatar: 'РР', favoriteGenres: ['Punk Rock', 'Rock'], bio: 'Слушаю только наше!', commonTracks: 27 },
  ];

  const topBands: Band[] = [
    { id: 1, name: 'Metallica', genre: 'Thrash Metal', listeners: '18.2M' },
    { id: 2, name: 'Iron Maiden', genre: 'Heavy Metal', listeners: '15.7M' },
    { id: 3, name: 'Led Zeppelin', genre: 'Hard Rock', listeners: '22.1M' },
    { id: 4, name: 'Black Sabbath', genre: 'Doom Metal', listeners: '12.4M' },
    { id: 5, name: 'Slayer', genre: 'Thrash Metal', listeners: '8.9M' },
    { id: 6, name: 'Король и Шут', genre: 'Punk Rock', listeners: '5.3M' },
    { id: 7, name: 'Кино', genre: 'Rock', listeners: '7.8M' },
    { id: 8, name: 'Сектор Газа', genre: 'Punk Rock', listeners: '4.1M' },
  ];

  const concerts: Concert[] = [
    { id: 1, bandId: 1, city: 'Москва', venue: 'Лужники', date: '15 декабря 2025', price: 'от 3500₽' },
    { id: 2, bandId: 1, city: 'Санкт-Петербург', venue: 'Ледовый дворец', date: '18 декабря 2025', price: 'от 3000₽' },
    { id: 3, bandId: 6, city: 'Москва', venue: 'Adrenaline Stadium', date: '1 января 2026', price: 'от 2000₽' },
    { id: 4, bandId: 7, city: 'Екатеринбург', venue: 'Teleclub', date: '25 ноября 2025', price: 'от 1500₽' },
  ];

  const achievements: Achievement[] = [
    { id: 1, title: 'Первый шаг', description: 'Прослушайте первый трек', icon: 'Play', unlocked: true },
    { id: 2, title: 'Меломан', description: 'Прослушайте 100 треков', icon: 'Music', unlocked: true },
    { id: 3, title: 'Коллекционер', description: 'Добавьте 50 треков в избранное', icon: 'Heart', unlocked: false },
    { id: 4, title: 'Социальный', description: 'Добавьте 10 друзей', icon: 'Users', unlocked: false },
    { id: 5, title: 'Критик', description: 'Оставьте 20 отзывов', icon: 'MessageSquare', unlocked: false },
    { id: 6, title: 'Ночной слушатель', description: 'Слушайте музыку 5 ночей подряд', icon: 'Moon', unlocked: true },
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

  const playPlaylist = (playlistId: number) => {
    const tracks = getPlaylistTracks(playlistId);
    if (tracks.length > 0) {
      setCurrentPlaylistTracks(tracks);
      setCurrentPlaylistIndex(0);
      playTrack(tracks[0]);
    }
  };

  const playNextTrack = () => {
    if (currentPlaylistTracks.length === 0) return;
    
    const nextIndex = (currentPlaylistIndex + 1) % currentPlaylistTracks.length;
    setCurrentPlaylistIndex(nextIndex);
    playTrack(currentPlaylistTracks[nextIndex]);
  };

  const playPreviousTrack = () => {
    if (currentPlaylistTracks.length === 0) return;
    
    const prevIndex = currentPlaylistIndex === 0 ? currentPlaylistTracks.length - 1 : currentPlaylistIndex - 1;
    setCurrentPlaylistIndex(prevIndex);
    playTrack(currentPlaylistTracks[prevIndex]);
  };

  const openReviews = (type: 'track' | 'band', id: number) => {
    setSelectedItemForReview({type, id});
    setShowReviews(true);
  };

  const submitReview = () => {
    if (!newReviewText.trim()) return;
    setNewReviewText('');
    setNewReviewRating(5);
    setShowReviews(false);
  };

  const getReviewsForItem = () => {
    if (!selectedItemForReview) return [];
    return reviews.filter(r => 
      selectedItemForReview.type === 'track' 
        ? r.trackId === selectedItemForReview.id 
        : r.bandId === selectedItemForReview.id
    );
  };

  const getItemName = () => {
    if (!selectedItemForReview) return '';
    if (selectedItemForReview.type === 'track') {
      const track = trendingTracks.find(t => t.id === selectedItemForReview.id);
      return track ? `${track.title} - ${track.artist}` : '';
    }
    const band = topBands.find(b => b.id === selectedItemForReview.id);
    return band ? band.name : '';
  };

  const openConcerts = (bandId: number) => {
    setSelectedBandForConcerts(bandId);
    setShowConcerts(true);
  };

  const getBandConcerts = () => {
    if (!selectedBandForConcerts) return [];
    return concerts.filter(c => c.bandId === selectedBandForConcerts);
  };

  const getBandName = (bandId: number) => {
    const band = topBands.find(b => b.id === bandId);
    return band ? band.name : '';
  };

  const markNotificationAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, unread: false } : n
    ));
  };

  const filteredTracks = trendingTracks.filter(track => 
    searchQuery === '' || 
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBands = topBands.filter(band =>
    searchQuery === '' ||
    band.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    band.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Icon name="Search" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon"
                className="border-primary/20 relative"
                onClick={() => setShowNotifications(true)}
              >
                <Icon name="Bell" size={18} />
                {notifications.filter(n => n.unread).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center text-xs font-bold">
                    {notifications.filter(n => n.unread).length}
                  </span>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="border-secondary text-secondary hover:bg-secondary hover:text-black"
                onClick={() => setShowStats(true)}
              >
                <Icon name="BarChart3" size={18} className="mr-2" />
                Статистика
              </Button>
              <Button 
                variant="outline" 
                className="border-primary text-primary hover:bg-primary hover:text-black"
                onClick={() => setShowAchievements(true)}
              >
                <Icon name="Trophy" size={18} className="mr-2" />
                Достижения
              </Button>
              <Button 
                variant="outline" 
                className="border-primary text-primary hover:bg-primary hover:text-black"
                onClick={() => setActiveTab('profile')}
              >
                <Icon name="User" size={18} className="mr-2" />
                Профиль
              </Button>
            </div>
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
            <button
              onClick={() => setShowCommunity(true)}
              className="flex items-center gap-2 px-6 py-3 transition-all text-muted-foreground hover:text-white ml-auto"
            >
              <Icon name="Users" size={18} />
              <span className="font-medium">Сообщество</span>
              <Badge className="ml-1 bg-accent text-white border-0">
                {suggestedUsers.length}
              </Badge>
            </button>
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
                {filteredTracks.length === 0 ? (
                  <div className="text-center py-12">
                    <Icon name="Search" size={64} className="mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Ничего не найдено</p>
                  </div>
                ) : (
                  filteredTracks.map((track) => (
                  <Card 
                    key={track.id} 
                    className="bg-card border-primary/10 hover:border-primary/30 transition-all group cursor-pointer"
                    onClick={() => {
                      setCurrentPlaylistTracks(trendingTracks);
                      setCurrentPlaylistIndex(trendingTracks.indexOf(track));
                      playTrack(track);
                    }}
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
                      <div className="flex items-center gap-3">
                        <span className="text-sm px-3 py-1 rounded-full bg-secondary/20 text-secondary">
                          {track.genre}
                        </span>
                        <span className="text-sm text-muted-foreground">{track.duration}</span>
                        <div className="flex items-center gap-1">
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
                              name="Heart" 
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
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-muted-foreground hover:text-secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              openReviews('track', track.id);
                            }}
                          >
                            <Icon name="MessageSquare" size={20} />
                          </Button>
                        </div>
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
                {(searchQuery ? filteredBands : topBands.slice(0, 6)).map((band) => (
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
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-muted-foreground">
                          <Icon name="Users" size={16} className="inline mr-1" />
                          {band.listeners} слушателей
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Button size="sm" variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-black">
                          Слушать
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-accent text-accent hover:bg-accent hover:text-white"
                          onClick={() => openConcerts(band.id)}
                        >
                          <Icon name="Calendar" size={16} className="mr-1" />
                          Концерты
                        </Button>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="w-full mt-2 hover:text-primary"
                        onClick={() => openReviews('band', band.id)}
                      >
                        <Icon name="MessageSquare" size={16} className="mr-2" />
                        Отзывы
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'bands' && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Icon name="Music2" size={28} className="text-secondary" />
              <h2 className="text-3xl font-bold">Все группы</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredBands.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Icon name="Search" size={64} className="mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Группы не найдены</p>
                </div>
              ) : (
                filteredBands.map((band) => (
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
                    <div className="space-y-2">
                      <Button size="sm" className="w-full bg-secondary hover:bg-secondary/90 text-black">
                        Слушать
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full border-accent text-accent hover:bg-accent hover:text-white"
                        onClick={() => openConcerts(band.id)}
                      >
                        <Icon name="Calendar" size={16} className="mr-2" />
                        Концерты
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full border-primary/20 hover:border-primary hover:text-primary"
                        onClick={() => openReviews('band', band.id)}
                      >
                        <Icon name="MessageSquare" size={16} className="mr-2" />
                        Отзывы
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
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
                      onClick={() => playPlaylist(playlist.id)}
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
            <Card className="bg-card border-primary/10 p-8 mb-6">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl font-bold">
                  РМ
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">Рок-Маньяк</h3>
                  <p className="text-muted-foreground mb-2">Любитель качественного звука</p>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-primary text-black">Уровень 12</Badge>
                    <Badge className="bg-secondary text-black">Топ-10 слушателей</Badge>
                  </div>
                </div>
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-black">
                  Редактировать
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-primary">{listenTime}</p>
                  <p className="text-sm text-muted-foreground">Минут прослушано</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-secondary">{favoriteTracks.length}</p>
                  <p className="text-sm text-muted-foreground">Любимых</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-accent">{playlists.length}</p>
                  <p className="text-sm text-muted-foreground">Плейлистов</p>
                </div>
              </div>
            </Card>

            <Card className="bg-card border-primary/10 p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Icon name="Trophy" size={20} className="text-primary" />
                Последние достижения
              </h3>
              <div className="space-y-3">
                {achievements.filter(a => a.unlocked).slice(0, 3).map(achievement => (
                  <div key={achievement.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <Icon name={achievement.icon as any} size={20} className="text-black" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{achievement.title}</p>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4 border-primary/20 hover:border-primary hover:text-primary"
                onClick={() => setShowAchievements(true)}
              >
                Посмотреть все достижения
              </Button>
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

      {showReviews && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setShowReviews(false)}>
          <Card className="bg-card border-primary/20 p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Отзывы</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowReviews(false)}>
                <Icon name="X" size={20} />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mb-6">{getItemName()}</p>
            
            <div className="mb-6 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-3">Оставить отзыв</h4>
              <div className="mb-3">
                <label className="block text-sm mb-2">Оценка</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setNewReviewRating(rating)}
                      className="transition-transform hover:scale-110"
                    >
                      <Icon 
                        name="Star" 
                        size={24} 
                        className={rating <= newReviewRating ? "fill-primary text-primary" : "text-muted-foreground"}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-3">
                <label className="block text-sm mb-2">Ваш отзыв</label>
                <Input 
                  placeholder="Напишите что думаете..."
                  className="bg-background border-primary/20"
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                />
              </div>
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-black"
                onClick={submitReview}
                disabled={!newReviewText.trim()}
              >
                Отправить
              </Button>
            </div>

            <div className="space-y-4">
              {getReviewsForItem().map(review => (
                <div key={review.id} className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm font-bold">
                      {review.userAvatar}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{review.userName}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Icon 
                              key={i} 
                              name="Star" 
                              size={14} 
                              className={i < review.rating ? "fill-primary text-primary" : "text-muted-foreground"}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm">{review.text}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {showCommunity && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setShowCommunity(false)}>
          <Card className="bg-card border-primary/20 p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold">Сообщество рокеров</h3>
                <p className="text-sm text-muted-foreground">Люди с похожим музыкальным вкусом</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowCommunity(false)}>
                <Icon name="X" size={20} />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suggestedUsers.map(user => (
                <Card key={user.id} className="bg-muted/50 border-primary/10 p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xl font-bold flex-shrink-0">
                      {user.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-lg mb-1">{user.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{user.bio}</p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {user.favoriteGenres.map((genre, idx) => (
                          <span key={idx} className="text-xs px-2 py-1 rounded-full bg-secondary/20 text-secondary">
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon name="Music" size={16} className="text-primary" />
                      <span>{user.commonTracks} общих треков</span>
                    </div>
                    <Button size="sm" className="bg-primary hover:bg-primary/90 text-black">
                      <Icon name="UserPlus" size={16} className="mr-2" />
                      Добавить
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      )}

      {showNotifications && (
        <Notifications 
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          onMarkRead={markNotificationAsRead}
        />
      )}

      {showConcerts && selectedBandForConcerts && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setShowConcerts(false)}>
          <Card className="bg-card border-primary/20 p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold">Концерты</h3>
                <p className="text-sm text-muted-foreground">{getBandName(selectedBandForConcerts)}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowConcerts(false)}>
                <Icon name="X" size={20} />
              </Button>
            </div>

            {getBandConcerts().length === 0 ? (
              <div className="text-center py-12">
                <Icon name="Calendar" size={64} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Концертов пока нет</p>
              </div>
            ) : (
              <div className="space-y-4">
                {getBandConcerts().map(concert => (
                  <Card key={concert.id} className="bg-muted/50 border-primary/10 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-bold text-xl mb-2">{concert.city}</h4>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p className="flex items-center gap-2">
                            <Icon name="MapPin" size={16} className="text-accent" />
                            {concert.venue}
                          </p>
                          <p className="flex items-center gap-2">
                            <Icon name="Calendar" size={16} className="text-primary" />
                            {concert.date}
                          </p>
                          <p className="flex items-center gap-2">
                            <Icon name="Ticket" size={16} className="text-secondary" />
                            {concert.price}
                          </p>
                        </div>
                      </div>
                      <Button className="bg-accent hover:bg-accent/90 text-white">
                        Купить билет
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {showStats && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setShowStats(false)}>
          <div className="max-w-5xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-3xl font-bold text-white flex items-center gap-3">
                  <Icon name="BarChart3" size={32} className="text-primary" />
                  Моя статистика
                </h3>
                <p className="text-sm text-muted-foreground mt-1">Полный анализ твоих музыкальных предпочтений</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowStats(false)} className="text-white">
                <Icon name="X" size={24} />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="bg-card border-primary/10 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Icon name="Clock" size={24} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{listenTime}</p>
                    <p className="text-sm text-muted-foreground">Минут музыки</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-card border-primary/10 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                    <Icon name="Music" size={24} className="text-secondary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{weekActivity.reduce((sum, day) => sum + day.tracks, 0)}</p>
                    <p className="text-sm text-muted-foreground">Треков за неделю</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-card border-primary/10 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                    <Icon name="Heart" size={24} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{favoriteTracks.length}</p>
                    <p className="text-sm text-muted-foreground">Любимых треков</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatsChart genreStats={genreStats} totalMinutes={listenTime} />
              <ListeningActivity weekActivity={weekActivity} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <Card className="bg-card border-primary/10 p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Icon name="TrendingUp" size={20} className="text-primary" />
                  Топ исполнителей
                </h3>
                <div className="space-y-3">
                  {['Metallica', 'Кино', 'Led Zeppelin', 'Король и Шут'].map((artist, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-primary">{idx + 1}</span>
                        <span className="font-medium">{artist}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{Math.floor(Math.random() * 50) + 10} треков</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="bg-card border-primary/10 p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Icon name="Disc3" size={20} className="text-secondary" />
                  Любимые альбомы
                </h3>
                <div className="space-y-3">
                  {[
                    { album: 'Metallica', artist: 'Metallica' },
                    { album: 'Группа крови', artist: 'Кино' },
                    { album: 'Paranoid', artist: 'Black Sabbath' },
                    { album: 'Nevermind', artist: 'Nirvana' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-10 h-10 rounded bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm font-bold">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.album}</p>
                        <p className="text-xs text-muted-foreground">{item.artist}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {showAchievements && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setShowAchievements(false)}>
          <Card className="bg-card border-primary/20 p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <Icon name="Trophy" size={28} className="text-primary" />
                  Достижения
                </h3>
                <p className="text-sm text-muted-foreground">
                  Получено {achievements.filter(a => a.unlocked).length} из {achievements.length}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowAchievements(false)}>
                <Icon name="X" size={20} />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map(achievement => (
                <Card 
                  key={achievement.id} 
                  className={`p-6 ${
                    achievement.unlocked 
                      ? 'bg-muted/50 border-primary/20' 
                      : 'bg-muted/20 border-muted opacity-50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 ${
                      achievement.unlocked
                        ? 'bg-gradient-to-br from-primary to-secondary'
                        : 'bg-muted'
                    }`}>
                      <Icon 
                        name={achievement.icon as any} 
                        size={24} 
                        className={achievement.unlocked ? 'text-black' : 'text-muted-foreground'}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold mb-1">{achievement.title}</h4>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      {achievement.unlocked && (
                        <Badge className="mt-2 bg-primary text-black border-0">Получено</Badge>
                      )}
                    </div>
                  </div>
                </Card>
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
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-muted-foreground hover:text-white"
                    onClick={playPreviousTrack}
                    disabled={currentPlaylistTracks.length === 0}
                  >
                    <Icon name="SkipBack" size={20} />
                  </Button>
                  <Button 
                    size="icon" 
                    className="bg-primary hover:bg-primary/90 text-black w-12 h-12"
                    onClick={togglePlay}
                  >
                    <Icon name={isPlaying ? 'Pause' : 'Play'} size={24} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-muted-foreground hover:text-white"
                    onClick={playNextTrack}
                    disabled={currentPlaylistTracks.length === 0}
                  >
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