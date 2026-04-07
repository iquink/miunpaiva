import { create } from "zustand";
import { createAudioPlayer, setAudioModeAsync, AudioPlayer } from "expo-audio";

interface AudioState {
  player: AudioPlayer | null;
  isPlaying: boolean;
  currentTrackId: string | null;
  currentTrackName: string | null;
  loadAndPlay: (
    trackUrl: any,
    trackId: string,
    trackName: string,
    artist?: string,
  ) => Promise<void>;
  togglePlayPause: () => void;
  stop: () => void;
}

export const useAudioStore = create<AudioState>((set, get) => ({
  player: null,
  isPlaying: false,
  currentTrackId: null,
  currentTrackName: null,

  loadAndPlay: async (trackUrl, trackId, trackName, artist) => {
    const { player, currentTrackId } = get();

    await setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: "doNotMix",
    });

    // Same track already loaded — toggle play/pause instead of reloading
    if (currentTrackId === trackId && player) {
      get().togglePlayPause();
      return;
    }

    if (player) {
      // Reuse existing player, swap the source
      player.replace(trackUrl);
      player.loop = true;
      player.play();
      if (artist) {
        player.setActiveForLockScreen(true, { title: trackName, artist });
      }
      set({
        isPlaying: true,
        currentTrackId: trackId,
        currentTrackName: trackName,
      });
      return;
    }

    // First load — create the player imperatively so it lives outside React
    const newPlayer = createAudioPlayer(trackUrl);
    newPlayer.loop = true;

    newPlayer.addListener("playbackStatusUpdate", (status) => {
      if (status.didJustFinish) {
        set({ isPlaying: false });
      } else {
        set({ isPlaying: status.playing });
      }
    });

    newPlayer.play();
    if (artist) {
      newPlayer.setActiveForLockScreen(true, { title: trackName, artist });
    }

    set({
      player: newPlayer,
      isPlaying: true,
      currentTrackId: trackId,
      currentTrackName: trackName,
    });
  },

  togglePlayPause: () => {
    const { player, isPlaying } = get();
    if (!player) return;

    if (isPlaying) {
      player.pause();
      set({ isPlaying: false });
    } else {
      player.play();
      set({ isPlaying: true });
    }
  },

  stop: () => {
    const { player } = get();
    if (player) {
      player.remove();
    }
    set({
      player: null,
      isPlaying: false,
      currentTrackId: null,
      currentTrackName: null,
    });
  },
}));
