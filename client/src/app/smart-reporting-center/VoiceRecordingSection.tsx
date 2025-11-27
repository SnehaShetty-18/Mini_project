'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface VoiceRecordingProps {
  onTranscriptionChange: (text: string) => void;
  placeholder?: string;
}

const VoiceRecordingSection = ({ onTranscriptionChange, placeholder = "Describe the issue you're reporting..." }: VoiceRecordingProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<number | null>(null);
  const recognitionRef = useRef<any | null>(null); // Web Speech API SpeechRecognition

  // Initialize Web Speech API for real transcription
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        
        recognition.onresult = (event: any) => {
          let finalTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' ';
            }
          }
          
          if (finalTranscript) {
            setTranscription(prev => prev + finalTranscript);
          }
        };
        
        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
        };
        
        recognitionRef.current = recognition;
      } else {
        console.warn('Web Speech API not supported in this browser');
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors on cleanup
        }
      }
    };
  }, []);

  const simulateAudioLevel = useCallback(() => {
    const updateLevel = () => {
      if (isRecording) {
        setAudioLevel(Math.random() * 100);
        animationRef.current = requestAnimationFrame(updateLevel);
      }
    };
    updateLevel();
  }, [isRecording]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      setIsRecording(true);
      setRecordingDuration(0);
      
      // Start duration counter
      intervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
      // Start audio level animation
      simulateAudioLevel();
      
      // Start speech recognition if available
      if (recognitionRef.current) {
        try {
          setTranscription(''); // Clear previous transcription
          recognitionRef.current.start();
        } catch (error) {
          console.error('Failed to start speech recognition:', error);
        }
      }
      
      mediaRecorderRef.current.start();
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check your permissions.');
    }
  }, [simulateAudioLevel]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
      
      // Clear intervals and animations
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      
      // Stop speech recognition
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error('Failed to stop speech recognition:', error);
        }
      }
      
      // Finish processing
      setTimeout(() => {
        setIsProcessing(false);
        setAudioLevel(0);
        // Transcription is already set by recognition.onresult
        if (transcription) {
          onTranscriptionChange(transcription);
        }
      }, 1000);
    }
  }, [isRecording, transcription, onTranscriptionChange]);

  const clearTranscription = useCallback(() => {
    setTranscription('');
    onTranscriptionChange('');
    setRecordingDuration(0);
  }, [onTranscriptionChange]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-civic-lg p-6">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-accent to-accent/80 rounded-full flex items-center justify-center relative">
            {isRecording && (
              <div 
                className="absolute inset-0 bg-accent/30 rounded-full animate-pulse"
                style={{ 
                  transform: `scale(${1 + (audioLevel / 200)})`,
                  transition: 'transform 0.1s ease-out'
                }}
              />
            )}
            <Icon 
              name={isRecording ? "StopIcon" : "MicrophoneIcon"} 
              size={32} 
              className="text-accent-foreground relative z-10" 
            />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Voice-to-Text Reporting
            </h3>
            <p className="text-text-secondary">
              {isRecording 
                ? 'Recording... Speak clearly about the issue'
                : isProcessing
                ? 'Processing your recording...' :'Tap to start recording your issue description'
              }
            </p>
          </div>
          
          {isRecording && (
            <div className="space-y-2">
              <div className="text-2xl font-mono font-bold text-accent">
                {formatDuration(recordingDuration)}
              </div>
              <div className="w-32 h-2 bg-muted rounded-full mx-auto overflow-hidden">
                <div 
                  className="h-full bg-accent civic-transition"
                  style={{ width: `${Math.min(audioLevel, 100)}%` }}
                />
              </div>
            </div>
          )}
          
          {isProcessing && (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-foreground">Converting speech to text...</span>
            </div>
          )}
          
          <div className="flex justify-center space-x-3">
            {!isRecording && !isProcessing && (
              <button
                onClick={startRecording}
                className="inline-flex items-center space-x-2 bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-3 rounded-civic font-medium civic-transition"
              >
                <Icon name="MicrophoneIcon" size={20} />
                <span>Start Recording</span>
              </button>
            )}
            
            {isRecording && (
              <button
                onClick={stopRecording}
                className="inline-flex items-center space-x-2 bg-error hover:bg-error/90 text-error-foreground px-6 py-3 rounded-civic font-medium civic-transition"
              >
                <Icon name="StopIcon" size={20} />
                <span>Stop Recording</span>
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Transcription Display */}
      {transcription && (
        <div className="bg-card border border-border rounded-civic-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-foreground">Transcription</h4>
            <button
              onClick={clearTranscription}
              className="text-text-secondary hover:text-foreground civic-transition"
            >
              <Icon name="XMarkIcon" size={20} />
            </button>
          </div>
          
          <div className="bg-muted rounded-civic p-4 mb-4">
            <p className="text-foreground leading-relaxed">{transcription}</p>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-text-secondary">
            <Icon name="CheckCircleIcon" size={16} className="text-success" />
            <span>Transcription completed successfully</span>
          </div>
        </div>
      )}
      
      {/* Tips */}
      <div className="bg-accent/5 border border-accent/20 rounded-civic-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="LightBulbIcon" size={20} className="text-accent mt-0.5" />
          <div>
            <h5 className="font-medium text-foreground mb-1">Recording Tips</h5>
            <ul className="text-sm text-text-secondary space-y-1">
              <li>• Speak clearly and at a normal pace</li>
              <li>• Include location details and issue description</li>
              <li>• Mention any safety concerns or urgency</li>
              <li>• Keep recordings under 2 minutes for best results</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceRecordingSection;