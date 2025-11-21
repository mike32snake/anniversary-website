import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import images from '../images.json';

export default function Gallery() {
    // Shuffle images for variety on each load, or just use them as is. 
    // Let's just take a subset if there are too many (316 is a lot for one page load without virtualization).
    // For now, let's show the first 50 and maybe add a "Load More" or just show all if performance allows.
    // 316 images might be heavy. Let's implement a simple visible limit.

    const [visibleImages, setVisibleImages] = useState([]);

    useEffect(() => {
        // Randomize and pick 50 initially
        const shuffled = [...images].sort(() => 0.5 - Math.random());
        setVisibleImages(shuffled.slice(0, 50));
    }, []);

    return (
        <section className="py-20 px-4 bg-white">
            <h3 className="text-4xl font-serif text-center text-deep-maroon mb-12">Our Journey Together</h3>

            <div className="columns-1 md:columns-3 lg:columns-4 gap-4 space-y-4 max-w-7xl mx-auto">
                {visibleImages.map((src, index) => (
                    <motion.div
                        key={src}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="break-inside-avoid"
                    >
                        <img
                            src={src}
                            alt="Memory"
                            className="w-full rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                            loading="lazy"
                        />
                    </motion.div>
                ))}
            </div>

            <div className="text-center mt-12">
                <p className="text-gray-500 italic">...and hundreds more memories.</p>
            </div>
        </section>
    );
}
