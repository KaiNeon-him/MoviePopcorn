import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export default function Logo({ size = 'md', showText = true }: LogoProps) {
  const sizes = {
    sm: { icon: 32, text: 'text-lg' },
    md: { icon: 40, text: 'text-xl' },
    lg: { icon: 56, text: 'text-2xl' },
  };

  const { icon, text } = sizes[size];

  return (
    <div className="flex items-center gap-2 group cursor-pointer">
      {/* Popcorn Bucket Film Player Logo */}
      <motion.div
        className="relative"
        whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
        transition={{ duration: 0.4 }}
      >
        <svg
          width={icon}
          height={icon}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Film reel circles at top */}
          <motion.circle
            cx="35"
            cy="18"
            r="12"
            fill="#1a1a2e"
            stroke="#e50914"
            strokeWidth="2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          />
          <motion.circle
            cx="35"
            cy="18"
            r="4"
            fill="#e50914"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          />
          {/* Film reel spokes */}
          <motion.line
            x1="35" y1="10" x2="35" y2="26"
            stroke="#e50914" strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          />
          <motion.line
            x1="27" y1="18" x2="43" y2="18"
            stroke="#e50914" strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.35, duration: 0.3 }}
          />

          <motion.circle
            cx="65"
            cy="18"
            r="12"
            fill="#1a1a2e"
            stroke="#f5c518"
            strokeWidth="2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
          />
          <motion.circle
            cx="65"
            cy="18"
            r="4"
            fill="#f5c518"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.25 }}
          />
          <motion.line
            x1="65" y1="10" x2="65" y2="26"
            stroke="#f5c518" strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.35, duration: 0.3 }}
          />
          <motion.line
            x1="57" y1="18" x2="73" y2="18"
            stroke="#f5c518" strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          />

          {/* Film strip connecting reels */}
          <motion.path
            d="M 47 18 Q 50 12 53 18"
            stroke="#666"
            strokeWidth="3"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          />

          {/* Popcorn bucket body */}
          <motion.path
            d="M 25 35 L 30 90 L 70 90 L 75 35 Z"
            fill="url(#bucketGradient)"
            stroke="#e50914"
            strokeWidth="2"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
            style={{ originY: 1 }}
          />

          {/* Bucket stripes */}
          <motion.path
            d="M 33 35 L 35 90"
            stroke="#fff"
            strokeWidth="2"
            opacity="0.3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.6, duration: 0.3 }}
          />
          <motion.path
            d="M 43 35 L 44 90"
            stroke="#fff"
            strokeWidth="2"
            opacity="0.3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.65, duration: 0.3 }}
          />
          <motion.path
            d="M 57 35 L 56 90"
            stroke="#fff"
            strokeWidth="2"
            opacity="0.3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.7, duration: 0.3 }}
          />
          <motion.path
            d="M 67 35 L 65 90"
            stroke="#fff"
            strokeWidth="2"
            opacity="0.3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.75, duration: 0.3 }}
          />

          {/* Play button on bucket */}
          <motion.path
            d="M 43 55 L 43 72 L 60 63.5 Z"
            fill="#f5c518"
            stroke="#fff"
            strokeWidth="1"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
          />

          {/* Popcorn kernels popping out */}
          <motion.circle
            cx="38"
            cy="30"
            r="5"
            fill="#f5c518"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, type: 'spring' }}
          />
          <motion.circle
            cx="50"
            cy="27"
            r="6"
            fill="#fff"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.95, type: 'spring' }}
          />
          <motion.circle
            cx="62"
            cy="30"
            r="5"
            fill="#f5c518"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.0, type: 'spring' }}
          />
          <motion.circle
            cx="44"
            cy="25"
            r="4"
            fill="#fff"
            opacity="0.8"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 0.8 }}
            transition={{ delay: 1.05, type: 'spring' }}
          />
          <motion.circle
            cx="56"
            cy="25"
            r="4"
            fill="#f5c518"
            opacity="0.8"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 0.8 }}
            transition={{ delay: 1.1, type: 'spring' }}
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient id="bucketGradient" x1="25" y1="35" x2="75" y2="90" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#e50914" />
              <stop offset="50%" stopColor="#b20710" />
              <stop offset="100%" stopColor="#8b0000" />
            </linearGradient>
          </defs>
        </svg>

        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      {/* Text */}
      {showText && (
        <motion.span
          className={`${text} font-black tracking-tight bg-gradient-to-r from-primary via-gold to-primary bg-clip-text text-transparent`}
          style={{ fontFamily: "'Bebas Neue', cursive" }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          MoviePopcorn
        </motion.span>
      )}
    </div>
  );
}
