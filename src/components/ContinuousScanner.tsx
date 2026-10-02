import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, RefreshCw, Zap, ScanLine, CheckCircle2, ShieldCheck, ShieldAlert, Sparkles, X } from 'lucide-react';
import jsQR from 'jsqr';
import { sounds } from '../utils/audio';

interface ContinuousScannerProps {
  isActive: boolean;
  onClose: () => void;
  onCodeScanned: (code: string) => void;
}

export const ContinuousScanner: React.FC<ContinuousScannerProps> = ({
  isActive,
  onClose,
  onCodeScanned
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [torchOn, setTorchOn] = useState(false);
  const [sessionScanCount, setSessionScanCount] = useState(0);
  const [lastDetectedCode, setLastDetectedCode] = useState<string | null>(null);
  const [showShutterFlash, setShowShutterFlash] = useState(false);
  const [qrBoundingBox, setQrBoundingBox] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  // Reference to prevent duplicate scans of the same card in quick succession
  const cooldownRef = useRef<{ code: string; timestamp: number } | null>(null);

  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isActive]);

  const startCamera = async () => {
    setCameraError(null);
    setLastDetectedCode(null);
    setQrBoundingBox(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access not supported on this browser/device.');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play().catch(() => {});
        startScanningLoop();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to connect to camera.';
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

  // Continuous loop that runs endlessly while camera is active
  const startScanningLoop = () => {
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

      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      try {
        const qr = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert'
        });

        if (qr && qr.data && qr.data.trim()) {
          const detected = qr.data.trim();
          const now = Date.now();

          // Check if this same card was just scanned within 2.5 seconds
          const isSameCodeCooldown =
            cooldownRef.current &&
            cooldownRef.current.code === detected &&
            now - cooldownRef.current.timestamp < 2500;

          // Check if ANY code was scanned within 1 second
          const isGlobalCooldown =
            cooldownRef.current && now - cooldownRef.current.timestamp < 1000;

          if (!isSameCodeCooldown && !isGlobalCooldown) {
            // Update cooldown tracker
            cooldownRef.current = { code: detected, timestamp: now };

            // Calculate bounding box on feed
            const loc = qr.location;
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

            // Trigger the auto-shot
            triggerContinuousShot(detected);
          }
        }
      } catch {
        // frame decode exception, continue loop
      }

      animFrameRef.current = requestAnimationFrame(scanFrame);
    };

    animFrameRef.current = requestAnimationFrame(scanFrame);
  };

  const triggerContinuousShot = (code: string) => {
    // 1. Play scan chirp
    sounds.playScanChirp();

    // 2. Visual camera shutter flash
    setShowShutterFlash(true);
    setTimeout(() => {
      setShowShutterFlash(false);
    }, 200);

    // 3. Update local session indicators
    setLastDetectedCode(code);
    setSessionScanCount((prev) => prev + 1);

    // 4. Pass code to verification engine (updates logs and shows verdict)
    onCodeScanned(code);

    // 5. Clear target box after 1.2s to be ready for next card
    setTimeout(() => {
      setQrBoundingBox(null);
    }, 1200);
  };

  if (!isActive) return null;

  return (
    <div className="rounded-2xl border-2 border-emerald-500/60 bg-slate-900 shadow-2xl overflow-hidden transition-all duration-300">
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-5 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Camera className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Continuous ID Optical Scanner
              </h3>
              <span className="inline-flex items-center gap-1 rounded bg-emerald-950 px-2 py-0.5 text-[9px] font-mono font-bold text-emerald-300 border border-emerald-800/80">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Continuous Mode
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              One-time activation · Hold student cards up to scan multiple records continuously
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline font-mono text-[11px] text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/60">
            {sessionScanCount} IDs Scanned
          </span>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <CameraOff className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Close Camera</span>
          </button>
        </div>
      </div>

      {/* Viewfinder Area */}
      <div className="relative bg-black h-72 sm:h-80 flex items-center justify-center overflow-hidden">
        {/* Shutter flash animation */}
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
            <div className="h-12 w-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-emerald-400">
              <ScanLine className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">
                {cameraError ? 'Camera Standby / Unavailable' : 'Initializing Continuous Optical Sensor...'}
              </p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-sm">
                Hold student ID barcodes or QR codes in front of the lens. The camera will automatically detect, take the shot, and record each student into the log.
              </p>
            </div>
          </div>
        )}

        {/* Viewfinder Brackets & Scanning Line */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="relative h-48 w-64 sm:h-52 sm:w-80 rounded-xl border-2 border-dashed border-emerald-400/60 shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]">
            {/* Brackets */}
            <div className="absolute -top-1 -left-1 h-5 w-5 border-t-2 border-l-2 border-emerald-400" />
            <div className="absolute -top-1 -right-1 h-5 w-5 border-t-2 border-r-2 border-emerald-400" />
            <div className="absolute -bottom-1 -left-1 h-5 w-5 border-b-2 border-l-2 border-emerald-400" />
            <div className="absolute -bottom-1 -right-1 h-5 w-5 border-b-2 border-r-2 border-emerald-400" />

            {/* Scanning beam */}
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#10b981] animate-[bounce_2s_infinite]" />

            {/* QR Bounding Box */}
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
              <span className="font-mono text-[9px] uppercase font-bold tracking-widest bg-black/75 px-2 py-0.5 rounded text-emerald-300">
                ALIGN QR CODE / BARCODE
              </span>
            </div>
          </div>
        </div>

        {/* Notification when a shot was just taken */}
        {lastDetectedCode && (
          <div className="absolute top-3 inset-x-4 z-30 flex items-center justify-between gap-2 rounded-xl bg-slate-950/90 border border-emerald-500/80 p-2.5 text-xs text-white shadow-xl backdrop-blur-md animate-in slide-in-from-top duration-150">
            <div className="flex items-center gap-2 min-w-0">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <div className="min-w-0">
                <span className="font-bold text-emerald-300 block text-[11px]">
                  ID Auto-Captured:
                </span>
                <span className="font-mono text-xs text-white truncate block">
                  {lastDetectedCode}
                </span>
              </div>
            </div>
            <span className="font-mono text-[10px] text-slate-400 bg-slate-900 px-2 py-1 rounded shrink-0">
              Ready for Next Student
            </span>
          </div>
        )}

        {/* Controls Overlay */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1.5 z-20">
          <button
            type="button"
            onClick={() => setTorchOn(!torchOn)}
            className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
              torchOn
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                : 'bg-black/60 text-slate-300 border-slate-700 hover:bg-black/80'
            }`}
          >
            <Zap className="h-3 w-3" />
            <span className="text-[10px]">Torch</span>
          </button>
          <button
            type="button"
            onClick={startCamera}
            className="p-1.5 rounded-lg border border-slate-700 bg-black/60 text-slate-300 hover:bg-black/80 text-xs flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            <span className="text-[10px]">Reset</span>
          </button>
        </div>
      </div>

      {/* Simulator bar for testing continuous scans without physical cards */}
      <div className="border-t border-slate-800 bg-slate-950/90 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="text-[11px] text-slate-400 font-medium">
          Test camera auto-shot by clicking any student card:
        </span>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => triggerContinuousShot('2024-01-08942')}
            className="px-2 py-0.5 rounded text-[10px] font-mono border border-emerald-800 bg-emerald-950/80 text-emerald-300 hover:bg-emerald-900"
          >
            Brenda (Valid)
          </button>
          <button
            type="button"
            onClick={() => triggerContinuousShot('2023-08-01254')}
            className="px-2 py-0.5 rounded text-[10px] font-mono border border-emerald-800 bg-emerald-950/80 text-emerald-300 hover:bg-emerald-900"
          >
            Joshua (Valid)
          </button>
          <button
            type="button"
            onClick={() => triggerContinuousShot('2021-03-03310')}
            className="px-2 py-0.5 rounded text-[10px] font-mono border border-rose-800 bg-rose-950/80 text-rose-300 hover:bg-rose-900"
          >
            Derrick (Expired)
          </button>
          <button
            type="button"
            onClick={() => triggerContinuousShot('2026-99-99999')}
            className="px-2 py-0.5 rounded text-[10px] font-mono border border-rose-800 bg-rose-950/80 text-rose-300 hover:bg-rose-900"
          >
            Unknown (Alien)
          </button>
        </div>
      </div>
    </div>
  );
};
