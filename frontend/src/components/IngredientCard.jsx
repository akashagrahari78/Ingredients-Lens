import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, AlertTriangle, ShieldAlert } from 'lucide-react';

const IngredientCard = ({ ingredient, index }) => {
    const getStyle = (safety) => {
        switch (safety) {
            case 'good':
                return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]';
            case 'warning':
                return 'border-amber-500/30 bg-amber-500/10 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]';
            case 'bad':
            default:
                return 'border-red-500/30 bg-red-500/10 text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.2)]';
        }
    };

    const getIcon = (safety) => {
        switch (safety) {
            case 'good': return <Leaf className="w-4 h-4" />;
            case 'warning': return <AlertTriangle className="w-4 h-4" />;
            case 'bad':
            default: return <ShieldAlert className="w-4 h-4" />;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 200, damping: 15 }}
            whileHover={{ scale: 1.05 }}
            className={`relative px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 border cursor-help transition-all duration-300 group ${getStyle(ingredient.safety)}`}
        >
            {getIcon(ingredient.safety)}
            {ingredient.name}

            {/* Tooltip */}
            <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[200px] text-xs font-normal text-white bg-gray-900 border border-surface-border rounded-lg p-2 shadow-xl z-20 pointer-events-none break-words">
                {ingredient.reason || 'Safe and standard ingredient'}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
            </div>
        </motion.div>
    );
};

export default IngredientCard;
