# manta2midi for MaxMSP

This patch is still very much a work in progress.

Inspired by [Vlad Spear's Honeycomb][honeycomb], manta2midi fills
a similar of converting data from the [Snyderphonics Manta][manta] to
MIDI, but brings usage of the [newer 1.04b `manta` Max object][mantamax]
and provides reconfigurability.

Requires both a Manta and the newer Manta Max/MSP object.

[honeycomb]: http://vladspears.com/post/honeycomb.html
[manta]: http://snyderphonics.com/products.htm
[mantamax]: http://snyderphonics.com/downloads.htm

## Features

1) Configurable Tone Relationships.  The `row` and `col` messages to
manta2midi set the relationship between the hexagon pads in number of
semitones.  Rows 3-4 are offset by -1 and rows 5-6 by -2, such that from
pad 0 (bottom left), a "row" continuously goes up and to the right, with
pad 42 (third pad from the left in the top row), mapping to `(5 * row)`
semitones from pad 0, and pad 40 (first pad on the left in the top row)
mapping to `(5 * row - 2 * col)` semitones from pad 0.

  Plans exist to allow non-linear mapping of the rows and columns, to
conform to a scale, for example.

  There are currently two presets:
  - `(8, 3)` uses the same layout as [Honeycomb][], realizing the 
    ["Tónová mřížka"][tm] as hardware.  It spans four and a half octaves,
    and makes it incredibly easy to perform standard chord formations,
    with inversions.  Each row increases by 8 semitones (flatted sixth),
    each column by 3 (minor third).

  - `(5, 2)` is a layout that I have found very useful for improvising
    melodies on.  It spans almost three octaves, each row increases by
    5 semitones (fourth) and each column by 2 semitones (whole tone).
    Standard chord progressions without inversions are easy, but the main
    goal of this layout is to provide easy access to intermediate notes in
    the same octave: the second, the fourth, and so-on.

[tm]: http://dusan.pc-slany.cz/hudba/mrizka.htm

2) Rich Midi Data.  MIDI note velocity is sent as provided by the Manta
for note-on messages, as well as Polykey Pressure messages and Channel
Aftertouch.  Caveat Emptor: I haven't been able to test Polykey Pressure
with any non-MaxMSP synth, as nothing seems to support it, hence the need
for Channel Aftertouch.  The Aftertouch value is figured by averaging the
continuous sensor values for all currently held pads, but I have plans to
make this configurable as well.

3) Soon - Configurable Slider / Button behavior.  Currently, the sliders
map to two continuous controller parameters, which are variable based on
the buttons, which are set to a toggle switch.  This is designed for use
with NI Massive, to provide access to each of its macro controls.  Plans
exist to optionally provide behavior similar to Honeycomb.  The buttons
/ sliders currently map like so, with :

  Top slider, top buttons:
  - `[off, off]`: CC 1
  - `[on, off]`:  CC 20
  - `[off, on]`:  CC 21
  - `[on, on]`:   CC 22

  Bottom slider, bottom buttons:
  - `[off, off]`: CC 23
  - `[on, off]`:  CC 24
  - `[off, on]`:  CC 25
  - `[on, on]`:   CC 26


