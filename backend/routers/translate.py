# ═══════════════════════════════════════════════════════════════════
# translate.py  –  Multi-language & Translation
# ═══════════════════════════════════════════════════════════════════
from fastapi import APIRouter as _APIRouter, Depends as _Depends
from pydantic import BaseModel as _BM
from typing import Optional as _Opt, List as _List
from services.ai_service import translate_text as _translate
from routers.auth import get_current_user as _gcu
from models.user import User as _User

router = _APIRouter()

SUPPORTED_LANGUAGES = {
    "en":"English","hi":"Hindi","ta":"Tamil","te":"Telugu","ml":"Malayalam",
    "kn":"Kannada","fr":"French","de":"German","es":"Spanish","it":"Italian",
    "pt":"Portuguese","ru":"Russian","zh":"Chinese","ja":"Japanese","ko":"Korean",
    "ar":"Arabic","th":"Thai","vi":"Vietnamese","id":"Indonesian","tr":"Turkish",
    "nl":"Dutch","pl":"Polish","sv":"Swedish","no":"Norwegian","fi":"Finnish",
}

class TranslateRequest(_BM):
    text: str
    target_lang: str
    source_lang: _Opt[str] = "auto"

@router.post("/text")
async def translate(req: TranslateRequest, current_user: _User = _Depends(_gcu)):
    return await _translate(req.text, req.target_lang, req.source_lang)

@router.get("/languages")
async def languages():
    return {"languages": [{"code": k, "name": v} for k, v in SUPPORTED_LANGUAGES.items()]}

@router.post("/detect")
async def detect_language(text: str):
    msgs = [{"role":"user","content":f"Detect the language of this text and return only the ISO 639-1 language code (e.g. 'en','fr','ja'): {text}"}]
    from services.ai_service import chat_with_ai
    code = await chat_with_ai(msgs)
    return {"text": text, "detected_lang": code.strip()[:5]}
