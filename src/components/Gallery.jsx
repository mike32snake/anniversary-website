import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import images from '../images.json';

export default function Gallery() {
    const [visibleImages, setVisibleImages] = useState([]);

    useEffect(() => {
        // Use only the curated images from images.json (date-named images)
        setVisibleImages(images);
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
                        whileHover={{ scale: 1.05 }}
                        viewport={{ once: true, margin: "100px" }}
                        transition={{ duration: 0.3 }}
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

            <div className="text-center mt-12">
                <p className="text-gray-500 italic">And countless more memories together</p>
            </div>
        </section>
    );
}
