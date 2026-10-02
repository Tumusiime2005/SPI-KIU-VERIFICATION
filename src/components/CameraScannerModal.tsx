import React, { useEffect, useRef, useState } from 'react';
import { X, Camera, RefreshCw, Zap, ScanLine, Sparkles, CheckCircle2, QrCode } from 'lucide-react';
import jsQR from 'jsqr';
import { INITIAL_PRESET_TESTS } from '../data/mockData';
import { sounds } from '../utils/audio';

interface CameraScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCodeScanned: (code: string) => void;
}

export const CameraScannerModal: React.FC<CameraScannerModalProps> = ({
  isOpen,
  onClose,
  onCodeScanned
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [torchOn, setTorchOn] = useState(false);
  const [isScanning, setIsScanning] = useState(true);
  const [autoCapturedCode, setAutoCapturedCode] = useState<string | null>(null);
  const [showShutterFlash, setShowShutterFlash] = useState(false);
  const [qrBoundingBox, setQrBoundingBox] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    setCameraError(null);
    setAutoCapturedCode(null);
    setIsScanning(true);
    setQrBoundingBox(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access not supported on this device/browser.');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play().catch(() => {});
        // Start continuous optical frame analysis loop
        startQrDetectionLoop();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to access camera device.';
      setCameraError(msg);
    }
  };

  const stopCamera = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  // Continuous frame scanner for automated QR Code detection & auto-shot
  const startQrDetectionLoop = () => {
    const scanFrame = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
        animFrameRef.current = requestAnimationFrame(scanFrame);
        return;
      }

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        animFrameRef.current = requestAnimationFrame(scanFrame);
        return;
      }

      // Match canvas dimensions to video feed
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Analyze raw pixel data with jsQR
      try {
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert'
        });

        if (code && code.data && code.data.trim()) {
          // Calculate bounding box
          const loc = code.location;
          const minX = Math.min(loc.topLeftCorner.x, loc.bottomLeftCorner.x);
          const maxX = Math.max(loc.topRightCorner.x, loc.bottomRightCorner.x);
          const minY = Math.min(loc.topLeftCorner.y, loc.topRightCorner.y);
          const maxY = Math.max(loc.bottomLeftCorner.y, loc.bottomRightCorner.y);

          setQrBoundingBox({
            x: (minX / canvas.width) * 100,
            y: (minY / canvas.height) * 100,
            width: ((maxX - minX) / canvas.width) * 100,
            height: ((maxY - minY) / canvas.height) * 100
          });

          // Trigger automatic camera shot!
          triggerAutomaticShot(code.data.trim());
          return; // Stop scanning loop
        }
      } catch {
        // frame decode error, continue
      }

      animFrameRef.current = requestAnimationFrame(scanFrame);
    };

    animFrameRef.current = requestAnimationFrame(scanFrame);
  };

  // Executes the automatic camera snapshot upon detecting a QR code
  const triggerAutomaticShot = (scannedCode: string) => {
    if (!isScanning) return;
    setIsScanning(false);
    setAutoCapturedCode(scannedCode);

    // 1. Play sound
    sounds.playScanChirp();

    // 2. Visual camera shutter flash
    setShowShutterFlash(true);
    setTimeout(() => {
      setShowShutterFlash(false);
    }, 250);

    // 3. Complete auto-capture after snapshot animation
    setTimeout(() => {
      stopCamera();
      onCodeScanned(scannedCode);
      onClose();
    }, 550);
  };

  const handleSimulateAutoDetect = (code: string) => {
    triggerAutomaticShot(code);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-5 py-3.5">
          <div className="flex items-center gap-2">
            <Camera className="h-4 w-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <span>Automatic QR Code ID Scanner</span>
              <span className="font-mono text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-800/80 px-1.5 py-0.2 rounded font-normal">
                Auto-Snap Active
              </span>
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Viewfinder Window */}
        <div className="relative bg-black flex-1 min-h-[320px] flex items-center justify-center overflow-hidden">
          {/* Hidden off-screen canvas for frame pixel processing */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Camera Flash Shutter Overlay */}
          {showShutterFlash && (
            <div className="absolute inset-0 z-40 bg-white/95 transition-opacity duration-200 pointer-events-none" />
          )}

          {stream && !cameraError ? (
            <video
              ref={videoRef}
              playsInline
              muted
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-6 space-y-3 z-10">
              <div className="h-14 w-14 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-emerald-400">
                <ScanLine className="h-7 w-7 animate-pulse" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-200">
                  {cameraError ? 'Webcam Standby or Unavailable' : 'Activating Auto-Capture Camera...'}
                </p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                  Hold a student ID QR code in front of the lens. The camera will automatically detect the code and take the shot without pressing any buttons.
                </p>
              </div>
            </div>
          )}

          {/* Viewfinder Overlay with Corner Brackets & Laser Line */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="relative h-56 w-72 sm:w-80 rounded-xl border-2 border-dashed border-emerald-400/60 shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]">
              {/* Corner brackets */}
              <div className="absolute -top-1 -left-1 h-5 w-5 border-t-2 border-l-2 border-emerald-400" />
              <div className="absolute -top-1 -right-1 h-5 w-5 border-t-2 border-r-2 border-emerald-400" />
              <div className="absolute -bottom-1 -left-1 h-5 w-5 border-b-2 border-l-2 border-emerald-400" />
              <div className="absolute -bottom-1 -right-1 h-5 w-5 border-b-2 border-r-2 border-emerald-400" />

              {/* Laser Scanning Beam */}
              {isScanning && !autoCapturedCode && (
                <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#10b981] animate-[bounce_2.2s_infinite]" />
              )}

              {/* Detected QR target highlight */}
              {qrBoundingBox && (
                <div
                  className="absolute border-2 border-emerald-400 bg-emerald-400/20 rounded shadow-[0_0_15px_#34d399]"
                  style={{
                    left: `${qrBoundingBox.x}%`,
                    top: `${qrBoundingBox.y}%`,
                    width: `${qrBoundingBox.width}%`,
                    height: `${qrBoundingBox.height}%`
                  }}
                />
              )}

              <div className="absolute bottom-2 inset-x-0 text-center">
                <span className="font-mono text-[10px] uppercase font-bold tracking-widest bg-black/70 px-2 py-0.5 rounded text-emerald-300">
                  {autoCapturedCode ? 'QR CODE CAPTURED!' : 'AUTO-DETECTING QR CODE...'}
                </span>
              </div>
            </div>
          </div>

          {/* Auto-Captured Shot Banner */}
          {autoCapturedCode && (
            <div className="absolute top-4 inset-x-4 z-30 flex items-center justify-center gap-2 rounded-xl bg-emerald-950/90 border border-emerald-500 p-3 text-emerald-200 shadow-xl backdrop-blur-md animate-in slide-in-from-top duration-200">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <div className="text-left">
                <span className="text-xs font-bold block">📸 QR Code Auto-Captured! Taking Shot...</span>
                <span className="font-mono text-[11px] text-emerald-300">{autoCapturedCode}</span>
              </div>
            </div>
          )}

          {/* Camera controls */}
          <div className="absolute bottom-3 right-3 flex items-center gap-2 z-20">
            <button
              type="button"
              onClick={() => setTorchOn(!torchOn)}
              className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
                torchOn
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                  : 'bg-black/60 text-slate-300 border-slate-700 hover:bg-black/80'
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Torch</span>
            </button>
            <button
              type="button"
              onClick={startCamera}
              className="p-2 rounded-lg border border-slate-700 bg-black/60 text-slate-300 hover:bg-black/80 text-xs flex items-center gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Restart</span>
            </button>
          </div>
        </div>

        {/* Quick Optical Simulator: simulates showing QR codes to the camera */}
        <div className="border-t border-slate-800 bg-slate-950 p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <QrCode className="h-3.5 w-3.5 text-emerald-400" />
              <span>Test Automatic QR Code Capture:</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-semibold">
              Instant Snapshot on Detection
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
            {INITIAL_PRESET_TESTS.filter(t => t.code !== 'Mukasa' && t.code !== 'Brenda').map((t, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSimulateAutoDetect(t.code)}
                className="flex items-start justify-between p-2 rounded-lg border border-slate-800 bg-slate-900/80 hover:border-emerald-500/50 hover:bg-slate-800/80 text-left transition-all group"
              >
                <div className="min-w-0 pr-2">
                  <span className="block text-xs font-semibold text-slate-200 group-hover:text-emerald-300 truncate">
                    {t.label.split('(')[0]}
                  </span>
                  <span className="block font-mono text-[10px] text-slate-400">
                    {t.code}
                  </span>
                </div>
                <span
                  className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 ${
                    t.expectedOutcome === 'GRANTED'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-rose-950 text-rose-300 border border-rose-800'
                  }`}
                >
                  Auto-Snap
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
