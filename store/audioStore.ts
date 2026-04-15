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
  // Active mode for Hub widget
  activeMode: "mixer" | "player" | null;
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
  activeMode: null,

  setMixerVolume: async (id, volume) => {
    const { mixerPlayers, mixerVolumes, isMixerPlaying, playerSound } = get();
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
      // Mixer is already playing — mute the player
      playerSound?.pause();
      set({ activeMode: "mixer", isPlayerPlaying: false });
      player.play();
    } else {
      player.pause();
    }
  },

  toggleMixerPlayPause: () => {
    const { isMixerPlaying, mixerPlayers, mixerVolumes, playerSound } = get();
    const next = !isMixerPlaying;

    if (next) {
      // Turning ON — pause the player
      playerSound?.pause();
      set({
        isMixerPlaying: true,
        activeMode: "mixer",
        isPlayerPlaying: false,
      });
      Object.entries(mixerPlayers).forEach(([id, player]) => {
        if ((mixerVolumes[id] ?? 0) > 0) player.play();
      });
    } else {
      set({ isMixerPlaying: false });
      Object.values(mixerPlayers).forEach((player) => player.pause());
    }
  },

  setPlayerTrack: async (id) => {
    const { playerSound, mixerPlayers } = get();
    const track = PLAYER_TRACKS[id];
    if (!track) return;

    if (playerSound) {
      playerSound.remove();
    }

    // Pause all mixer sounds
    Object.values(mixerPlayers).forEach((p) => p.pause());

    await ensureAudioMode();
    const newPlayer = createAudioPlayer(track.source);
    newPlayer.loop = true;
    newPlayer.play();

    set({
      playerSound: newPlayer,
      playerTrackId: id,
      isPlayerPlaying: true,
      activeMode: "player",
      isMixerPlaying: false,
    });
  },

  togglePlayerPlayPause: () => {
    const { playerSound, isPlayerPlaying, mixerPlayers } = get();
    if (!playerSound) return;
    const next = !isPlayerPlaying;

    if (next) {
      // Turning ON — pause all mixer sounds
      Object.values(mixerPlayers).forEach((p) => p.pause());
      playerSound.play();
      set({
        isPlayerPlaying: true,
        activeMode: "player",
        isMixerPlaying: false,
      });
    } else {
      playerSound.pause();
      set({ isPlayerPlaying: false });
    }
  },

  globalTogglePlayPause: () => {
    const {
      isMixerPlaying,
      isPlayerPlaying,
      mixerPlayers,
      mixerVolumes,
      playerSound,
      playerTrackId,
      activeMode,
    } = get();

    if (isMixerPlaying || isPlayerPlaying) {
      // Pause everything
      Object.values(mixerPlayers).forEach((p) => p.pause());
      playerSound?.pause();
      set({ isMixerPlaying: false, isPlayerPlaying: false });
    } else {
      // Resume based on last active mode
      if (activeMode === "player" && playerTrackId && playerSound) {
        playerSound.play();
        set({ isPlayerPlaying: true });
      } else if (activeMode === "mixer") {
        let didPlay = false;
        Object.entries(mixerPlayers).forEach(([id, player]) => {
          if ((mixerVolumes[id] ?? 0) > 0) {
            player.play();
            didPlay = true;
          }
        });
        if (didPlay) set({ isMixerPlaying: true });
      } else {
        // Fallback: play whatever is available
        if (playerTrackId && playerSound) {
          playerSound.play();
          set({ isPlayerPlaying: true, activeMode: "player" });
        } else {
          let didPlay = false;
          Object.entries(mixerPlayers).forEach(([id, player]) => {
            if ((mixerVolumes[id] ?? 0) > 0) {
              player.play();
              didPlay = true;
            }
          });
          if (didPlay) set({ isMixerPlaying: true, activeMode: "mixer" });
        }
      }
    }
  },

  getActiveMixerCount: () => {
    const { mixerVolumes } = get();
    return Object.values(mixerVolumes).filter((v) => v > 0).length;
  },
}));
