import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

type DayActivity = {
  day: string;
  tracks: number;
};

type ListeningActivityProps = {
  weekActivity: DayActivity[];
};

const ListeningActivity = ({ weekActivity }: ListeningActivityProps) => {
  const maxTracks = Math.max(...weekActivity.map(d => d.tracks));
  
  return (
    <Card className="bg-card border-primary/10 p-6">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Icon name="Activity" size={20} className="text-secondary" />
        Активность за неделю
      </h3>
      
      <div className="flex items-end justify-between gap-2 h-32">
        {weekActivity.map((day, idx) => {
          const height = maxTracks > 0 ? (day.tracks / maxTracks) * 100 : 0;
          
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex items-end justify-center h-24">
                <div 
                  className="w-full bg-gradient-to-t from-secondary to-primary rounded-t transition-all duration-500 hover:opacity-80 cursor-pointer relative group"
                  style={{ height: `${height}%`, minHeight: day.tracks > 0 ? '8px' : '0' }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 px-2 py-1 rounded text-xs whitespace-nowrap">
                    {day.tracks} треков
                  </div>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{day.day}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default ListeningActivity;
