import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ScanLine, ArrowLeft } from 'lucide-react';
import UploadBox from '../components/UploadBox';
import { analyzeLabelImage } from '../services/api';

const Upload = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const navigate = useNavigate();

    const handleFileSelected = (selectedFile, previewDataurl) => {
        setFile(selectedFile);
        setPreview(previewDataurl);
    };

    const handleAnalyze = async () => {
        if (!file) return;
        setIsAnalyzing(true);
        try {
            const result = await analyzeLabelImage(file);
            navigate('/result', { state: { result, preview } });
        } catch (error) {
            console.error("Failed to analyze image:", error);
            setIsAnalyzing(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="container mx-auto px-4 max-w-6xl w-full min-h-screen flex flex-col items-center justify-center py-12"
        >
            <header className="flex items-center justify-center gap-4 mb-2 select-none">
                <ScanLine size={36} className="text-primary drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
                <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-emerald-200 tracking-tight">
                    Analyzer
                </h2>
            </header>

            <div className="w-full max-w-2xl mx-auto mb-6 text-center">
                <p className="text-gray-400">Upload a clear picture of the food product label or ingredient list.</p>
            </div>

            <main className="w-full max-w-2xl mx-auto glass-card lg:p-10 transition-all duration-300 relative">
                <motion.button
                    whileHover={{ x: -3 }}
                    onClick={() => navigate('/')}
                    className="absolute top-6 left-6 text-gray-500 hover:text-white transition-colors flex items-center gap-1 text-sm bg-black/20 px-3 py-1.5 rounded-full"
                >
                    <ArrowLeft size={16} /> Home
                </motion.button>

                <div className="min-h-[300px] mb-8 mt-4">
                    <UploadBox onFileSelected={handleFileSelected} isAnalyzing={isAnalyzing} />
                </div>

                <motion.button
                    whileHover={!isAnalyzing && preview ? { scale: 1.02, y: -2 } : {}}
                    whileTap={!isAnalyzing && preview ? { scale: 0.98 } : {}}
                    onClick={handleAnalyze}
                    disabled={!preview || isAnalyzing}
                    className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 text-lg font-bold shadow-xl transition-all duration-300 ${preview && !isAnalyzing
                            ? 'bg-gradient-to-r from-primary to-primary-hover text-white shadow-primary/30 hover:shadow-primary/50 cursor-pointer'
                            : 'bg-surface-border text-gray-500 cursor-not-allowed border justify-center border-surface-border'
                        }`}
                >
                    {isAnalyzing ? (
                        <span className="animate-pulse tracking-wider">Processing image...</span>
                    ) : (
                        <>
                            <ScanLine size={24} />
                            Analyze Label
                        </>
                    )}
                </motion.button>
            </main>
        </motion.div>
    );
};

export default Upload;
