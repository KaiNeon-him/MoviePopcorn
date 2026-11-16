import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export default function Logo({ size = 'md', showText = true }: LogoProps) {
  const sizes = {
    sm: { icon: 36, text: 'text-xl' },
    md: { icon: 42, text: 'text-2xl' },
    lg: { icon: 56, text: 'text-3xl' },
  };

  const { icon, text } = sizes[size];

  return (
    <div className="flex items-center gap-2.5 group cursor-pointer">
      <motion.div
        className="relative flex-shrink-0"
        whileHover={{ scale: 1.06 }}
        transition={{ duration: 0.25 }}
      >
        <img
          src="/logo-popcorn-projector.svg"
          alt=""
          width={icon}
          height={icon}
          className="rounded-lg block relative z-10"
          onError={(e) => {
            // Fallback if SVG fails to load
            const el = e.currentTarget;
            el.style.display = 'none';
            const fallback = el.nextElementSibling as HTMLElement | null;
            if (fallback) fallback.style.display = 'flex';
          }}
        />
        <div
          className="hidden items-center justify-center rounded-lg bg-primary text-white font-black relative z-10"
          style={{ width: icon, height: icon, fontSize: icon * 0.4 }}
          aria-hidden
        >
          MP
        </div>
        <div className="absolute inset-0 rounded-lg bg-primary/25 blur-lg opacity-60 group-hover:opacity-90 transition-opacity" />
      </motion.div>

      {showText && (
        <span
          className={`${text} font-black tracking-wide leading-none`}
          style={{
            fontFamily: "'Bebas Neue', 'Arial Black', Impact, sans-serif",
            background: 'linear-gradient(90deg, #e50914 0%, #f5c518 50%, #e50914 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          MoviePopcorn
        </span>
      )}
    </div>
  );
}
