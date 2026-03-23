"""
Core configuration — API key management.
Extracted from LangChain_model.py with zero logic changes.
"""
from dotenv import load_dotenv
import os
import random

load_dotenv()


def get_random_gemini_key():
    """Return a random GEMINI_KEY_* from environment variables."""
    keys = []
    for key, value in os.environ.items():
        if key.startswith("GEMINI_KEY_"):
            keys.append(value)

    if keys:
        return random.choice(keys)
    else:
        raise ValueError("No GEMINI_KEY_ found in environment variables.")
