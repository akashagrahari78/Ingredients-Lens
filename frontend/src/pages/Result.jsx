import React from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft, Heart, Activity, Flame, Droplet, Leaf, AlertTriangle
} from 'lucide-react';
import HealthScore from '../components/HealthScore';
import IngredientCard from '../components/IngredientCard';

const Result = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Protect route if accessed without state
    if (!location.state || !location.state.result) {
        return <Navigate to="/" replace />;
    }

    const { result, preview } = location.state;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring' } }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="container mx-auto px-4 max-w-6xl w-full min-h-screen py-10"
        >
            <motion.button
                variants={itemVariants}
                onClick={() => navigate('/')}
                className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 font-medium bg-surface/40 hover:bg-surface py-2 px-4 rounded-full backdrop-blur-sm"
            >
                <ArrowLeft size={20} />
                Scan Another Label
            </motion.button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Image & Overview */}
                <motion.div variants={itemVariants} className="space-y-8 flex flex-col h-full">
                    {/* Output Image Preview */}
                    <div className="glass-card flex-1 min-h-[350px] flex items-center justify-center p-2 lg:p-4 bg-black/40">
                        {preview && (
                            <img
                                src={preview}
                                alt="Analyzed label"
                                className="max-h-[500px] w-full object-contain rounded-2xl drop-shadow-2xl"
                            />
                        )}
                    </div>
                </motion.div>

                {/* Right Column - Results */}
                <motion.div variants={itemVariants} className="space-y-8">
                    <div className="glass-card">
                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400 mb-6 drop-shadow-sm">
                            Analysis Results
                        </h2>

                        <div className="mb-10">
                            <HealthScore score={result.healthScore} message={result.scoreMessage} />
                        </div>

                        <div className="mb-10">
                            <h3 className="text-lg font-semibold text-gray-300 flex items-center gap-2 mb-4 border-b border-surface-border pb-2">
                                <Heart size={20} className="text-primary" />
                                Highlighted Ingredients
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {result.ingredients.map((ing, i) => (
                                    <IngredientCard key={i} ingredient={ing} index={i} />
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-300 flex items-center gap-2 mb-4 border-b border-surface-border pb-2">
                                <Activity size={20} className="text-primary" />
                                Nutritional Breakdown
                            </h3>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                <NutritionItem
                                    icon={<Flame size={24} className="text-red-400" />}
                                    value={result.nutrition.calories}
                                    label="Calories"
                                    delay={0}
                                />
                                <NutritionItem
                                    icon={<Droplet size={24} className="text-amber-400" />}
                                    value={result.nutrition.sugar}
                                    label="Sugar"
                                    delay={1}
                                />
                                <NutritionItem
                                    icon={<Activity size={24} className="text-purple-400" />}
                                    value={result.nutrition.fat}
                                    label="Fat"
                                    delay={2}
                                />
                                <NutritionItem
                                    icon={<Leaf size={24} className="text-emerald-400" />}
                                    value={result.nutrition.protein}
                                    label="Protein"
                                    delay={3}
                                />
                                <NutritionItem
                                    icon={<AlertTriangle size={24} className="text-orange-400" />}
                                    value={result.nutrition.sodium}
                                    label="Sodium"
                                    delay={4}
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

/* Helper component for nutrition grid */
const NutritionItem = ({ icon, value, label, delay }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 + (delay * 0.1), type: 'spring' }}
        whileHover={{ y: -5, scale: 1.05 }}
        className="bg-black/20 border border-surface-border rounded-2xl p-4 flex flex-col items-center gap-2 shadow-lg backdrop-blur-md transition-all cursor-default hover:bg-black/40 hover:border-surface-border/80"
    >
        <div className="drop-shadow-[0_0_8px_currentColor] opacity-90">{icon}</div>
        <span className="text-xl font-bold text-white tracking-wide">{value}</span>
        <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{label}</span>
    </motion.div>
);

export default Result;
