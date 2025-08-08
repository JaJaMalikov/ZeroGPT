"""High-level interface for ZeroGPT library.

Provides a convenient wrapper that exposes all features of the
underlying Client and helper utilities in a single class.
"""

from __future__ import annotations

from typing import Generator, List, Dict, Any, Union

from .client import Client
from .utils.cli import Chat
from .utils.prompt import Dummy
from .utils.tools.image_to_prompt import image_to_prompt, get_prompt_styles
from .utils.settings import settings


class ZeroGPT:
    """Convenient interface combining all library features.

    Parameters
    ----------
    instruction: str | None
        Optional system instruction for the assistant.
    think: bool
        If ``True`` a reasoning model is used.
    uncensored: bool
        If ``True`` uncensored mode is enabled.
    """

    def __init__(self, instruction: str | None = None, *, think: bool = False, uncensored: bool = False) -> None:
        self.client = Client()
        self.chat = Chat(instruction=instruction, think=think, uncensored=uncensored)

    # ------------------------------------------------------------------
    # Chat functionality
    # ------------------------------------------------------------------
    def chat_message(self, text: str, trying: int = 50) -> Union[str, None]:
        """Send a message and return the full response."""
        return self.chat.send_message(text, trying=trying)

    def stream_chat(self, text: str) -> Generator[str, None, None]:
        """Stream chunks of the assistant response.

        History is preserved similarly to :meth:`chat_message`.
        """
        history = self.chat.history + [{"role": "user", "content": text}]
        collected: List[str] = []
        for chunk in self.client.send_message(history, self.chat.instruction, self.chat.think, self.chat.uncensored, stream=True):
            collected.append(chunk)
            yield chunk
        # Store the exchange for future context
        self.chat.history.append({"role": "user", "content": text})
        self.chat.history.append({"role": "assistant", "content": ''.join(collected)})

    def reset_chat(self) -> None:
        """Clear conversation history."""
        self.chat.history.clear()

    # ------------------------------------------------------------------
    # Context management via Dummy
    # ------------------------------------------------------------------
    def save_history(self, filename: str = "./context/data.bin") -> None:
        """Save current chat history to disk."""
        Dummy().create(messages=self.chat.history).save(filename)

    def load_history(self, filename: str = "./context/data.bin") -> List[Dict[str, Any]]:
        """Load chat history from disk."""
        dummy = Dummy().load(filename)
        data = dummy.get_data() or []
        self.chat.history = data
        return data

    # ------------------------------------------------------------------
    # Image generation helpers
    # ------------------------------------------------------------------
    def create_image(self, *args: Any, **kwargs: Any) -> Dict[str, Any]:
        """Proxy to :meth:`Client.create_image`."""
        return self.client.create_image(*args, **kwargs)

    def get_image(self, request_id: str, trying: int = 10):
        """Proxy to :meth:`Client.get_image`."""
        return self.client.get_image(request_id, trying=trying)

    # ------------------------------------------------------------------
    # Utilities
    # ------------------------------------------------------------------
    @staticmethod
    def image_to_prompt(image_path: Union[str, bytes, List[Union[str, bytes]]], prompt_style: str = "tag") -> List[Dict[str, Any]]:
        """Convert image(s) to prompt using :func:`image_to_prompt`."""
        return image_to_prompt(image_path, prompt_style)

    @staticmethod
    def prompt_styles() -> List[str]:
        """Return available prompt styles for :func:`image_to_prompt`."""
        return get_prompt_styles()

    @property
    def settings(self):
        """Expose global settings instance."""
        return settings

__all__ = ["ZeroGPT"]
