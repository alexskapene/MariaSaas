import { GoogleGenAI, Type, Modality, LiveCallbacks } from '@google/genai'
import { ProductDTO } from '@shared/types'

const ai = new GoogleGenAI({ apiKey: process.env.VITE_GOOGLE_API_KEY })
// Note: Dans Vite, on utilise import.meta.env
// const apiKey = import.meta.env.VITE_GOOGLE_API_KEY || "";
// const genAI = new GoogleGenAI(apiKey);

export const getPharmacyAdvice = async (medication: string, context: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          parts: [
            {
              text: `En tant qu'assistant pharmacien expert, réponds à cette question concernant ${medication}. Contexte actuel: ${context}. Sois précis sur les dosages et contre-indications.`
            }
          ]
        }
      ],
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    })
    return response.text
  } catch (error) {
    console.error('Gemini Error:', error)
    return 'Désolé, je ne peux pas traiter votre demande pour le moment.'
  }
}

export const analyzeInventory = async (items: ProductDTO[]) => {
  try {
    const prompt = `Analyse ce stock de pharmacie et suggère des actions (réapprovisionnement, alertes péremption). 
    Réponds uniquement en JSON valide avec 'summary' et 'critical_actions'. 
    Données : ${JSON.stringify(items)}`

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            critical_actions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ['summary', 'critical_actions']
        }
      }
    })
    return JSON.parse(response.text || '{}')
  } catch (error) {
    console.error('Analysis Error:', error)
    throw error
  }
}

export const connectToPharmacyLive = (callbacks: LiveCallbacks) => {
  return ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-12-2025',
    callbacks,
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
      },
      systemInstruction:
        "Tu es Maria, l'assistante IA experte de la pharmacie MariaSaas. Tu aides les pharmaciens en temps réel sur les dosages, les interactions médicamenteuses et la gestion des stocks. Sois brève, professionnelle et rassurante."
    }
  })
}
