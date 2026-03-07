import React from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft, Heart, CheckCircle2, XCircle, Info
} from 'lucide-react';
import HealthScore from '../components/HealthScore';
import IngredientCard from '../components/IngredientCard';

const Result = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Protecting route if accessed without state
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
                                <Info size={20} className="text-primary" />
                                Detailed AI Dietary Analysis
                            </h3>

                            <div className="space-y-4 text-gray-300 text-base leading-relaxed">
                                {/* Overall Summary */}
                                <motion.div
                                    className="bg-black/20 p-5 rounded-2xl border border-surface-border shadow-md"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <p className="font-medium text-gray-100 mb-2">Verdict</p>
                                    <p>{result.analysis}</p>
                                </motion.div>

                                {/* Dietary Guidance Grid */}
                                {result.detailedAnalysis && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <motion.div
                                            className="bg-emerald-500/5 border border-emerald-500/20 p-5 rounded-2xl"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.5 }}
                                        >
                                            <p className="flex items-center gap-2 text-emerald-400 font-semibold mb-2">
                                                <CheckCircle2 size={18} /> Best For
                                            </p>
                                            <p className="text-sm">{result.detailedAnalysis.whoShouldEat || "Not specifically indicated."}</p>
                                        </motion.div>

                                        <motion.div
                                            className="bg-red-500/5 border border-red-500/20 p-5 rounded-2xl"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.6 }}
                                        >
                                            <p className="flex items-center gap-2 text-red-400 font-semibold mb-2">
                                                <XCircle size={18} /> Who Should Avoid
                                            </p>
                                            <p className="text-sm">{result.detailedAnalysis.whoShouldAvoid || "No specific groups indicated."}</p>
                                        </motion.div>

                                        {/* Good/Bad rationale spans 2 cols on wide mode */}
                                        <motion.div
                                            className="bg-primary/5 border border-primary/20 p-5 rounded-2xl sm:col-span-2"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.7 }}
                                        >
                                            <p className="font-semibold text-primary mb-2">Extensive Rationale</p>
                                            <p className="text-sm">{result.detailedAnalysis.whyGoodOrBad || "Unable to generate detailed rationale."}</p>
                                        </motion.div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Result;
