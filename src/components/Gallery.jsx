import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import images from '../images.json';

// Import gallery images dynamically
const galleryImages = import.meta.glob('/public/gallery/*.{jpg,jpeg,JPG,PNG}', {
    eager: false,
    as: 'url'
});

export default function Gallery() {
    const [visibleImages, setVisibleImages] = useState([]);
    const [allImages, setAllImages] = useState([]);
    const [loadedCount, setLoadedCount] = useState(50);

    useEffect(() => {
        // Combine featured images and gallery images
        const galleryPaths = Object.keys(galleryImages).map(path =>
            path.replace('/public', '')
        );

        const combined = [...images, ...galleryPaths];

        // Shuffle for variety
        const shuffled = combined.sort(() => 0.5 - Math.random());
        setAllImages(shuffled);
        setVisibleImages(shuffled.slice(0, 50));
    }, []);

    const loadMore = () => {
        const newCount = loadedCount + 30;
        setVisibleImages(allImages.slice(0, newCount));
        setLoadedCount(newCount);
    };

    return (
        <section className="py-20 px-4 bg-white">
            <h3 className="text-4xl font-serif text-center text-deep-maroon mb-12">Our Journey Together</h3>

            <div className="columns-1 md:columns-3 lg:columns-4 gap-4 space-y-4 max-w-7xl mx-auto">
                {visibleImages.map((src, index) => (
                    <motion.div
                        key={src}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "100px" }}
                        transition={{ duration: 0.5 }}
                        className="break-inside-avoid"
                    >
                        <img
                            src={src}
                            alt="Memory"
                            className="w-full rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                            loading="lazy"
                            decoding="async"
                        />
                    </motion.div>
                ))}
            </div>

            {visibleImages.length < allImages.length && (
                <div className="text-center mt-12">
                    <button
                        onClick={loadMore}
                        className="px-8 py-3 bg-love-red text-white rounded-full font-sans hover:bg-deep-maroon transition-colors duration-300"
                    >
                        Load More Memories ({allImages.length - visibleImages.length} remaining)
                    </button>
                </div>
            )}

            {visibleImages.length === allImages.length && allImages.length > 0 && (
                <div className="text-center mt-12">
                    <p className="text-gray-500 italic">All {allImages.length} memories loaded ❤️</p>
                </div>
            )}
        </section>
    );
}
