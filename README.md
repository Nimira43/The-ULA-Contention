# 🧠 The ULA Contention  

> *A tiny hero. A furious motherboard. And a deeply resentful electric trike with unresolved issues.*

Somewhere inside a 1982 ZX Spectrum, the laws of physics have clocked off early.  
Memory’s leaking like a pub pint left on the radiator. Logic gates are arguing with reality.  
The CPU’s making noises that would get it banned from polite silicon society.  

And deep in the circuitry, plotting revenge like a soap‑opera villain, sits the **Sinclair C5** —  
a vehicle so bitter about the Spectrum’s success it’s decided to corrupt the motherboard out of spite.  

You, brave microhero, have been dispatched to fix it. You are very small. You have a laser.  
This is not a fair fight, but neither was the 1980s.

---

## 💾 What Is This, Actually?

*The ULA Contention* is a top‑down, Gauntlet‑shaped, Fat‑Worm‑Blows‑A‑Sparky‑adjacent shooter built in **vanilla JavaScript and Canvas2D via Vite**, because game engines are for people who fear commitment.  

You’ll zap your way through a procedurally generated motherboard, one room at a time, fixing memory leaks, debating logic gates, and eventually having a **Serious Conversation** with an unhinged CPU.  

Every enemy is a real ZX Spectrum component that’s having a very bad day.  

---

## ⚙️ Features (Allegedly)

- **A loading screen with standards.** You must type `LOAD ""` yourself. Using the keyboard.  
- **Resistor colour codes** determine enemy toughness. Educational *and* petty.  
- **A Pang tribute** made entirely of corruption. Shoot the big red circle. Watch it multiply like guilt.  
- **A boss fight with a CPU** that just wants to be stabilised, not murdered. Therapy optional.  
- **Eight background tracks** looping forever, because one track is ambience and eight is a lifestyle.  
- **A final boss that cannot move.** The Sinclair C5 will not chase you. It will, however, shoot at you with the quiet confidence of something that’s accepted its own limitations.

---

## 🎮 Controls

| Key | Function |
| --- | --- |
| Arrow keys / WASD | Move and face. You fire wherever you’re looking, Gauntlet‑style. |
| Space (hold) | Fire your zap at a civilised ~6 shots/sec. This is not a bullet hell. Mostly. |
| H | Consume a health pickup, assuming you’ve been sensible. |
| Enter | Confirm `LOAD ""`, then start the game. Tradition matters. |
| 1–9, 0 | Dev builds only (`npm run dev`): jump straight to a level (0 = level 10). Stripped from production builds, so no cheating your way to the C5 |

---

## 🧰 Running It

```bash
npm install
npm run dev
```

Then open it, type `LOAD ""` like a person who respects history, and wait for the nice stripy border to finish doing its thing.  
This is **authentic Speccy behaviour** and absolutely **not a bug**.

---

## 🕹️ The Levels

1. **ROM Chamber** — gentle introduction; resistor swarm harassing your ROM chip for sport.  
2. **Address Bus** — logic gates that only feel vulnerable when they’re in the mood.  
3. **Status Register** — RAM chips that split when emotionally wounded; Flag Wraiths haunt your syntax.  
4. **Intrusion** — three corruption circles, Pang rules, existential dread.  
5. **The Unhinged CPU** — a boss fight. It gets faster and angrier the more of it you destroy, which feels rude but is technically motivating.
6. **The ULA Contention** — the level that shares the game's name, so it colour-cycles the walls here just to earn it.
7. **Upper RAM** — same enemies as level 3, wearing different hats
8. **ASTEC PSU Chamber** — protect the power supply from a tougher class of resistor that has clearly decided this is personal.
9. **The Rogue ULA** — the chip this whole game is named after, gone rogue, and only willing to be hurt when it's in the mood. Memory contention, but make it a boss fight.
10. **The Sinclair C5** — a faithful reproduction sporting five gun turrets, zero mobility, one grudge. You get three lives to face this... this... Oh dear.

---

## 🧠 Historical Accuracy (Sort Of)

We’ve tried, genuinely, to make the chip lore correct.  
The ULA really did handle video, memory contention, sound, and keyboard scanning.  
The C5 really was a commercial disaster.  
The 4116 RAM chips really did need three voltage rails and were fragile enough to cry.  

None of the chips have, to our knowledge, achieved sentience or malice.  
We’ve taken creative liberties on that specific point.

---

## 🪙 Licence

TBD — currently operating under the honour system and the assumption that nobody will sue a hobby project about a haunted motherboard.

---
