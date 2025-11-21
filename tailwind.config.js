/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'love-red': '#D90429',
                'soft-pink': '#FFD6E0',
                'deep-maroon': '#640D14',
                'gold': '#FFD700',
            },
            fontFamily: {
                'serif': ['Playfair Display', 'serif'],
                'sans': ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
