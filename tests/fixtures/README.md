# Voice fixture

`second-voice.wav` was generated locally on Windows using System.Speech and the installed Microsoft Helena Desktop voice, 2026-10-21. It is a distinct utterance from the repository demo, with no remote TTS or image AI.

Text: “Bienvenido al bar. Esta grabacion tiene otra voz y un ritmo diferente. Hacemos una pausa y seguimos conversando.”

The automated WAV test uses this voice and the original Spanish demo, then feeds two seconds of silence through the same RMS/gate/dynamics functions. This is signal-level verification, not proof of browser playback or audible output.
