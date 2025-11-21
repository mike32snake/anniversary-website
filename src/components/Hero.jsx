import { motion } from 'framer-motion';

export default function Hero() {
    return (
        <section className="h-screen flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-soft-pink to-white -z-10" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="z-10"
            >
                <h1 className="text-5xl md:text-7xl font-bold text-love-red mb-4 drop-shadow-sm">
                    Happy 5th Anniversary
                </h1>
                <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-3xl md:text-5xl text-deep-maroon font-serif italic"
                >
                    Meghan
                </motion.h2>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-10 animate-bounce"
            >
                <p className="text-deep-maroon text-lg">Scroll for our memories</p>
                <svg className="w-6 h-6 mx-auto mt-2 text-love-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </motion.div>
        </section>
    );
}
