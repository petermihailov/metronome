import type { Instrument, DrumKit, Beat, Note } from '../types/instrument';
import { getAudioContext } from '../utils/audio';

export class Player {
  private readonly audioCtx: AudioContext;
  private kit: DrumKit;
  private tempo: number;
  private beatsPerBar: number;
  private noteValue: number;
  private timeDivision: number;
  private subdivision: number;
  private muted: boolean;
  private nextBeatAt: number;
  private onBeat?: (beat: Beat) => void;
  private openBuffers: AudioBufferSourceNode[];
  private timeoutId: number | undefined;
  private notes: Note[];
  private needFinish: boolean;

  constructor() {
    this.kit = {} as DrumKit;
    this.tempo = 60;
    this.noteValue = 4;
    this.beatsPerBar = 4;
    this.timeDivision = 16;
    this.notes = [];
    this.subdivision = 1;
    this.muted = false;
    this.nextBeatAt = 0;
    this.audioCtx = getAudioContext();
    this.openBuffers = [];
    this.needFinish = false;
  }

  public setKit(kit: DrumKit) {
    this.kit = kit;
  }

  public setTempo(bpm: number) {
    this.tempo = bpm;
  }

  public setBeatsPerBar(value: number) {
    this.beatsPerBar = value;
  }

  public setNoteValue(value: number) {
    this.noteValue = value;
  }

  public setTimeDivision(value: number) {
    this.timeDivision = value;
  }

  public setNotes(notes: Note[]) {
    this.notes = notes;
  }

  public setNote(index: number, note: Note) {
    this.notes[index] = note;
  }

  public setSubdivision(subdivision: number) {
    this.subdivision = subdivision;
  }

  public mute() {
    this.muted = true;
  }

  public unmute() {
    this.muted = false;
  }

  public isMuted() {
    return this.muted;
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

  public gentlyStop() {
    this.needFinish = true;
  }

  private playNotesAtNextBeatTime(time: number, instrument: Instrument) {
    const source = this.audioCtx.createBufferSource();
    source.buffer = this.kit[instrument];
    source.connect(this.audioCtx.destination);
    source.start(time);

    this.openBuffers.push(source);
  }

  schedule(index: number) {
    // Schedule next
    this.nextBeatAt += 60 / ((this.tempo * this.notes.length) / this.beatsPerBar);
    const nextIndex = (index + 1) % this.notes.length;
    const nextNote = this.notes[nextIndex];

    if (this.needFinish && (nextIndex === 2 || this.notes.length === 1)) {
      this.stop();
      return;
    }

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
