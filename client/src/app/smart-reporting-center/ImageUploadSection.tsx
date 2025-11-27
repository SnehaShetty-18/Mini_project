'use client';

import React, { useState, useCallback } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { getMLClassifier } from '@/services/mlClassifier';
import { getGeminiService } from '@/services/gemini';

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  aiAnalysis?: {
    category: string;
    confidence: number;
    description: string;
    suggestedDepartment: string;
    title?: string;
    severity?: string;
    safetyRisk?: boolean;
  };
}

interface ImageUploadSectionProps {
  onImagesChange: (images: UploadedImage[]) => void;
  maxImages?: number;
}

const ImageUploadSection = ({ onImagesChange, maxImages = 5 }: ImageUploadSectionProps) => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const processImage = useCallback(async (file: File): Promise<UploadedImage> => {
    const preview = URL.createObjectURL(file);
    const id = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      console.log('🤖 Step 1: Running ML Model Classification...');
      
      // Step 1: ML Model Classification (Auto-detect time, date, location)
      const mlClassifier = getMLClassifier();
      const mlClassification = await mlClassifier.classifyImage(file);
      
      console.log('✅ ML Classification:', mlClassification);
      console.log('📅 Auto-detected Time:', mlClassification.timestamp.toLocaleString());
      if (mlClassification.location) {
        console.log('📍 Auto-detected Location:', mlClassification.location);
      }
      
      // Step 2: Generate Report using Gemini API based on ML results
      console.log('📝 Step 2: Generating detailed report with Gemini API...');
      const geminiService = getGeminiService();
      const geminiReport = await geminiService.generateReportFromMLClassification({
        mlClassification,
        imageFile: file
      });
      
      console.log('✅ Gemini Report Generated:', geminiReport);
      
      const aiAnalysis = {
        category: geminiReport.category,
        confidence: geminiReport.confidence,
        description: geminiReport.description,
        suggestedDepartment: geminiReport.suggestedDepartment,
        title: geminiReport.title,
        severity: geminiReport.severity,
        safetyRisk: geminiReport.safetyRisk
      };
      
      return {
        id,
        file,
        preview,
        aiAnalysis
      };
    } catch (error) {
      console.error('Error analyzing image:', error);
      // Return image without analysis if both ML and Gemini fail
      return {
        id,
        file,
        preview
      };
    }
  }, []);

  const handleFileSelect = useCallback(async (files: FileList) => {
    if (uploadedImages.length >= maxImages) return;
    
    setIsAnalyzing(true);
    const fileArray = Array.from(files).slice(0, maxImages - uploadedImages.length);
    
    try {
      const processedImages = await Promise.all(
        fileArray.map(file => processImage(file))
      );
      
      const newImages = [...uploadedImages, ...processedImages];
      setUploadedImages(newImages);
      onImagesChange(newImages);
    } catch (error) {
      console.error('Error processing images:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [uploadedImages, maxImages, onImagesChange, processImage]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeImage = useCallback((imageId: string) => {
    const newImages = uploadedImages.filter(img => img.id !== imageId);
    setUploadedImages(newImages);
    onImagesChange(newImages);
  }, [uploadedImages, onImagesChange]);

  const captureFromCamera = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files) {
        handleFileSelect(target.files);
      }
    };
    input.click();
  }, [handleFileSelect]);

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-civic-lg p-8 text-center civic-transition ${
          isDragging
            ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-muted/50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
            <Icon name="PhotoIcon" size={32} className="text-text-secondary" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Upload Issue Photos
            </h3>
            <p className="text-text-secondary mb-4">
              Drag and drop images here, or click to select files
            </p>
            <p className="text-sm text-text-secondary">
              AI will automatically analyze and categorize your images
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <label className="inline-flex items-center space-x-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-civic font-medium civic-transition cursor-pointer">
              <Icon name="FolderOpenIcon" size={20} />
              <span>Choose Files</span>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                disabled={uploadedImages.length >= maxImages}
              />
            </label>
            
            <button
              type="button"
              onClick={captureFromCamera}
              className="inline-flex items-center space-x-2 bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-3 rounded-civic font-medium civic-transition"
              disabled={uploadedImages.length >= maxImages}
            >
              <Icon name="CameraIcon" size={20} />
              <span>Take Photo</span>
            </button>
          </div>
          
          <p className="text-xs text-text-secondary">
            Maximum {maxImages} images • Supported: JPG, PNG, WebP • Max 10MB each
          </p>
        </div>
        
        {isAnalyzing && (
          <div className="absolute inset-0 bg-card/80 backdrop-blur-sm rounded-civic-lg flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-sm font-medium text-foreground">AI Analyzing Images...</p>
            </div>
          </div>
        )}
      </div>

      {/* Uploaded Images */}
      {uploadedImages.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-foreground">
            Uploaded Images ({uploadedImages.length}/{maxImages})
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {uploadedImages.map((image) => (
              <div key={image.id} className="bg-card border border-border rounded-civic-lg overflow-hidden">
                <div className="relative h-48">
                  <AppImage
                    src={image.preview}
                    alt={`Uploaded civic issue photo showing ${image.aiAnalysis?.description || 'community problem'}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removeImage(image.id)}
                    className="absolute top-2 right-2 w-8 h-8 bg-error hover:bg-error/90 text-error-foreground rounded-full flex items-center justify-center civic-transition"
                  >
                    <Icon name="XMarkIcon" size={16} />
                  </button>
                </div>
                
                {image.aiAnalysis && (
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-civic text-xs font-medium bg-primary/10 text-primary">
                        {image.aiAnalysis.category}
                      </span>
                      <span className="text-xs text-text-secondary">
                        {image.aiAnalysis.confidence}% confidence
                      </span>
                    </div>
                    
                    <p className="text-sm text-foreground">
                      {image.aiAnalysis.description}
                    </p>
                    
                    <div className="flex items-center space-x-2 text-xs text-text-secondary">
                      <Icon name="BuildingOfficeIcon" size={14} />
                      <span>{image.aiAnalysis.suggestedDepartment}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploadSection;