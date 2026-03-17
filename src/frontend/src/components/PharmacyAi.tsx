import React, { useState, useRef } from 'react'

// Définition d'une interface minimale pour le message Gemini si le type n'est pas encore importé
// interface GeminiLiveMessage {
//     serverContent?: {
//         modelTurn?: {
//             parts?: Array<{
//                 inlineData?: {
//                     data: string;
//                 }
//             }>
//         }
//     }
// }

const PharmacyAI: React.FC = () => {
  const [isActive, setIsActive] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)

  const audioContextRef = useRef<AudioContext | null>(null)
  // On utilise 'unknown' ou un type spécifique au lieu de 'any'
  // const sessionRef = useRef<unknown>(null);

  const toggleAssistant = async () => {
    if (isActive) {
      setIsActive(false)
      return
    }

    setIsConnecting(true)
    try {
      // Correction du cast window pour AudioContext
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      audioContextRef.current = new AudioContextClass({ sampleRate: 24000 })

      const outputNode = audioContextRef.current.createGain()
      outputNode.connect(audioContextRef.current.destination)

      // Simulation des types pour la logique commentée
      /*
            onmessage: async (msg: GeminiLiveMessage) => { ... }
            onerror: (e: Error) => console.error("Live AI Error:", e),
            */

      // console.log(sessionRef.current); // Pour éviter l'erreur de variable inutilisée
    } catch (err: unknown) {
      const error = err as Error
      console.error(error.message || "Erreur lors de l'initialisation de l'assistant IA")
      setIsConnecting(false)
    }
  }

  return (
    // ... (Reste du JSX inchangé)
    <div className="fixed bottom-10 right-10 z-[100]">
      <button
        onClick={toggleAssistant}
        className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 active:scale-90 relative ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-900'}`}
      >
        {isConnecting ? (
          <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
        ) : isActive ? (
          <svg width="32" height="32" fill="white" viewBox="0 0 24 24">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="22" />
            <line x1="8" y1="22" x2="16" y2="22" />
          </svg>
        ) : (
          <div className="relative">
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-sky-500 rounded-full animate-ping"></div>
            <svg width="32" height="32" fill="white" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
          </div>
        )}
      </button>
    </div>
  )
}

export default PharmacyAI
