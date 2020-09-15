<template>
  <div id="app">
    <audio-player
      src="https://nyc3.digitaloceanspaces.com/satyagrah/audio/hwbjpkealc-1582633625.mp3"
      disabled="true"
    />
  </div>
</template>

<script>
import AudioPlayer from "./components/AudioPlayer.vue";
import "@/assets/scss/base.scss";
import "@/assets/scss/editor.scss";
import "@/assets/scss/article.scss";

export default {
  name: "App",
  components: {
    AudioPlayer
  }
};
</script>
