import os
import tempfile
import whisper
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="ASR Service (Whisper)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Whisper model once at startup
model = whisper.load_model("base")   # or "small", "medium", etc.

@app.post("/transcribe")
async def transcribe(audio: UploadFile = File(...), language: str = "auto"):
    """
    Windows‑safe Whisper ASR endpoint.
    Saves uploaded audio to a temporary WAV file,
    closes it (important on Windows),
    then passes the path to Whisper.
    """

    # Read uploaded audio bytes
    data = await audio.read()

    # Create a Windows‑safe temp file
    tmp = tempfile.NamedTemporaryFile(suffix=".wav", delete=False)
    try:
        tmp.write(data)
        tmp.close()  # CRITICAL on Windows — releases file lock

        # Whisper expects a file path
        result = model.transcribe(
            tmp.name,
            language=None if language == "auto" else language
        )

        return result

    finally:
        # Clean up temp file
        try:
            os.unlink(tmp.name)
        except OSError:
            pass


@app.get("/health")
def health():
    return {"status": "ok"}
