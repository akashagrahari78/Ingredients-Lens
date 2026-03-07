import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, AlertTriangle, ShieldAlert } from 'lucide-react';

const HealthScore = ({ score, message }) => {
    const getStyle = () => {
        switch (score) {
            case 'good':
                return 'border-emerald-500 text-emerald-400 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.3)]';
            case 'warning':
                return 'border-amber-500 text-amber-400 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.3)]';
            case 'bad':
            default:
                return 'border-red-500 text-red-400 bg-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.3)]';
        }
    };

    const getIcon = () => {
        switch (score) {
            case 'good': return <Leaf className="w-8 h-8" />;
            case 'warning': return <AlertTriangle className="w-8 h-8" />;
            case 'bad':
            default: return <ShieldAlert className="w-8 h-8" />;
        }
    };

    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
            whileHover={{ y: -5 }}
            className={`relative overflow-hidden inline-flex items-center gap-4 px-8 py-4 rounded-2xl font-bold text-xl border-2 transition-all duration-300 ${getStyle()}`}
        >
            <motion.div
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                {getIcon()}
            </motion.div>
            <span className="z-10 relative text-shadow-sm">{message}</span>

            {/* Gloss effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-20deg] animate-glare mix-blend-overlay pointer-events-none" />
        </motion.div>
    );
};

export default HealthScore;
