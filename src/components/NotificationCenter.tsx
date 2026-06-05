import React, { useState, useEffect, useRef } from 'react';
import { Bell, BellRing, Volume2, VolumeX, X, Flame, ShieldAlert, Award, Radio, Trash2, CheckCircle2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NewsNotification, CelebrityProfile } from '../types';

interface NotificationCenterProps {
  currentProfile: CelebrityProfile | null;
  notifications: NewsNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<NewsNotification[]>>;
}

export default function NotificationCenter({
  currentProfile,
  notifications,
  setNotifications
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeToasts, setActiveToasts] = useState<NewsNotification[]>([]);
  const triggeredAlertIds = useRef<Set<string>>(new Set());

  // Trigger synth sound for news alerts
  const playAlertSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      // Quick dual tone chime
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc1.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      
      osc2.frequency.setValueAtTime(392.00, ctx.currentTime); // G4
      osc2.frequency.setValueAtTime(523.25, ctx.currentTime + 0.1); // C5
      
      gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      
      osc1.start(ctx.currentTime);
      osc2.start(ctx.currentTime);
      
      osc1.stop(ctx.currentTime + 0.4);
      osc2.stop(ctx.currentTime + 0.4);
    } catch (e) {
      console.warn("Audio Context blocked or not supported:", e);
    }
  };

  // Add news alert to general lists and active toast
  const triggerNotification = (alert: any, celebName: string) => {
    const newNotif: NewsNotification = {
      id: alert.id,
      celebrityName: celebName,
      title: alert.title,
      summary: alert.summary,
      source: alert.source,
      timestamp: new Date(),
      timeAgo: alert.timeAgo || 'Just Now',
      category: alert.category,
      importance: alert.importance,
      read: false,
    };

    setNotifications(prev => [newNotif, ...prev]);
    setActiveToasts(prev => [newNotif, ...prev]);
    playAlertSound();

    // Auto clear toast after 6 seconds
    setTimeout(() => {
      setActiveToasts(prev => prev.filter(t => t.id !== newNotif.id));
    }, 6000);
  };

  // Simulated real-time triggers for celebrity news
  useEffect(() => {
    if (!currentProfile) return;

    // Reset triggered IDs for new celebrity searches
    triggeredAlertIds.current.clear();

    const alerts = currentProfile.newsAlerts;
    if (!alerts || alerts.length === 0) return;

    // Trigger immediate alert for the first news item
    const firstAlert = alerts[0];
    if (firstAlert && !triggeredAlertIds.current.has(firstAlert.id)) {
      triggeredAlertIds.current.add(firstAlert.id);
      // Wait a slight delay initially for a smooth introduction
      const timer = setTimeout(() => {
        triggerNotification(firstAlert, currentProfile.name);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentProfile]);

  // Handle subsequent news alerts on timers
  useEffect(() => {
    if (!currentProfile) return;
    const alerts = currentProfile.newsAlerts;
    if (!alerts || alerts.length <= 1) return;

    // Schedule subsequent news items (e.g. item 2 after 25s, item 3 after 60s)
    const timers: NodeJS.Timeout[] = [];

    alerts.slice(1).forEach((alert, index) => {
      const delay = (index + 1) * 25000; // Trigger alert every 25 seconds
      const timer = setTimeout(() => {
        if (!triggeredAlertIds.current.has(alert.id)) {
          triggeredAlertIds.current.add(alert.id);
          triggerNotification(alert, currentProfile.name);
        }
      }, delay);
      timers.push(timer);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [currentProfile]);

  // Global manual alert simulator to make the feed feel ultra robust and active
  const triggerManualSimulatedAlert = () => {
    if (!currentProfile) return;
    const topics = [
      { title: "Trending #1 Globally in Entertainment", summary: "Social engagement metrics spike 300% as fans praise recent achievements in historic retro trends.", source: "MetaMetrics", category: "trending", importance: "low" },
      { title: "Special Commemorative Feature Documentary greenlit", summary: "A major streaming network announces a new multi-part biopic series tracking career struggles and early life.", source: "Variety", category: "announcement", importance: "medium" },
      { title: "Rare archive footage rediscovered", summary: "Historians unearth interview footage from early career milestones showing unprecedented foresight.", source: "BBC News", category: "trending", importance: "low" },
      { title: "Philanthropic foundation reaches landmark milestone", summary: "A global endowment initiative inspired by their legacy crosses major funding targets to help education.", source: "Forbes Prestige", category: "achievement", importance: "high" }
    ];

    const randomTrack = topics[Math.floor(Math.random() * topics.length)];
    const mockAlert = {
      id: `sim-${Date.now()}`,
      title: `${currentProfile.name}: ${randomTrack.title}`,
      summary: randomTrack.summary,
      source: randomTrack.source,
      category: randomTrack.category as any,
      importance: randomTrack.importance as any
    };

    triggerNotification(mockAlert, currentProfile.name);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'breaking':
        return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case 'achievement':
        return <Award className="w-4 h-4 text-amber-400" />;
      case 'trending':
        return <Flame className="w-4 h-4 text-orange-400" />;
      case 'announcement':
        return <Radio className="w-4 h-4 text-cyan-400" />;
      default:
        return <Info className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <>
      {/* Search Header / Floating Bell button */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`p-2 rounded-lg border transition-all cursor-pointer ${
            soundEnabled
              ? 'bg-violet-950/40 border-violet-800 text-violet-300 hover:bg-violet-900/40'
              : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-400'
          }`}
          title={soundEnabled ? "Mute Alert Audio" : "Unmute Alert Audio"}
          id="btn-toggle-notif-audio"
        >
          {soundEnabled ? <Volume2 className="w-5 h-5 animate-pulse" /> : <VolumeX className="w-5 h-5" />}
        </button>

        <button
          onClick={() => setIsOpen(true)}
          className="relative p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-violet-700 text-slate-100 rounded-lg transition-all cursor-pointer"
          title="Open Notification Feed"
          id="btn-open-notifications"
        >
          {unreadCount > 0 ? (
            <BellRing className="w-5 h-5 text-violet-400 animate-bounce" />
          ) : (
            <Bell className="w-5 h-5 text-slate-400 hover:text-indigo-400" />
          )}
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-lg animate-pulse ring-2 ring-slate-950">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Floating real-time alert toast banner */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {activeToasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
              className="bg-slate-950/95 border-l-4 border-l-violet-500 border border-violet-900/60 p-4 rounded-lg shadow-2xl flex flex-col gap-1 text-slate-100 pointer-events-auto backdrop-blur-md relative overflow-hidden"
            >
              {/* Highlight flash background for high priority */}
              {toast.importance === 'high' && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-xl pointer-events-none" />
              )}
              
              <div className="flex justify-between items-start gap-4">
                <span className="flex items-center gap-1.5 text-[10px] font-mono tracking-wider font-bold uppercase text-violet-400">
                  {getCategoryIcon(toast.category)}
                  {toast.category} • {toast.importance === 'high' ? 'CRITICAL' : 'NEWS'}
                </span>
                <button
                  onClick={() => setActiveToasts(prev => prev.filter(t => t.id !== toast.id))}
                  className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <h4 className="text-sm font-semibold tracking-tight text-white mt-1">
                {toast.title}
              </h4>
              <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                {toast.summary}
              </p>

              <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mt-2">
                <span>Source: {toast.source}</span>
                <span>Just Now</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* News History Drawer Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-950 z-40 cursor-pointer"
            />

            {/* Sidebar drawer container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-slate-900 border-l border-slate-800 p-6 shadow-2xl z-50 flex flex-col justify-between"
            >
              {/* Drawer layout */}
              <div className="flex flex-col flex-1 overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-850 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-violet-400" />
                    <h2 className="text-lg font-display font-medium text-slate-100">
                      Celebrity News Alerts
                    </h2>
                    {unreadCount > 0 && (
                      <span className="bg-violet-900 border border-violet-700 text-violet-200 text-xs px-2 py-0.5 rounded-full font-bold font-mono">
                        {unreadCount} New
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Simulated action control header bar if celebrity loaded */}
                {currentProfile ? (
                  <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-lg mb-4 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono text-slate-500 tracking-wider">REAL-TIME MONITOR</span>
                      <span className="text-xs font-semibold text-violet-300">{currentProfile.name}</span>
                    </div>
                    <button
                      onClick={triggerManualSimulatedAlert}
                      className="text-xs font-semibold bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white px-2.5 py-1.5 rounded-md transition-all cursor-pointer shadow-md shadow-violet-950/40"
                    >
                      Trigger New Alert
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 mb-4 text-center italic">Search for a celebrity to monitor live news alerts.</p>
                )}

                {/* Action buttons (Clear/Read) */}
                {notifications.length > 0 && (
                  <div className="flex justify-between items-center gap-2 mb-4">
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-xs font-medium text-slate-400 hover:text-violet-400 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Mark all as read
                    </button>
                    <button
                      onClick={handleClearAll}
                      className="text-xs font-medium text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Clear all
                    </button>
                  </div>
                )}

                {/* News lists with scrolling */}
                <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3">
                  <AnimatePresence hmr={false}>
                    {notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center text-center py-16 text-slate-600">
                        <Bell className="w-12 h-12 stroke-[1] mb-2 opacity-50" />
                        <p className="text-sm font-medium">No alerts received yet</p>
                        <p className="text-xs max-w-[200px] mt-1">Real-time alerts appear here when searching for popular icons</p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <motion.div
                          key={notif.id}
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          onClick={() => handleMarkAsRead(notif.id)}
                          className={`p-4 rounded-lg border transition-all relative flex flex-col gap-1.5 ${
                            notif.read
                              ? 'bg-slate-900/40 border-slate-850/60 hover:bg-slate-850/40'
                              : 'bg-slate-850 border-violet-900/60 hover:bg-slate-800 shadow-md ring-1 ring-violet-500/10'
                          } cursor-pointer`}
                        >
                          {/* Unread indicator dot */}
                          {!notif.read && (
                            <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                          )}

                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1 text-[9px] font-mono tracking-wider font-bold uppercase text-violet-400">
                              {getCategoryIcon(notif.category)}
                              {notif.category}
                            </span>
                            <span className="text-[9px] font-mono text-slate-500">•</span>
                            <span className="bg-slate-950/60 border border-slate-800 text-slate-400 text-[9px] font-mono px-1.5 py-0.5 rounded">
                              {notif.celebrityName}
                            </span>
                          </div>

                          <h4 className="text-sm font-semibold tracking-tight text-slate-100 pr-4 mt-0.5">
                            {notif.title}
                          </h4>
                          <p className="text-xs text-slate-400">
                            {notif.summary}
                          </p>

                          <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mt-1">
                            <span>{notif.source}</span>
                            <span>{notif.timeAgo || 'Just Now'}</span>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Ticker footer */}
              <div className="border-t border-slate-850 pt-4 mt-4 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>Monitoring engine active</span>
                <span className="flex items-center gap-1 text-emerald-400 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  LIVE
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
