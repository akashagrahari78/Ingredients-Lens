/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#0d1117',
                surface: 'rgba(255, 255, 255, 0.03)',
                'surface-border': 'rgba(255, 255, 255, 0.08)',
                primary: '#10b981',
                'primary-hover': '#059669',
            },
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
