import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

type Notification = {
  id: number;
  type: 'concert' | 'friend' | 'achievement' | 'new_music';
  title: string;
  message: string;
  time: string;
  unread: boolean;
};

type NotificationsProps = {
  notifications: Notification[];
  onClose: () => void;
  onMarkRead: (id: number) => void;
};

const Notifications = ({ notifications, onClose, onMarkRead }: NotificationsProps) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'concert': return 'Calendar';
      case 'friend': return 'UserPlus';
      case 'achievement': return 'Trophy';
      case 'new_music': return 'Music';
      default: return 'Bell';
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'concert': return 'text-accent';
      case 'friend': return 'text-secondary';
      case 'achievement': return 'text-primary';
      case 'new_music': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <Card className="bg-card border-primary/20 p-6 max-w-md w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold">Уведомления</h3>
            {notifications.filter(n => n.unread).length > 0 && (
              <p className="text-sm text-muted-foreground">
                {notifications.filter(n => n.unread).length} непрочитанных
              </p>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="Bell" size={64} className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Нет уведомлений</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map(notification => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  notification.unread ? 'bg-muted/80' : 'bg-muted/40'
                }`}
                onClick={() => onMarkRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full bg-background flex items-center justify-center ${getColor(notification.type)}`}>
                    <Icon name={getIcon(notification.type) as any} size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-semibold">{notification.title}</p>
                      {notification.unread && (
                        <Badge className="bg-primary text-black border-0 ml-2">New</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Notifications;
