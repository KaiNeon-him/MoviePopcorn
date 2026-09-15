import { useState } from 'react';
import { motion } from 'framer-motion';
import { User as UserIcon, Mail, Lock, Camera, Save, Check, X, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWatchHistory } from '../hooks/useWatchHistory';
import { useWatchlist } from '../hooks/useWatchlist';
import { useNotifications } from '../components/NotificationToast';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { history } = useWatchHistory();
  const { watchlist } = useWatchlist();
  const { success, error: showError } = useNotifications();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [error, setError] = useState('');

  const handleSave = () => {
    setError('');
    
    if (!name.trim()) {
      setError('Name cannot be empty');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (newPassword || confirmPassword) {
      if (newPassword.length < 8) {
        setError('New password must be at least 8 characters');
        return;
      }
      if (newPassword !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      // In a real app, you'd verify currentPassword here
    }

    updateUser({ name, email });
    setIsEditing(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    success('Profile Updated', 'Your profile has been updated successfully');
  };

  const handleCancel = () => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsEditing(false);
    setError('');
  };

  const initials = user?.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  }) : 'Recently';

  return (
    <motion.div
      className="min-h-screen bg-dark pt-24 px-4 sm:px-8 lg:px-12 pb-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Profile
          </h1>
          <p className="text-white/50 text-sm">Manage your account settings and preferences</p>
        </motion.div>

        {/* Error message */}
        {error && (
          <motion.div
            className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center gap-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
              <X size={14} strokeWidth={3} className="text-red-400" />
            </div>
            <p className="text-sm text-red-300 font-medium">{error}</p>
          </motion.div>
        )}

        {/* Profile card */}
        <motion.div
          className="bg-white/[0.03] border border-white/[0.08] rounded-3xl p-6 sm:p-8 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Avatar section */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 pb-8 border-b border-white/[0.06]">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-gold flex items-center justify-center text-white text-2xl font-bold shadow-xl shadow-primary/20">
                {initials}
              </div>
              <button className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={24} strokeWidth={2} className="text-white" />
              </button>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-white mb-1">{user?.name}</h2>
              <p className="text-white/50 text-sm mb-3">{user?.email}</p>
              <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
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
                  <p className="text-sm font-semibold text-white">{watchlist.length} titles</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form fields */}
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-2 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <UserIcon size={18} strokeWidth={2} className="text-white/40" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditing}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/[0.06] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-2 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Mail size={18} strokeWidth={2} className="text-white/40" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditing}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/[0.06] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Password change section */}
            {isEditing && (
              <motion.div
                className="space-y-4 pt-6 border-t border-white/[0.06]"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider">
                  Change Password (Optional)
                </h3>

                {/* Current Password */}
                <div className="relative">
                  <label className="block text-xs text-white/50 mb-2">Current Password</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Lock size={18} strokeWidth={2} className="text-white/40" />
                    </div>
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-12 pr-12 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/[0.06] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(!showPasswords)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                    >
                      {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="relative">
                  <label className="block text-xs text-white/50 mb-2">New Password</label>
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/[0.06] transition-all"
                  />
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <label className="block text-xs text-white/50 mb-2">Confirm New Password</label>
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/[0.06] transition-all"
                  />
                  {newPassword && confirmPassword && newPassword === confirmPassword && (
                    <p className="mt-2 text-xs text-green-400 flex items-center gap-1.5">
                      <Check size={12} strokeWidth={3} />
                      Passwords match
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-white/[0.06]">
            {isEditing ? (
              <>
                <motion.button
                  onClick={handleSave}
                  className="flex-1 group relative py-3.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-semibold text-sm overflow-hidden shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Save size={18} strokeWidth={2.5} />
                    Save Changes
                  </span>
                </motion.button>
                <motion.button
                  onClick={handleCancel}
                  className="px-6 py-3.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white/70 hover:bg-white/[0.1] hover:text-white font-semibold text-sm transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
              </>
            ) : (
              <motion.button
                onClick={() => setIsEditing(true)}
                className="flex-1 group relative py-3.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-semibold text-sm overflow-hidden shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <span className="relative z-10">Edit Profile</span>
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
