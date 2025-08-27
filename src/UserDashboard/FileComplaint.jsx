import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Mic,
    Square,
    Camera,
    Upload,
    MapPin,
    LocateFixed,
    Send,
    Trash2,
    Copy,
    CheckCircle2,
    Loader2,
    Image as ImageIcon,
} from "lucide-react";

// If you plan to enable the interactive map, install leaflet deps:
// npm i react-leaflet leaflet
// import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';

// ======================= HELPERS =======================
const ELECTRICITY_WORDS = ["line", "bijuli", "बिजुली", "batti", "बत्ती", "current"];
const toElectricity = (text) => {
    if (!text) return "";
    const pattern = new RegExp(`\\b(${ELECTRICITY_WORDS.join("|")})\\b`, "gi");
    return text.replace(pattern, "electricity");
};

const useDebounce = (fn, delay = 350) => {
    const timer = useRef(null);
    return useCallback((...args) => {
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => fn(...args), delay);
    }, [fn, delay]);
};

// Mock translator (replace with your API if needed)
async function translateText({ text, targetLang = "en" }) {
    if (!text?.trim()) return "";
    if (targetLang === "en") {
        return text
            .replace(/नेपाल/gi, "Nepal")
            .replace(/बिजुली/gi, "electricity")
            .replace(/बत्ती/gi, "electricity");
    }
    return text + " (Nepali)";
}

// ======================= CAMERA HOOK =======================
function useCamera() {
    const videoRef = useRef(null);
    const [streaming, setStreaming] = useState(false);
    const [photoDataUrl, setPhotoDataUrl] = useState("");
    const streamRef = useRef(null);

    const start = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }
            setStreaming(true);
        } catch (e) {
            console.error(e);
            alert("Camera access failed. Please allow permission or use Upload Photo.");
        }
    };

    const stop = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
        }
        setStreaming(false);
    };

    const capture = () => {
        if (!videoRef.current) return null;
        const video = videoRef.current;
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth || 720;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const url = canvas.toDataURL("image/jpeg", 0.85);
        setPhotoDataUrl(url);
        return url;
    };

    const upload = (file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const url = reader.result;
            if (typeof url === "string") {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const scale = Math.min(1, 1200 / img.width);
                    canvas.width = Math.round(img.width * scale);
                    canvas.height = Math.round(img.height * scale);
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    setPhotoDataUrl(canvas.toDataURL("image/jpeg", 0.85));
                };
                img.src = url;
            }
        };
        reader.readAsDataURL(file);
    };

    const clearPhoto = () => setPhotoDataUrl("");

    useEffect(() => {
        return () => stop();
    }, []);

    return { videoRef, streaming, start, stop, capture, upload, photoDataUrl, clearPhoto };
}

// ======================= WAVEFORM ANIMATION =======================
const Waveform = ({ recording }) => (
    <svg viewBox="0 0 120 24" className="h-6 w-20" preserveAspectRatio="none">
        <rect x="0" y="0" width="120" height="24" rx="6" fill="#1e40af" />
        <g fill="#fff">
            {[...Array(7)].map((_, i) => (
                <rect
                    key={i}
                    x={6 + i * 14}
                    width="6"
                    height={recording ? 8 + Math.random() * 16 : 8}
                    y={recording ? 8 - Math.random() * 4 : 8}
                    rx="2"
                    className={recording ? "animate-[waveform_0.6s_alternate_infinite]" : ""}
                    style={{ animationDelay: `${i * 0.1}s` }}
                />
            ))}
        </g>
    </svg>
);

// ======================= MAP PICKER =======================
const MapPicker = ({ open, onClose, onPick, value }) => {
    const [latInput, setLatInput] = useState(value?.latitude?.toFixed(6) || "");
    const [lngInput, setLngInput] = useState(value?.longitude?.toFixed(6) || "");

    useEffect(() => {
        setLatInput(value?.latitude?.toFixed(6) || "");
        setLngInput(value?.longitude?.toFixed(6) || "");
    }, [value, open]);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    aria-modal="true"
                    role="dialog"
                >
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 20, opacity: 0 }}
                        className="w-full max-w-3xl rounded-2xl bg-white/95 backdrop-blur-lg shadow-2xl overflow-hidden"
                    >
                        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
                            <h2 className="font-semibold text-lg text-blue-800">Choose Location</h2>
                            <button
                                onClick={onClose}
                                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm text-slate-700 transition-colors"
                                aria-label="Close map"
                            >
                                Close
                            </button>
                        </div>
                        <div className="p-5">
                            <div className="rounded-xl overflow-hidden border border-slate-200 shadow-inner">
                                <iframe
                                    title="Location Map"
                                    width="100%"
                                    height="420"
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    src={`https://www.google.com/maps?q=${value?.latitude || 27.7172},${value?.longitude || 85.3240}&z=14&output=embed`}
                                    className="w-full"
                                />
                            </div>
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <input
                                    type="number"
                                    step="any"
                                    placeholder="Latitude"
                                    value={latInput}
                                    onChange={(e) => setLatInput(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
                                    aria-label="Latitude"
                                />
                                <input
                                    type="number"
                                    step="any"
                                    placeholder="Longitude"
                                    value={lngInput}
                                    onChange={(e) => setLngInput(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
                                    aria-label="Longitude"
                                />
                            </div>
                            <div className="mt-4 flex justify-end gap-2">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-sm text-slate-700 transition-colors"
                                    aria-label="Cancel location selection"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        const lat = parseFloat(latInput);
                                        const lng = parseFloat(lngInput);
                                        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
                                            alert("Please enter valid coordinates.");
                                            return;
                                        }
                                        onPick({ latitude: lat, longitude: lng });
                                        onClose();
                                    }}
                                    className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-colors"
                                    aria-label="Set location"
                                >
                                    Set Location
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// ======================= ERROR BOUNDARY =======================
class ErrorBoundary extends React.Component {
    state = { hasError: false, error: null };
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    render() {
        if (this.state.hasError) {
            return (
                <div className="max-w-6xl mx-auto p-4 text-red-600">
                    <h2 className="text-lg font-semibold">Something went wrong!</h2>
                    <p className="text-sm">{this.state.error?.toString()}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                        Reload Page
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

// ======================= MAIN COMPONENT =======================
export default function FileComplaint() {
    // Voice + Text state
    const [recording, setRecording] = useState(false);
    const [status, setStatus] = useState("Idle");
    const [npText, setNpText] = useState("");
    const [enText, setEnText] = useState("");
    const [loadingTranslate, setLoadingTranslate] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    // Location state
    const [coords, setCoords] = useState(null);
    const [openingMap, setOpeningMap] = useState(false);

    // Media
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const recognitionRef = useRef(null);
    const audioStreamRef = useRef(null);
    const nepaliRef = useRef(null);
    const englishRef = useRef(null);

    // Camera
    const { videoRef, streaming, start: startCam, stop: stopCam, capture, upload, photoDataUrl, clearPhoto } = useCamera();

    // Debounced translators
    const debouncedNpToEn = useDebounce(async (txt) => {
        setLoadingTranslate(true);
        const english = await translateText({ text: toElectricity(txt), targetLang: "en" });
        setEnText(english);
        setLoadingTranslate(false);
    }, 250);

    const debouncedEnToNp = useDebounce(async (txt) => {
        setLoadingTranslate(true);
        const nepali = await translateText({ text: toElectricity(txt), targetLang: "ne" });
        setNpText(nepali);
        setLoadingTranslate(false);
    }, 250);

    // =================== Recording ===================
    const startRecording = async () => {
        setStatus("Listening…");
        setRecording(true);
        audioChunksRef.current = [];

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioStreamRef.current = stream;
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) audioChunksRef.current.push(e.data);
            };
            mediaRecorder.onstop = () => setStatus("Idle");
            mediaRecorder.start();
        } catch (e) {
            console.error(e);
            alert("Microphone access failed. Please allow permission.");
            setRecording(false);
            setStatus("Idle");
            return;
        }

        const SR = window.SpeechRecognition || window.webkitSpeechRecognition || null;
        if (SR) {
            const rec = new SR();
            recognitionRef.current = rec;
            rec.lang = "ne-NP";
            rec.interimResults = true;
            rec.continuous = true;
            let finalChunk = "";
            rec.onresult = (event) => {
                let interimTranscript = "";
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const r = event.results[i];
                    if (r.isFinal) finalChunk += r[0].transcript + " ";
                    else interimTranscript += r[0].transcript + " ";
                }
                const combinedText = (finalChunk + interimTranscript).trim();
                setNpText(combinedText);
                if (combinedText) debouncedNpToEn(combinedText);
            };
            rec.onerror = (e) => console.warn(e.error);
            rec.onend = () => {
                if (recording) rec.start();
            };
            rec.start();
        } else {
            console.warn("SpeechRecognition not supported.");
            setStatus("SpeechRecognition not supported in this browser.");
        }
    };

    const stopRecording = () => {
        setRecording(false);
        setStatus("Stopping…");
        if (recognitionRef.current) {
            try {
                recognitionRef.current.onend = null;
                recognitionRef.current.stop();
                recognitionRef.current = null;
            } catch { }
        }
        if (mediaRecorderRef.current) {
            try {
                mediaRecorderRef.current.stop();
                mediaRecorderRef.current = null;
            } catch { }
        }
        if (audioStreamRef.current) {
            audioStreamRef.current.getTracks().forEach((t) => t.stop());
            audioStreamRef.current = null;
        }
        setStatus("Idle");
    };

    // =================== Text Handlers ===================
    const onNepaliInput = (e) => {
        const txt = e.currentTarget.innerText;
        setNpText(txt);
        debouncedNpToEn(txt);
    };

    const onEnglishInput = (e) => {
        const txt = e.currentTarget.innerText;
        setEnText(txt);
        debouncedEnToNp(txt);
    };

    const copyToClipboard = async (val) => {
        try {
            await navigator.clipboard.writeText(val || "");
            alert("Copied to clipboard!");
        } catch {
            alert("Failed to copy.");
        }
    };

    const clearBoth = () => {
        setNpText("");
        setEnText("");
        if (nepaliRef.current) nepaliRef.current.innerText = "";
        if (englishRef.current) englishRef.current.innerText = "";
    };

    // =================== Location ===================
    const useCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation not supported in this browser.");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const c = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
                setCoords(c);
            },
            (err) => {
                console.error(err);
                alert("Failed to get location");
            }
        );
    };

    // =================== Send to Webhook ===================
    const sendToWebhook = async () => {
        try {
            const res = await fetch("http://localhost:5678/webhook-test/d952287b-710e-4611-9049-2fa1edd0bb5f", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nepaliText: npText,
                    englishText: enText,
                    location: coords,
                    photo: photoDataUrl || null,
                }),
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            alert("Complaint sent successfully!");
            clearBoth();
            setCoords(null);
            clearPhoto();
        } catch (e) {
            console.error(e);
            alert("Failed to send! Please check console.");
        }
    };

    // =================== Keep contentEditable in sync ===================
    useEffect(() => {
        if (nepaliRef.current && nepaliRef.current.innerText !== npText) {
            nepaliRef.current.innerText = npText;
        }
    }, [npText]);

    useEffect(() => {
        if (englishRef.current && englishRef.current.innerText !== enText) {
            englishRef.current.innerText = enText;
        }
    }, [enText]);

    // =================== UI ===================
    return (
        <ErrorBoundary>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-red-50 text-slate-800 font-['Inter']">
                <style>
                    {`
                        .nepali-text { font-family: 'Noto Sans Devanagari', sans-serif; }
                        [contenteditable]:empty:before { content: attr(data-placeholder); color: #94a3b8; }
                        @keyframes waveform { 0% { height: 8px; } 50% { height: 24px; } 100% { height: 8px; } }
                        .card-shadow { box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); transition: transform 0.2s, box-shadow 0.2s; }
                        .card-shadow:hover { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15); }
                        .btn-pulse { position: relative; }
                        .btn-pulse::before { content: ''; position: absolute; inset: 0; border-radius: inherit; background: radial-gradient(circle, rgba(255,255,255,0.3), transparent); opacity: 0; animation: pulse 2s infinite; }
                        @keyframes pulse { 0% { opacity: 0; transform: scale(0.8); } 50% { opacity: 0.5; transform: scale(1); } 100% { opacity: 0; transform: scale(1.2); } }
                    `}
                </style>

                {/* Header */}
                <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
                    <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">

                        <div className="flex items-center gap-2">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={useCurrentLocation}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white shadow-md hover:bg-blue-700 transition-colors btn-pulse"
                                aria-label="Use current location"
                            >
                                <LocateFixed className="h-4 w-4" /> Current Location
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setOpeningMap(true)}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 shadow-md transition-colors"
                                aria-label="Choose location on map"
                            >
                                <MapPin className="h-4 w-4 text-red-600" /> Map
                            </motion.button>
                        </div>
                    </div>
                </header>

                <main className="max-w-6xl mx-auto px-4 py-6">
                    {/* Location Pill */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 flex items-center gap-3"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm">
                            <MapPin className="h-5 w-5 text-red-600" />
                            <span className="text-sm text-slate-700">
                                {coords ? (
                                    <>Lat: {coords.latitude.toFixed(6)}, Lng: {coords.longitude.toFixed(6)}</>
                                ) : (
                                    "No location set"
                                )}
                            </span>
                        </div>
                        <button
                            onClick={() => setShowDetails(!showDetails)}
                            className="ml-auto px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-sm text-slate-700 transition-colors"
                            aria-label={showDetails ? "Hide details" : "Show details"}
                        >
                            {showDetails ? "Hide Details" : "Show Details"}
                        </button>
                    </motion.div>

                    {/* Transcription Cards */}
                    <AnimatePresence>
                        {showDetails && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
                            >
                                {/* Nepali */}
                                <motion.div
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200 p-5 card-shadow"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <h2 className="text-lg font-semibold text-blue-800 nepali-text">🎙 नेपाली (लाइभ)</h2>
                                        {loadingTranslate ? (
                                            <span className="text-xs text-slate-500 flex items-center gap-1">
                                                <Loader2 className="h-4 w-4 animate-spin" /> Translating…
                                            </span>
                                        ) : (
                                            <span className="text-xs text-green-600 flex items-center gap-1">
                                                <CheckCircle2 className="h-4 w-4" /> Synced
                                            </span>
                                        )}
                                    </div>
                                    <div
                                        ref={nepaliRef}
                                        contentEditable
                                        suppressContentEditableWarning
                                        onInput={onNepaliInput}
                                        className="min-h-[160px] max-h-[320px] overflow-y-auto p-4 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-300 nepali-text text-sm"
                                        data-placeholder="नेपाली बोल / टेक्स्ट यहाँ देखिन्छ…"
                                        aria-label="Nepali text input"
                                    />
                                    <div className="mt-3 flex justify-end gap-2">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => copyToClipboard(npText)}
                                            className="px-3 py-1.5 text-sm rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center gap-1 transition-colors"
                                            aria-label="Copy Nepali text"
                                        >
                                            <Copy className="h-4 w-4" /> Copy
                                        </motion.button>
                                    </div>
                                </motion.div>

                                {/* English */}
                                <motion.div
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.05 }}
                                    className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200 p-5 card-shadow"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <h2 className="text-lg font-semibold text-green-800">🌍 English</h2>
                                        {loadingTranslate ? (
                                            <span className="text-xs text-slate-500 flex items-center gap-1">
                                                <Loader2 className="h-4 w-4 animate-spin" /> Translating…
                                            </span>
                                        ) : (
                                            <span className="text-xs text-green-600 flex items-center gap-1">
                                                <CheckCircle2 className="h-4 w-4" /> Synced
                                            </span>
                                        )}
                                    </div>
                                    <div
                                        ref={englishRef}
                                        contentEditable
                                        suppressContentEditableWarning
                                        onInput={onEnglishInput}
                                        className="min-h-[160px] max-h-[320px] overflow-y-auto p-4 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-green-300 text-sm"
                                        data-placeholder="English translation will appear here…"
                                        aria-label="English text input"
                                    />
                                    <div className="mt-3 flex justify-between items-center">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => copyToClipboard(enText)}
                                            className="px-3 py-1.5 text-sm rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center gap-1 transition-colors"
                                            aria-label="Copy English text"
                                        >
                                            <Copy className="h-4 w-4" /> Copy
                                        </motion.button>
                                        <span className="text-xs text-slate-500">Edit if needed</span>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Controls Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* Voice Controls */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200 p-5 card-shadow flex flex-col justify-between"
                        >
                            <div>
                                <h2 className="text-lg font-semibold text-blue-800">Voice Controls</h2>
                                <p className="text-sm text-slate-500 mb-4">Real-time Nepali speech to English (best in Chrome).</p>
                                <div className="flex items-center gap-3 mb-4">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${recording ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                                            }`}
                                    >
                                        {recording ? "Recording" : "Ready"}
                                    </span>
                                    <span className="text-xs text-slate-500">• {status}</span>
                                    {recording && <Waveform recording={recording} />}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {!recording ? (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={startRecording}
                                        className="relative inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors btn-pulse"
                                        aria-label="Start recording"
                                    >
                                        <Mic className="h-5 w-5" />
                                        <span>Start</span>
                                    </motion.button>
                                ) : (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={stopRecording}
                                        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-red-600 text-white shadow-lg hover:bg-red-700 transition-colors"
                                        aria-label="Stop recording"
                                    >
                                        <Square className="h-5 w-5" />
                                        <span>Stop</span>
                                    </motion.button>
                                )}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={clearBoth}
                                    className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors"
                                    aria-label="Clear text"
                                >
                                    <Trash2 className="h-5 w-5" /> Clear
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* Camera Controls */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200 p-5 card-shadow"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-lg font-semibold text-blue-800">Photo Evidence</h2>
                                <span className="text-xs text-slate-500">Capture or upload</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {!streaming ? (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={startCam}
                                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                        aria-label="Open camera"
                                    >
                                        <Camera className="h-5 w-5" /> Camera
                                    </motion.button>
                                ) : (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={stopCam}
                                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors"
                                        aria-label="Stop camera"
                                    >
                                        <Square className="h-5 w-5" /> Stop
                                    </motion.button>
                                )}
                                <label
                                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 cursor-pointer transition-colors"
                                    aria-label="Upload photo"
                                >
                                    <Upload className="h-5 w-5" /> Upload
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => upload(e.target.files?.[0])}
                                    />
                                </label>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={capture}
                                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors"
                                    aria-label="Take photo"
                                >
                                    <ImageIcon className="h-5 w-5" /> Capture
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={clearPhoto}
                                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors"
                                    aria-label="Clear photo"
                                >
                                    <Trash2 className="h-5 w-5" /> Clear
                                </motion.button>
                            </div>
                            {streaming && (
                                <div className="mt-4 rounded-xl overflow-hidden border border-slate-200 shadow-inner">
                                    <video
                                        ref={videoRef}
                                        className="w-full h-[240px] object-cover bg-black"
                                        autoPlay
                                        playsInline
                                    />
                                </div>
                            )}
                            {photoDataUrl && (
                                <div className="mt-4">
                                    <div className="text-sm font-medium text-slate-700 mb-2">Preview</div>
                                    <div className="rounded-xl overflow-hidden border border-slate-200 shadow-inner">
                                        <img
                                            src={photoDataUrl}
                                            alt="Evidence"
                                            className="w-full max-h-[320px] object-contain bg-slate-50"
                                        />
                                    </div>
                                </div>
                            )}
                        </motion.div>

                        {/* Submit Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200 p-5 card-shadow flex flex-col justify-between"
                        >
                            <div>
                                <h2 className="text-lg font-semibold text-green-800">Submit Complaint</h2>
                                <p className="text-sm text-slate-500 mb-4">Review details and send.</p>
                                <ul className="text-sm text-slate-700 space-y-2">
                                    <li>
                                        <span className="text-slate-500">Nepali:</span>{" "}
                                        {npText ? `${npText.slice(0, 60)}${npText.length > 60 ? "…" : ""}` : "—"}
                                    </li>
                                    <li>
                                        <span className="text-slate-500">English:</span>{" "}
                                        {enText ? `${enText.slice(0, 60)}${enText.length > 60 ? "…" : ""}` : "—"}
                                    </li>
                                    <li>
                                        <span className="text-slate-500">Location:</span>{" "}
                                        {coords ? `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}` : "—"}
                                    </li>
                                    <li>
                                        <span className="text-slate-500">Photo:</span>{" "}
                                        {photoDataUrl ? "Attached" : "—"}
                                    </li>
                                </ul>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={sendToWebhook}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-green-600 text-white hover:bg-green-700 shadow-md transition-colors btn-pulse"
                                    aria-label="Send complaint"
                                >
                                    <Send className="h-5 w-5" /> Send
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => copyToClipboard(enText)}
                                    className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors"
                                    aria-label="Copy English text"
                                >
                                    <Copy className="h-5 w-5" />
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Info Strip */}
                    <div className="text-xs text-slate-500 mt-6">
                        Note: Real-time speech works best in Chrome. If speech recognition is unavailable, type directly
                        in the Nepali box.
                    </div>
                </main>

                {/* Map Modal */}
                <MapPicker open={openingMap} onClose={() => setOpeningMap(false)} onPick={setCoords} value={coords} />
            </div>
        </ErrorBoundary>
    );
}