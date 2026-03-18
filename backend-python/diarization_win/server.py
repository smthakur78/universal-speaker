# backend-python/diarization_win/server.py
import tempfile
from typing import List

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import librosa
import soundfile as sf
import torchaudio

# If you already have pyannote pipeline wired, import it here.
# from pyannote.audio import Pipeline
# pipeline = Pipeline.from_pretrained("pyannote/speaker-diarization", use_auth_token="YOUR_TOKEN")

app = FastAPI(title="Diarization Service (Windows)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class DiarizationSegment(BaseModel):
    speaker: str
    start: float
    end: float


class DiarizationResponse(BaseModel):
    segments: List[DiarizationSegment]


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/diarize", response_model=DiarizationResponse)
async def diarize(file: UploadFile = File(...)):
    """
    Accepts arbitrary audio (m4a, aac, wav, etc.), converts to 16kHz mono WAV,
    runs diarization, and returns normalized segments.
    """
    # 1) Read uploaded bytes
    data = await file.read()

    # 2) Write raw bytes to a temp file (unknown format)
    with tempfile.NamedTemporaryFile(suffix=".tmp", delete=False) as tmp_in:
        tmp_in.write(data)
        tmp_in.flush()
        tmp_in_path = tmp_in.name

    # 3) Use librosa to decode and resample to 16kHz mono
    #    This makes torchaudio + pyannote happy and avoids "Format not recognised" errors.
    y, sr = librosa.load(tmp_in_path, sr=16000, mono=True)

    # 4) Write a clean 16kHz mono PCM WAV file
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp_wav:
        sf.write(tmp_wav.name, y, 16000)
        wav_path = tmp_wav.name

    # 5) Optional: verify torchaudio can load it (good sanity check)
    waveform, sample_rate = torchaudio.load(wav_path)
    if sample_rate != 16000:
        raise RuntimeError(f"Expected 16kHz, got {sample_rate}")

    # 6) Run your diarization pipeline on wav_path
    # Replace this stub with your real pyannote pipeline call.
    #
    # diarization = pipeline(wav_path)
    # segments: List[DiarizationSegment] = []
    # for turn, _, speaker in diarization.itertracks(yield_label=True):
    #     segments.append(
    #         DiarizationSegment(
    #             speaker=speaker,
    #             start=float(turn.start),
    #             end=float(turn.end),
    #         )
    #     )

    # --- TEMPORARY MOCK IMPLEMENTATION (so backend doesn't break while you wire pyannote) ---
    # Remove this block once you plug in the real pipeline above.
    segments: List[DiarizationSegment] = [
        DiarizationSegment(speaker="SPK_1", start=0.0, end=2.3)
    ]
    # ----------------------------------------------------------------------------------------

    return DiarizationResponse(segments=segments)
