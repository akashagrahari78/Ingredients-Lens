import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, X, ScanLine, Loader2 } from 'lucide-react';

const UploadBox = ({ onFileSelected, isAnalyzing }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.type.startsWith('image/')) {
            handleFile(droppedFile);
        }
    };

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            handleFile(selectedFile);
        }
    };

    const handleFile = (selectedFile) => {
        const reader = new FileReader();
        reader.onload = () => {
            setPreview(reader.result);
            onFileSelected(selectedFile, reader.result);
        };
        reader.readAsDataURL(selectedFile);
    };

    const clearFile = (e) => {
        e.stopPropagation();
        setPreview(null);
        onFileSelected(null, null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="w-full h-full flex flex-col justify-center">
            {!preview ? (
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative overflow-hidden w-full flex flex-col items-center justify-center border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-colors duration-300 ${isDragging ? 'border-primary bg-primary/10' : 'border-surface-border bg-white/5 hover:bg-white/10 hover:border-primary/50'
                        }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    >
                        <UploadCloud className={`mb-4 w-16 h-16 transition-colors duration-300 ${isDragging ? 'text-primary' : 'text-gray-400'}`} />
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-200">
                        Click to upload or drag & drop
                    </h3>
                    <p className="text-sm text-gray-400">SVG, PNG, JPG or GIF (max. 10MB)</p>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept="image/*"
                        className="hidden"
                    />
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative rounded-3xl overflow-hidden shadow-2xl border border-surface-border bg-black/40 flex flex-col items-center p-4"
                >
                    <button
                        onClick={clearFile}
                        className="absolute top-4 right-4 z-10 bg-black/60 hover:bg-red-500/80 backdrop-blur-md text-white p-2 rounded-full transition-all duration-200 hover:scale-110"
                        disabled={isAnalyzing}
                    >
                        <X size={20} />
                    </button>

                    <div className="w-full flex justify-center items-center h-[300px] sm:h-[400px] overflow-hidden rounded-2xl bg-black">
                        <img
                            src={preview}
                            alt="Label preview"
                            className={`w-full h-full object-contain transition-opacity duration-300 ${isAnalyzing ? 'opacity-50 grayscale' : 'opacity-100'}`}
                        />
                    </div>

                    {isAnalyzing && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm z-0">
                            <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
                            <p className="text-xl font-semibold text-primary/90 animate-pulse">Analyzing AI Engine...</p>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default UploadBox;
