import { motion } from 'framer-motion';

export default function LoveLetter() {
    return (
        <section className="py-20 px-4 bg-soft-pink flex justify-center">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-2xl bg-white p-8 md:p-12 rounded-lg shadow-2xl relative"
            >
                {/* Decorative elements */}
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-love-red rounded-full opacity-20" />
                <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-gold rounded-full opacity-20" />

                <h3 className="text-3xl font-serif text-deep-maroon mb-6">Dear Meghan,</h3>

                <div className="prose prose-lg text-gray-700 font-serif leading-relaxed space-y-4">
                    <p>
                        Five years ago, we started this incredible journey together. Every day since then has been a gift.
                    </p>
                    <p>
                        Looking through all these photos, I'm reminded of how much we've grown, the places we've seen, and the love that has only gotten stronger.
                    </p>
                    <p>
                        You are my best friend, my partner, and the love of my life. Here's to five years, and to a lifetime more of making memories.
                    </p>
                    <p className="font-bold text-love-red mt-8">
                        I love you, forever and always.
                    </p>
                    <p className="text-right mt-4 text-deep-maroon font-bold">
                        - Mikey
                    </p>
                </div>
            </motion.div>
        </section>
    );
}
