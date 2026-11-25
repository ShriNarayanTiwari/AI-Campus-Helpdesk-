import React, { useEffect, useRef, useState } from 'react';
import { Building2 } from 'lucide-react';

interface SafeImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
  eager?: boolean;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  fallbackTitle,
  eager = false,
}) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setFailed(false);
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth > 0) {
      setLoaded(true);
    } else {
      setLoaded(false);
    }
  }, [src]);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#0B1D3A] via-[#133263] to-[#0E5E6F] text-white/90 p-6 ${className}`}
      >
        <Building2 className="w-8 h-8 mb-2 text-teal-300" aria-hidden="true" />
        <span className="text-xs font-medium text-center text-slate-200 max-w-[200px]">
          {fallbackTitle ?? alt}
        </span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-[#0B1D3A] via-[#133263] to-[#0E5E6F]">
      {/* Architectural backdrop prevents blank flashes or layout shift while decoding */}
      <svg
        viewBox="0 0 400 260"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        className={`absolute inset-0 w-full h-full transition-opacity duration-200 pointer-events-none ${
          loaded ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <defs>
          <linearGradient id="heroBackdropGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0B1D3A" />
            <stop offset="55%" stopColor="#133263" />
            <stop offset="100%" stopColor="#0E5E6F" />
          </linearGradient>
        </defs>
        <rect width="400" height="260" fill="url(#heroBackdropGrad)" />
        <rect x="44" y="102" width="120" height="128" rx="4" fill="#1E3A8A" fillOpacity="0.4" />
        <rect x="180" y="76" width="176" height="154" rx="4" fill="#0F766E" fillOpacity="0.32" />
        <line x1="0" y1="230" x2="400" y2="230" stroke="#5EEAD4" strokeOpacity="0.25" strokeWidth="2" />
      </svg>

      <img
        ref={imgRef}
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={`${className} transition-opacity duration-200 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        loading={eager ? 'eager' : 'lazy'}
        decoding={eager ? 'sync' : 'async'}
        fetchPriority={eager ? 'high' : undefined}
      />
    </div>
  );
};
