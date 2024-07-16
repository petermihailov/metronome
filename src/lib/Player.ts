import { DEFAULTS } from '../constants';
import type { Instrument, SoundMap, Beat, Note } from '../types/common';
import { getAudioContext } from '../utils/audio';

export class Player {
  private readonly audioCtx: AudioContext;
  private kit: SoundMap;
  private tempo: number;
  private beats: number;
  private noteValue: number;
  private subdivision: number;
  private volume: number;
  private nextBeatAt: number;
  private onBeat?: (beat: Beat) => void;
  private openBuffers: AudioBufferSourceNode[];
  private timeoutId: number | undefined;
  private notes: Note[];

  constructor() {
    this.kit = {} as SoundMap;
    this.tempo = DEFAULTS.tempo;
    this.noteValue = DEFAULTS.noteValue;
    this.beats = DEFAULTS.beats;
    this.notes = [];
    this.subdivision = DEFAULTS.subdivision;
    this.volume = DEFAULTS.volume;
    this.nextBeatAt = 0;
    this.audioCtx = getAudioContext();
    this.openBuffers = [];
  }

  public setKit(kit: SoundMap) {
    this.kit = kit;
  }

  public setTempo(bpm: number) {
    this.tempo = bpm;
  }

  public setBeats(value: number) {
    this.beats = value;
  }

  public setNoteValue(value: number) {
    this.noteValue = value;
  }

  public setNotes(notes: Note[]) {
    this.notes = notes;
  }

  public setVolume(volume: number) {
    this.volume = volume;
  }

  public setSubdivision(subdivision: number) {
    this.subdivision = subdivision;
  }

  public setOnBeat(onBeat: (beat: Beat) => void) {
    this.onBeat = onBeat;
  }

  public play() {
    this.nextBeatAt = this.audioCtx.currentTime;

    if (this.notes[0]) {
      if (this.notes[0]?.instrument) {
        this.playNotesAtNextBeatTime(this.nextBeatAt, this.notes[0]?.instrument);
      }
      this.onBeat?.({ index: 0, note: this.notes[0] });
    }

    this.schedule(0);
  }

  public stop() {
    window.clearTimeout(this.timeoutId);
    this.openBuffers.forEach((buffer) => buffer.stop());
    this.openBuffers = [];
  }

  private playNotesAtNextBeatTime(time: number, instrument: Instrument) {
    const gainNode = this.audioCtx.createGain();
    gainNode.gain.value = this.volume;
    gainNode.connect(this.audioCtx.destination);

    const source = this.audioCtx.createBufferSource();
    source.buffer = this.kit[instrument];
    source.connect(gainNode);
    source.start(time);

    this.openBuffers.push(source);
  }

  schedule(index: number) {
    // Schedule next
    this.nextBeatAt += 60 / ((this.tempo * this.notes.length) / this.beats);
    const nextIndex = (index + 1) % this.notes.length;
    const nextNote = this.notes[nextIndex];

    // Schedule next beat
    if (nextNote?.instrument) {
      this.playNotesAtNextBeatTime(this.nextBeatAt, nextNote.instrument);
    }

    this.timeoutId = window.setTimeout(
      () => {
        if (nextNote) {
          this.onBeat?.({ index: nextIndex, note: nextNote });
        }

        this.schedule(nextIndex);
      },
      (this.nextBeatAt - this.audioCtx.currentTime) * 1000,
    );
  }
}
