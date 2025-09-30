"use client";

import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface DragDropUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
}

export function DragDropUpload({ 
  onFileSelect, 
  accept = "image/*", 
  maxSize = 5,
  className = ""
}: DragDropUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback((file: File): string | null => {
    if (!file.type.startsWith('image/')) {
      return 'Please select an image file';
    }
    
    if (file.size > maxSize * 1024 * 1024) {
      return `Image size must be less than ${maxSize}MB`;
    }
    
    return null;
  }, [maxSize]);

  const handleFile = useCallback((file: File) => {
    setError(null);
    const validationError = validateFile(file);
    
    if (validationError) {
      setError(validationError);
      return;
    }
    
    onFileSelect(file);
  }, [onFileSelect, validateFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  return (
    <div className={`relative ${className}`}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer
          ${isDragOver 
            ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' 
            : 'border-slate-300 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500'
          }
          ${error ? 'border-red-300 dark:border-red-600' : ''}
        `}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-4">
          <div className={`
            mx-auto w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-300
            ${isDragOver 
              ? 'bg-indigo-100 dark:bg-indigo-800' 
              : 'bg-slate-100 dark:bg-slate-700'
            }
          `}>
            {isDragOver ? (
              <Upload className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            ) : (
              <ImageIcon className="h-8 w-8 text-slate-500 dark:text-slate-400" />
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
              {isDragOver ? 'Drop your image here' : 'Upload Profile Picture'}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Drag and drop an image, or click to browse
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500">
              Supports JPG, PNG, GIF up to {maxSize}MB
            </p>
          </div>
        </div>
        
        {/* Drag overlay */}
        {isDragOver && (
          <div className="absolute inset-0 bg-indigo-500/10 rounded-2xl flex items-center justify-center">
            <div className="text-indigo-600 dark:text-indigo-400 font-semibold">
              Drop to upload
            </div>
          </div>
        )}
      </div>
      
      {/* Error message */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}
