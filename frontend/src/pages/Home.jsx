import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ScanLine, ArrowRight } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container mx-auto px-4 max-w-6xl w-full min-h-screen flex flex-col items-center justify-center py-12 text-center"
        >
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
            >
                <ScanLine size={80} className="text-primary mx-auto mb-8 drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
                <h1 className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-emerald-400 mb-6 drop-shadow-sm tracking-tight">
                    LabelLens AI
                </h1>
                <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-12">
                    Harness the power of AI to instantly decode complex food product labels. Discover exactly what you're consuming.
                </p>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/upload')}
                    className="bg-primary hover:bg-primary-hover text-white font-bold py-4 px-10 rounded-full text-xl shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] transition-all flex items-center gap-3 mx-auto"
                >
                    Get Started
                    <ArrowRight className="animate-pulse" />
                </motion.button>
            </motion.div>
        </motion.div>
    );
};

export default Home;
