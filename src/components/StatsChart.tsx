import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

type GenreStats = {
  genre: string;
  minutes: number;
  percentage: number;
};

type StatsChartProps = {
  genreStats: GenreStats[];
  totalMinutes: number;
};

const StatsChart = ({ genreStats, totalMinutes }: StatsChartProps) => {
  const maxMinutes = Math.max(...genreStats.map(g => g.minutes));
  
  return (
    <Card className="bg-card border-primary/10 p-6">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Icon name="BarChart3" size={20} className="text-primary" />
        Статистика по жанрам
      </h3>
      
      <div className="space-y-4">
        {genreStats.map((stat, idx) => (
          <div key={idx}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{stat.genre}</span>
              <span className="text-xs text-muted-foreground">{stat.minutes} мин ({stat.percentage}%)</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${stat.percentage}%`,
                  background: `linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 50%, hsl(var(--accent)) 100%)`
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-primary/10">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Всего прослушано</span>
          <span className="text-2xl font-bold text-primary">{totalMinutes}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          минут музыки ({Math.floor(totalMinutes / 60)} часов)
        </p>
      </div>
    </Card>
  );
};

export default StatsChart;
