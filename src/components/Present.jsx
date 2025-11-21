import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import RingBox3D from './RingBox3D';

const Present = () => {
  const containerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showRing, setShowRing] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > 0.2) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }

    if (latest > 0.4) {
      setShowRing(true);
    } else {
      setShowRing(false);
    }
  });

  return (
    <div ref={containerRef} className="h-[200vh] relative bg-stone-50">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">

        {/* 3D Box Container */}
        <div className="relative w-full h-full">
          <RingBox3D isOpen={isOpen} showRing={showRing} />
        </div>

        <div className="absolute bottom-20 text-center z-10 pointer-events-none">
          <motion.div
            style={{ opacity: useTransform(scrollYProgress, [0.6, 0.7], [0, 1]) }}
            className="space-y-4"
          >
            <p className="text-4xl md:text-6xl font-serif text-stone-800 tracking-widest">
              FOREVER YOURS
            </p>
            <p className="text-stone-500 font-light tracking-[0.2em] text-sm">
              HAPPY 5TH ANNIVERSARY
            </p>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default Present;

