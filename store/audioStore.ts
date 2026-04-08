import { create } from "zustand";
import { createAudioPlayer, setAudioModeAsync, AudioPlayer } from "expo-audio";

export interface MixerTrack {
  id: string;
  nameKey: string;
  source: any;
}

export interface PlayerTrack {
  id: string;
  nameKey: string;
  source: any;
}

export const MIXER_TRACKS: Record<string, MixerTrack> = {
  rain: {
    id: "rain",
    nameKey: "track_rain",
    source: require("../assets/audio/rain.mp3"),
  },
  fire: {
    id: "fire",
    nameKey: "track_fire",
    source: require("../assets/audio/fire.mp3"),
  },
  birds: {
    id: "birds",
    nameKey: "track_birds",
    source: require("../assets/audio/birds.mp3"),
  },
  "bg-morning": {
    id: "bg-morning",
    nameKey: "track_bg_morning",
    source: require("../assets/audio/bg-morning.mp3"),
  },
  "bg-guitar": {
    id: "bg-guitar",
    nameKey: "track_bg_guitar",
    source: require("../assets/audio/bg-guitar.mp3"),
  },
  "bg-piano": {
    id: "bg-piano",
    nameKey: "track_bg_piano",
    source: require("../assets/audio/bg-piano.mp3"),
  },
  "bg-piano2": {
    id: "bg-piano2",
    nameKey: "track_bg_piano2",
    source: require("../assets/audio/bg-piano2.mp3"),
  },
};

export const PLAYER_TRACKS: Record<string, PlayerTrack> = {
  guitar1: {
    id: "guitar1",
    nameKey: "track_guitar1",
    source: require("../assets/audio/guitar1.mp3"),
  },
  guitar2: {
    id: "guitar2",
    nameKey: "track_guitar2",
    source: require("../assets/audio/guitar2.mp3"),
  },
};

interface AudioState {
  // Mixer state
  isMixerPlaying: boolean;
  mixerVolumes: Record<string, number>;
  mixerPlayers: Record<string, AudioPlayer>;
  // Player state
  isPlayerPlaying: boolean;
  playerSound: AudioPlayer | null;
  playerTrackId: string | null;
  // Mixer actions
  setMixerVolume: (id: string, volume: number) => Promise<void>;
  toggleMixerPlayPause: () => void;
  // Player actions
  setPlayerTrack: (id: string) => Promise<void>;
  togglePlayerPlayPause: () => void;
  // Global / hub
  globalTogglePlayPause: () => void;
  getActiveMixerCount: () => number;
}

const ensureAudioMode = async () => {
  await setAudioModeAsync({
    playsInSilentMode: true,
    shouldPlayInBackground: true,
  });
};

export const useAudioStore = create<AudioState>((set, get) => ({
  isMixerPlaying: false,
  mixerVolumes: {},
  mixerPlayers: {},
  isPlayerPlaying: false,
  playerSound: null,
  playerTrackId: null,

  setMixerVolume: async (id, volume) => {
    const { mixerPlayers, mixerVolumes, isMixerPlaying } = get();
    const clampedVolume = Math.max(0, Math.min(1, volume));

    let player = mixerPlayers[id];

    if (!player) {
      if (clampedVolume === 0) {
        set({ mixerVolumes: { ...mixerVolumes, [id]: 0 } });
        return;
      }
      const track = MIXER_TRACKS[id];
      if (!track) return;
      await ensureAudioMode();
      player = createAudioPlayer(track.source);
      player.loop = true;
      player.volume = clampedVolume;
      set({
        mixerVolumes: { ...mixerVolumes, [id]: clampedVolume },
        mixerPlayers: { ...get().mixerPlayers, [id]: player },
      });
    } else {
      player.volume = clampedVolume;
      set({ mixerVolumes: { ...mixerVolumes, [id]: clampedVolume } });
    }

    if (clampedVolume > 0 && isMixerPlaying) {
      player.play();
    } else {
      player.pause();
    }
  },

  toggleMixerPlayPause: () => {
    const { isMixerPlaying, mixerPlayers, mixerVolumes } = get();
    const next = !isMixerPlaying;
    set({ isMixerPlaying: next });

    Object.entries(mixerPlayers).forEach(([id, player]) => {
      if (next && (mixerVolumes[id] ?? 0) > 0) {
        player.play();
      } else {
        player.pause();
      }
    });
  },

  setPlayerTrack: async (id) => {
    const { playerSound } = get();
    const track = PLAYER_TRACKS[id];
    if (!track) return;

    if (playerSound) {
      playerSound.remove();
    }

    await ensureAudioMode();
    const newPlayer = createAudioPlayer(track.source);
    newPlayer.loop = true;
    newPlayer.play();

    set({ playerSound: newPlayer, playerTrackId: id, isPlayerPlaying: true });
  },

  togglePlayerPlayPause: () => {
    const { playerSound, isPlayerPlaying } = get();
    if (!playerSound) return;
    const next = !isPlayerPlaying;
    if (next) {
      playerSound.play();
    } else {
      playerSound.pause();
    }
    set({ isPlayerPlaying: next });
  },

  globalTogglePlayPause: () => {
    const {
      isMixerPlaying,
      isPlayerPlaying,
      mixerPlayers,
      mixerVolumes,
      playerSound,
      playerTrackId,
    } = get();

    if (isMixerPlaying || isPlayerPlaying) {
      Object.values(mixerPlayers).forEach((p) => p.pause());
      playerSound?.pause();
      set({ isMixerPlaying: false, isPlayerPlaying: false });
    } else {
      let didPlayMixer = false;
      Object.entries(mixerPlayers).forEach(([id, player]) => {
        if ((mixerVolumes[id] ?? 0) > 0) {
          player.play();
          didPlayMixer = true;
        }
      });
      if (didPlayMixer) {
        set({ isMixerPlaying: true });
      }
      if (playerTrackId && playerSound) {
        playerSound.play();
        set({ isPlayerPlaying: true });
      }
    }
  },

  getActiveMixerCount: () => {
    const { mixerVolumes } = get();
    return Object.values(mixerVolumes).filter((v) => v > 0).length;
  },
}));
