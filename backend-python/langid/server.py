import os
import tempfile
import librosa
import traceback
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

# If you use a model, import it here
# Example:
# from langid_model import predict_language

app = FastAPI(title="Language Identification Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/detect")
async def detect(audio: UploadFile = File(...)):
    """
    Windows‑safe language detection endpoint.
    Reads uploaded audio, saves to a temporary WAV file,
    loads with librosa, runs language detection, returns JSON.
    """

    # Read uploaded bytes
    try:
        data = await audio.read()
        # your existing code...
    except Exception as e:
        print("LANGID ERROR:", e)
        traceback.print_exc()
        raise e

    # Create a Windows‑safe temp file
    tmp = tempfile.NamedTemporaryFile(suffix=".wav", delete=False)
    try:
        tmp.write(data)
        tmp.close()  # IMPORTANT on Windows

        # Load audio
        y, sr = librosa.load(tmp.name, sr=None)

        # ----------------------------------------------------
        # Your actual language detection logic goes here
        # Replace the line below with your model
        # ----------------------------------------------------
        # lang = predict_language(y, sr)
        # For now, return dummy "en" so service works:
        lang = "en"
        # ----------------------------------------------------

        return {"language": lang}

    finally:
        # Clean up temp file
        try:
            os.unlink(tmp.name)
        except OSError:
            pass

@app.get("/health")
def health():
    return {"status": "ok"}
