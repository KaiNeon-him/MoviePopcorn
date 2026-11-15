import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, X, ShieldCheck } from 'lucide-react';

export default function AdBlockerDetector() {
  const [showNotice, setShowNotice] = useState(false);
  const [blockedCount, setBlockedCount] = useState(0);
  const [protectionOn, setProtectionOn] = useState(true);

  useEffect(() => {
    const originalOpen = window.open.bind(window);
    window.open = function (...args: Parameters<typeof window.open>) {
      if (!protectionOn) return originalOpen(...args);
      const url = String(args[0] ?? '');
      try {
        if (url && (url.startsWith('/') || url.startsWith(window.location.origin))) {
          return originalOpen(...args);
        }
      } catch {}
      setBlockedCount((c) => c + 1);
      return null;
    };

    const bait = document.createElement('div');
    bait.className = 'adsbox ad-banner adsbygoogle';
    bait.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;';
    document.body.appendChild(bait);
    requestAnimationFrame(() => {
      if ((!bait.offsetParent || bait.offsetHeight === 0) && !sessionStorage.getItem('mp_adblock_notice_dismissed')) {
        setShowNotice(true);
      }
      bait.remove();
    });

    return () => {
      window.open = originalOpen;
    };
  }, [protectionOn]);

  return (
    <>
      <AnimatePresence>
        {blockedCount > 0 && protectionOn && (
          <motion.div className="fixed bottom-4 left-4 z-[90]" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-dark-lighter/95 border border-emerald-500/30 shadow-xl backdrop-blur-md">
              <ShieldCheck size={16} className="text-emerald-400" />
              <p className="text-xs text-white/80">Blocked {blockedCount} popup{blockedCount > 1 ? 's' : ''}</p>
              <button onClick={() => setBlockedCount(0)} className="p-1 rounded hover:bg-white/10 text-white/50"><X size={12} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showNotice && (
          <motion.div className="fixed bottom-4 right-4 z-[90] max-w-sm" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="rounded-2xl bg-dark-lighter/95 border border-white/10 shadow-2xl backdrop-blur-md p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-primary/15 border border-primary/30"><Shield size={18} className="text-primary" /></div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white mb-1">Protection active</p>
                  <p className="text-xs text-white/60">Popups on this page are blocked. Use a browser ad blocker for ads inside third-party players.</p>
                  <button onClick={() => setProtectionOn((v) => !v)} className="mt-2 text-[11px] text-primary hover:underline">{protectionOn ? 'Pause shield' : 'Resume shield'}</button>
                </div>
                <button onClick={() => { setShowNotice(false); sessionStorage.setItem('mp_adblock_notice_dismissed', '1'); }} className="p-1 rounded-lg hover:bg-white/10"><X size={16} className="text-white/50" /></button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
