# Universal Speaker — Real‑Time Multilingual Meeting Assistant

Universal Speaker is a cross‑platform (iOS + Android) mobile app built with **Expo + React Native**, powered by a modular backend that performs:

- 🎤 **Speech‑to‑Text (ASR)** using Whisper  
- 🌍 **Language Detection** using Whisper’s built‑in model  
- 🗣️ **Speaker Diarization** using Pyannote (Windows‑compatible pipeline)  
- 🔄 **Real‑time translation** (Phase 2)  
- 📝 **AI‑generated meeting summaries** (Phase 2)

This project is designed for **in‑person meetings**, with Phase 2 expanding into Zoom/Meet plugins.

---

## 🚀 Features (v1)

### Mobile App (Expo)
- Large central **Listen** button with pulsing animation  
- Auto‑generated **speaker icons** around the button  
- **Live subtitles** in the selected target language  
- **Stop & Process** flow  
- Clean, dark, premium UI inspired by PriceCompareAI  

### Backend
- Node.js orchestrator (`/process-audio`)  
- Python microservices:
  - **ASR** (Whisper)
  - **Diarization** (Pyannote-compatible)
- Automatic WAV conversion for diarization  
- Unified JSON response:
  ```json
  {
    "language": "hi",
    "text": "Namaste...",
    "diarization": [
      { "speaker": "SPK_1", "start": 0, "end": 2.3 }
    ]
  }
