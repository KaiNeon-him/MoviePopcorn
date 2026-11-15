import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { User as UserIcon, Mail, Lock, Camera, Save, Check, X, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWatchHistory } from '../hooks/useWatchHistory';
import { useWatchlist } from '../hooks/useWatchlist';
import { useNotifications } from '../components/NotificationToast';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { history } = useWatchHistory();
  const { watchlist } = useWatchlist();
  const { success, error: showError } = useNotifications();

  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showError('Invalid file', 'Please choose an image file');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showError('File too large', 'Please use an image under 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      updateUser({ avatar: dataUrl });
      success('Photo updated', 'Your profile picture has been saved');
    };
    reader.onerror = () => showError('Upload failed', 'Could not read that image');
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-white/60">Sign in to manage your profile</p>
        <Link to="/login" className="px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold">Sign In</Link>
      </div>
    );
  }

  const initials = (user.name || 'U').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  const memberSince = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—';

  const handleSave = () => {
    updateUser({ name: name.trim() || user.name, email: email.trim() || user.email });
    setIsEditing(false);
    success('Profile updated', 'Your changes have been saved');
  };

  return (
    <motion.div className="min-h-screen bg-dark pt-24 px-4 sm:px-8 lg:px-12 pb-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8" style={{ fontFamily: "'Outfit', sans-serif" }}>Profile</h1>

        <div className="bg-dark-lighter/40 border border-white/[0.06] rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 pb-8 border-b border-white/[0.06]">
            <div className="relative group">
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full object-cover shadow-xl shadow-primary/20 ring-2 ring-white/10" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-gold flex items-center justify-center text-white text-2xl font-bold shadow-xl shadow-primary/20">
                  {initials}
                </div>
              )}
              <button type="button" onClick={handleAvatarClick} className="absolute inset-0 rounded-full bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera size={22} strokeWidth={2} className="text-white" />
                <span className="text-[10px] text-white/90 mt-1 font-medium">Change</span>
              </button>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
              <p className="text-white/50 text-sm mb-3">{user.email}</p>
              <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                <div className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                  <p className="text-xs text-white/40 mb-0.5">Member Since</p>
                  <p className="text-sm font-semibold text-white">{memberSince}</p>
                </div>
                <div className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                  <p className="text-xs text-white/40 mb-0.5">Watched</p>
                  <p className="text-sm font-semibold text-white">{history.length} titles</p>
                </div>
                <div className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                  <p className="text-xs text-white/40 mb-0.5">Watchlist</p>
                  <p className="text-sm font-semibold text-white">{watchlist.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Account details</h3>
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="text-sm text-primary hover:underline">Edit</button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => { setIsEditing(false); setName(user.name); setEmail(user.email); }} className="p-2 rounded-lg hover:bg-white/10"><X size={16} /></button>
                  <button onClick={handleSave} className="p-2 rounded-lg bg-primary text-white"><Check size={16} /></button>
                </div>
              )}
            </div>

            <div className="grid gap-4">
              <label className="block">
                <span className="text-xs text-white/40 flex items-center gap-1 mb-1"><UserIcon size={12} /> Name</span>
                <input
                  disabled={!isEditing}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm disabled:opacity-60 focus:outline-none focus:border-primary/40"
                />
              </label>
              <label className="block">
                <span className="text-xs text-white/40 flex items-center gap-1 mb-1"><Mail size={12} /> Email</span>
                <input
                  disabled={!isEditing}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm disabled:opacity-60 focus:outline-none focus:border-primary/40"
                />
              </label>
            </div>

            <p className="text-xs text-white/30 pt-4 flex items-center gap-1"><Lock size={12} /> Password changes are not available in this demo build.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
