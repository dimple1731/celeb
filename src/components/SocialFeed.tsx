import React, { useState } from 'react';
import { Twitter, Instagram, Linkedin, MessageSquare, ThumbsUp, Share2, Heart, MessageCircle, Repeat2, Send, Bookmark, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CelebrityProfile } from '../types';

interface SocialFeedProps {
  profile: CelebrityProfile;
}

export default function SocialFeed({ profile }: SocialFeedProps) {
  const [filter, setFilter] = useState<'all' | 'twitter' | 'instagram' | 'linkedin' | 'tiktok'>('all');

  const updates = profile.socialMediaUpdates;
  const filteredUpdates = filter === 'all' 
    ? updates 
    : updates.filter(u => u.platform === filter);

  // Generates interactive high-fidelity mesh backgrounds to simulate image attachments for posts!
  const getSimulatedImageBackground = (platform: string, id: string) => {
    // Generate deterministic colors based on ID characters
    const codes = Array.from(id).map(c => c.charCodeAt(0));
    const h1 = (codes[0] * 5) % 360;
    const h2 = (codes[1] * 7 + 120) % 360;
    const h3 = (codes[2] * 9 + 240) % 360;

    return {
      background: `linear-gradient(135deg, hsl(${h1}, 75%, 35%) 0%, hsl(${h2}, 85%, 25%) 50%, hsl(${h3}, 90%, 15%) 100%)`,
    };
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return <Twitter className="w-4 h-4 text-sky-400" />;
      case 'instagram':
        return <Instagram className="w-4 h-4 text-pink-500" />;
      case 'linkedin':
        return <Linkedin className="w-4 h-4 text-blue-500" />;
      case 'tiktok':
        return (
          <span className="flex items-center justify-center font-bold text-[10px] font-mono text-emerald-400 bg-black w-4 h-4 rounded-full border border-slate-800">
            d
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-6" id="comp-social-feed">
      {/* Platform Filters */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950/60 border border-slate-900 rounded-lg">
        {[
          { key: 'all', label: 'All Feeds' },
          { key: 'twitter', label: 'Twitter/X', icon: <Twitter className="w-3.5 h-3.5" /> },
          { key: 'instagram', label: 'Instagram', icon: <Instagram className="w-3.5 h-3.5" /> },
          { key: 'linkedin', label: 'LinkedIn', icon: <Linkedin className="w-3.5 h-3.5" /> },
          { key: 'tiktok', label: 'TikTok', icon: <Music className="w-3.5 h-3.5" /> }
        ].map((btn) => (
          <button
            key={btn.key}
            onClick={() => setFilter(btn.key as any)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-all ${
              filter === btn.key
                ? 'bg-violet-950/60 text-violet-300 border border-violet-800/80 shadow-sm'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60 border border-transparent'
            }`}
          >
            {btn.icon}
            {btn.label}
          </button>
        ))}
      </div>

      {/* Posts list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout" hmr={false}>
          {filteredUpdates.length === 0 ? (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="col-span-full py-16 bg-slate-950/20 border border-slate-900/50 rounded-xl text-center text-slate-500 italic"
            >
              No updates available for this platform filter.
            </motion.div>
          ) : (
            filteredUpdates.map((post) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, scale: 0.96, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -15 }}
                transition={{ duration: 0.22 }}
                className={`flex flex-col rounded-xl border p-5 ${
                  post.platform === 'twitter' ? 'bg-slate-950/40 border-slate-900' :
                  post.platform === 'instagram' ? 'bg-slate-950/40 border-slate-900' :
                  post.platform === 'linkedin' ? 'bg-slate-950/40 border-slate-900' :
                  'bg-slate-950/40 border-slate-900'
                } hover:border-slate-800 transition-all shadow-md relative overflow-hidden group`}
              >
                {/* Header structure */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    {/* Simulated avatar */}
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-800 border border-slate-750 font-display font-bold text-sm text-violet-400 shadow-inner">
                      {profile.name[0]}
                    </div>
                    <div className="flex flex-col">
                      <h4 className="text-sm font-semibold tracking-tight text-slate-100 flex items-center gap-1.5">
                        {profile.name}
                        {getPlatformIcon(post.platform)}
                      </h4>
                      <span className="text-[11px] font-mono text-slate-500">
                        {post.username}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">
                    {post.timestamp}
                  </span>
                </div>

                {/* Body Content */}
                <p className="text-xs text-slate-300 leading-relaxed break-words whitespace-pre-line mb-3">
                  {post.content}
                </p>

                {/* Simulated Attached Image if applicable */}
                {post.hasImage && (
                  <div 
                    className="aspect-video w-full rounded-lg mb-4 flex flex-col justify-end p-4 relative overflow-hidden group/img cursor-pointer shadow-inner border border-slate-900"
                    style={getSimulatedImageBackground(post.platform, post.id)}
                  >
                    {/* Media ambient overlay content */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-60 group-hover/img:opacity-40 transition-opacity" />
                    
                    {post.platform === 'tiktok' && (
                      <div className="z-10 flex items-center gap-2 text-white/90">
                        <Music className="w-3.5 h-3.5 animate-spin" />
                        <span className="text-[10px] font-mono font-bold tracking-wider uppercase bg-black/60 px-2 py-0.5 rounded backdrop-blur">
                          Original Audio - {profile.name}
                        </span>
                      </div>
                    )}
                    
                    {post.platform === 'instagram' && (
                      <div className="z-10 text-white/85 text-[10px] font-display font-light italic">
                        Captured Moment • Live
                      </div>
                    )}
                  </div>
                )}

                {/* Platform Action Footer */}
                <div className="border-t border-slate-900/60 pt-3 mt-auto flex items-center justify-between text-slate-500 select-none">
                  {post.platform === 'twitter' && (
                    <>
                      <button className="flex items-center gap-1 text-[11px] font-mono hover:text-sky-400 transition-colors cursor-pointer p-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.repliesCount}</span>
                      </button>
                      <button className="flex items-center gap-1 text-[11px] font-mono hover:text-emerald-400 transition-colors cursor-pointer p-1">
                        <Repeat2 className="w-4 h-4" />
                        <span>{post.sharesCount}</span>
                      </button>
                      <button className="flex items-center gap-1 text-[11px] font-mono hover:text-rose-400 transition-colors cursor-pointer p-1">
                        <Heart className="w-4 h-4" />
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center justify-center hover:text-slate-300 transition-colors cursor-pointer p-1">
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}

                  {post.platform === 'instagram' && (
                    <>
                      <div className="flex gap-4">
                        <button className="flex items-center gap-1.5 text-[11px] font-mono hover:text-rose-500 transition-colors cursor-pointer">
                          <Heart className="w-4 h-4" />
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center gap-1.5 text-[11px] font-mono hover:text-slate-300 transition-colors cursor-pointer">
                          <MessageSquare className="w-4 h-4" />
                          <span>{post.repliesCount}</span>
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <button className="hover:text-amber-500 transition-colors cursor-pointer p-1">
                          <Bookmark className="w-4 h-4" />
                        </button>
                        <button className="hover:text-slate-300 transition-colors cursor-pointer p-1">
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}

                  {post.platform === 'linkedin' && (
                    <>
                      <button className="flex items-center gap-1.5 text-xs hover:text-blue-400 transition-colors cursor-pointer p-1.5 rounded hover:bg-slate-900/40">
                        <ThumbsUp className="w-4 h-4" />
                        <span>Like ({post.likes})</span>
                      </button>
                      <button className="flex items-center gap-1.5 text-xs hover:text-slate-300 transition-colors cursor-pointer p-1.5 rounded hover:bg-slate-900/40">
                        <MessageSquare className="w-4 h-4" />
                        <span>Comment ({post.repliesCount})</span>
                      </button>
                      <button className="flex items-center gap-1.5 text-xs hover:text-slate-300 transition-colors cursor-pointer p-1.5 rounded hover:bg-slate-900/40">
                        <Share2 className="w-4 h-4" />
                        <span>Share ({post.sharesCount})</span>
                      </button>
                    </>
                  )}

                  {post.platform === 'tiktok' && (
                    <>
                      <button className="flex items-center gap-1 text-[11px] font-mono hover:text-pink-500 transition-colors cursor-pointer p-1">
                        <Heart className="w-4 h-4" />
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-1 text-[11px] font-mono hover:text-sky-450 transition-colors cursor-pointer p-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.repliesCount}</span>
                      </button>
                      <button className="flex items-center gap-1 text-[11px] font-mono hover:text-emerald-400 transition-colors cursor-pointer p-1">
                        <Share2 className="w-4 h-4" />
                        <span>{post.sharesCount}</span>
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
