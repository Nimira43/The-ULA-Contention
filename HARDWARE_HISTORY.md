# The Real Machine: A History of the ZX Spectrum 48K

This document has nothing to do with gameplay. It's a factual reference on
the actual 1982 computer that *The ULA Contention* is set inside, and on the
real vehicle its final boss is named after. Where the game takes creative
liberties (which is often — none of these chips are actually sentient), this
document does not.

## Overview

The ZX Spectrum was an 8-bit home computer designed by Sinclair Research
Ltd and released in the United Kingdom on 23 April 1982. It was the
successor to the black-and-white ZX81, and its main selling point — as the
name suggests — was colour graphics, along with sound and a proper (if
notoriously small and rubbery) keyboard. It launched in two configurations:
a 16 KB model at £125 and a 48 KB model at £175, both very aggressively
priced for the time. Around five million units were sold across the
Spectrum family's various models before Sinclair Research's computer
business was sold to Amstrad in 1986.

The hardware design is generally credited to Richard Altwasser, with Steve
Vickers responsible for the ROM software (the built-in Sinclair BASIC
interpreter and operating system). The machine's defining hardware feature —
and the one this game is named after — was a single custom chip supplied by
Ferranti.

## The ULA (Uncommitted Logic Array)

Building a machine this cheap meant Sinclair couldn't afford the dozens of
separate logic chips a typical 1982 computer would have used for video,
memory timing, I/O, and so on. The solution was the ULA: a single custom
chip, manufactured by Ferranti, that took over the job of most of that
separate logic. On the boards this game draws from, it's marked
**Ferranti ULA 6C001E-6**.

The ULA's responsibilities included:

- Generating the video signal from screen memory
- Managing **memory contention** — arbitrating access to RAM between the
  CPU and the video circuitry, since both needed to read the same memory
  and could not do so simultaneously
- Scanning the keyboard matrix
- Driving the one-bit "beeper" audio output
- Handling tape-loading signal timing
- Controlling the border colour
- Generating sync pulses for the display

Memory contention is the real, hardware-level detail the game's title comes
from: because the ULA needed regular access to the lower 16 KB of RAM to
keep drawing the screen, it would periodically pause ("steal cycles from")
the CPU when both needed the same memory bank at once. This made programs
running in that lower memory bank measurably slower than identical code
run in the upper 32 KB, which didn't share this contention — a real,
documented quirk of the machine, not a game design fiction.

## CPU

The Spectrum's processor is a Zilog Z80A, or a compatible licensed clone
(NEC's version, the D780C-1, appears on many boards) clocked at 3.5 MHz.
Because of the memory contention described above, the CPU's *effective*
throughput was somewhat lower than the raw clock speed would suggest,
depending on what memory a given program was running from.

## Memory

The 48K Spectrum's memory is split into two regions with different
electrical requirements:

- **ROM**: 16 KB, holding Sinclair BASIC and the operating system.
- **Lower RAM (16 KB, addresses 0x4000–0x7FFF)**: built from eight 4116
  DRAM chips. These chips required three separate voltage rails (+5V, +12V,
  and −5V), which made this part of the board more failure-prone over time —
  boards of this era often show heatsink discolouration or corrosion around
  this bank as a result. This is also the memory bank subject to ULA
  contention, described above.
- **Upper RAM (32 KB, addresses 0x8000–0xFFFF)**: built from a different
  generation of DRAM chip (4532 or 4164 depending on the board revision),
  needing only a single +5V rail and generally more reliable.

## Video and colour

The Spectrum's display is 256×192 pixels, offering 15 distinct colours
(8 base colours, 7 of which also have a "bright" variant). The catch —
and the source of the platform's most famous visual quirk — is that colour
information ("attributes": one foreground colour, one background colour,
and a brightness/flash bit) could only be set once per 8×8 pixel block, not
per pixel. Two shapes of different colours occupying the same 8×8 block
would corrupt each other's colours — the effect fans call **colour clash**,
and a defining visual signature of Spectrum games throughout the 1980s.

## Audio

The 16K/48K Spectrum has no dedicated sound chip. Audio is produced by the
ULA toggling a single output bit, driving a small internal speaker, with
all timing handled directly by the CPU. This produces simple square-wave
tones and is the reason early Spectrum game audio has such a
distinctively harsh, "beeper" character. (Later 128K models added a
proper three-channel AY-3-8912 sound chip; the 48K does not have one.)

## Keyboard

The Spectrum's keyboard is a membrane arranged as an 8×5 matrix, scanned
directly by the ULA. Each key is heavily overloaded with meaning — Sinclair
BASIC used single keypresses to enter whole keywords (`LOAD`, `PRINT`, and
so on) rather than typing them letter by letter, which is a large part of
why the keyboard could get away with having so few keys.

## Storage: cassette tape

The 48K Spectrum has no disk drive as standard; software loaded from
ordinary compact cassette tape via a simple comparator circuit plus a
handful of resistors and capacitors, with the ULA handling the pulse
timing. The screeching audio that accompanied loading was the raw
modulated data signal itself, audible because it was routed through a
standard cassette recorder rather than being inaudible as on some other
platforms. Loading a full 48K program from tape commonly took several
minutes.

## Power and video output

Power regulation and RF video modulation (converting the machine's internal
video signal into a signal a domestic television could display) were
typically handled by a small metal-cased module, often supplied by ASTEC
International on Issue 3/4A boards. This module also provided a degree of
electrical isolation between the computer and the television it was
plugged into.

## Expansion

The rear edge connector exposed the full Z80 bus, the ULA's I/O lines,
power rails, and the video signal. This one connector is what allowed the
Spectrum's substantial third-party expansion ecosystem to exist at all —
peripherals like the Sinclair Microdrive, the Interface 1 (adding
networking and Microdrive support), and third-party joystick interfaces
such as the Kempston interface all worked by tapping into this bus.

## Decline

Sinclair Research's financial position weakened through the mid-1980s,
worsened by the commercial failure of the Sinclair QL computer and the
Sinclair C5 (below). In 1986, Sinclair sold its computer business,
including the Spectrum range and the Sinclair brand name itself, to
Amstrad, under Alan Sugar. Amstrad continued producing Spectrum models
until 1992.

---

## The Sinclair C5

The Sinclair C5 is a separate product from the Spectrum, but shares its
creator: Sir Clive Sinclair, whose company Sinclair Vehicles Ltd (founded
1983) built it as the first step toward a planned range of electric
vehicles.

- **Launched**: 10 January 1985
- **Type**: single-seat battery-electric recumbent tricycle, legally
  classed as an electrically assisted pedal cycle rather than a motor
  vehicle
- **Power**: a 250W (0.34 hp) electric motor, assisted by pedals, drawing
  from a 12V lead-acid battery
- **Top speed**: 15 mph (24 km/h) — a legal limit for its vehicle class,
  not just a technical ceiling
- **Range**: officially 20 miles (32 km), though many owners reported
  significantly less in practice, especially in cold weather
- **Price**: £399 at launch

The C5 was received poorly by the press and by motoring and consumer
safety organisations, who raised concerns about its low seating position
making it hard for other road users to see, its complete lack of weather
protection, and its limited real-world range. Production was scaled back
within months of launch and ceased entirely by August 1985. Some sources
put total production as low as 14,000–17,000 units. The failure of the C5
is widely regarded as one of the most notable commercial failures in
British consumer product history, and contributed to the financial
pressure that led to Sinclair Research's computer business being sold to
Amstrad the following year.

Despite its top speed being legally capped at 15 mph, it is worth noting
in fairness to the vehicle: a modified C5 has since been recorded reaching
150 mph. The stock 1985 production model was never remotely capable of
this, which is why the version appearing in this game does not move.

---

*General historical sources: Wikipedia, Computing History (computinghistory.org.uk),
Spectrum Computing (spectrumcomputing.co.uk), and contemporary Sinclair
documentation.*
