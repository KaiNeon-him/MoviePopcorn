import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, Bell } from 'lucide-react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
}

interface NotificationContextType {
  notify: (notification: Omit<Notification, 'id'>) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const remove = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const notify = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newNotification = { ...notification, id };
    setNotifications(prev => [...prev, newNotification]);

    const duration = notification.duration ?? 4000;
    setTimeout(() => remove(id), duration);
  }, [remove]);

  const success = (title: string, message?: string) => notify({ type: 'success', title, message });
  const error = (title: string, message?: string) => notify({ type: 'error', title, message });
  const info = (title: string, message?: string) => notify({ type: 'info', title, message });
  const warning = (title: string, message?: string) => notify({ type: 'warning', title, message });

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: Bell,
  };

  const colors = {
    success: 'from-green-500/20 to-green-500/5 border-green-500/30',
    error: 'from-red-500/20 to-red-500/5 border-red-500/30',
    info: 'from-blue-500/20 to-blue-500/5 border-blue-500/30',
    warning: 'from-yellow-500/20 to-yellow-500/5 border-yellow-500/30',
  };

  const iconColors = {
    success: 'text-green-400',
    error: 'text-red-400',
    info: 'text-blue-400',
    warning: 'text-yellow-400',
  };

  return (
    <NotificationContext.Provider value={{ notify, success, error, info, warning }}>
      {children}
      
      {/* Toast container */}
      <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2 pointer-events-none max-w-sm">
        <AnimatePresence>
          {notifications.map((notification) => {
            const Icon = icons[notification.type];
            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: 100, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className={`pointer-events-auto bg-gradient-to-r ${colors[notification.type]} backdrop-blur-xl border rounded-2xl p-4 shadow-2xl`}
              >
                <div className="flex items-start gap-3">
                  <Icon size={20} strokeWidth={2.5} className={iconColors[notification.type]} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">{notification.title}</p>
                    {notification.message && (
                      <p className="text-xs text-white/60 mt-0.5">{notification.message}</p>
                    )}
                  </div>
                  <button
                    onClick={() => remove(notification.id)}
                    className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <X size={14} strokeWidth={2.5} className="text-white/60" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
