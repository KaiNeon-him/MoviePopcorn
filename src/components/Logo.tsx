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
      {/* Popcorn Projector Logo */}
      <motion.div
        className="relative"
        whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
        transition={{ duration: 0.4 }}
      >
        <img
          src="/logo-popcorn-projector.svg"
          alt="MoviePopcorn"
          width={icon}
          height={icon}
          className="rounded-lg"
        />

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
