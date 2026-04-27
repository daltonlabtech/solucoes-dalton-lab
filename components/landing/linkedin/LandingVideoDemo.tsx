'use client';

import { useSyncExternalStore } from 'react';
import Image from 'next/image';

const VIDEO_SRC = '/videos/linkedin-demo.mp4';
const POSTER_SRC = '/videos/linkedin-demo-poster.jpg';

function subscribeReduceMotion(callback: () => void) {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  mq.addEventListener('change', callback);
  return () => mq.removeEventListener('change', callback);
}

function getReduceMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getReduceMotionServer() {
  return false;
}

export default function LandingVideoDemo() {
  const reduceMotion = useSyncExternalStore(
    subscribeReduceMotion,
    getReduceMotion,
    getReduceMotionServer
  );

  return (
    <section className="py-20 px-6" style={{ background: '#F8FAFC' }}>
      <div className="max-w-4xl mx-auto">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#94A3B8] mb-14">
          Como funciona
        </p>

        <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video bg-black">
          {reduceMotion ? (
            <Image
              src={POSTER_SRC}
              alt="Demo do gerador de posts LinkedIn da Dalton Lab"
              fill
              className="object-cover"
              priority
            />
          ) : (
            <video
              src={VIDEO_SRC}
              poster={POSTER_SRC}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>
    </section>
  );
}
