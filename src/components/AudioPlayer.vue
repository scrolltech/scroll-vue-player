<template>
  <div>
    <audio
      ref="audioEl"
      :src="src"
      @loadedmetadata="onLoadedMetaData"
      @loadeddata="onLodedData"
      @timeupdate="onTimeUpdate"
      @play="onPlay"
      @playing="onPlaying"
      @waiting="onBuffering"
      @pause="onPause"
      @ended="onEnded"
      @error="onError"
    />
    <div
      :class="[
        'audio-player',
        paused ? '' : 'audio-player-playing',
        disabled ? 'audio-player-disabled' : ''
      ]"
      ref="playerEl"
      @click="handlePlayerClick"
    >
      <div
        @click="handleIconClick"
        ref="playButton"
        class="player-button gold-button"
      >
        <i
          :class="['icon', paused ? 'audio-play-icon' : 'audio-pause-icon']"
        ></i>
      </div>

      <div
        ref="currentTimeEl"
        :class="[
          'player-time',
          'player-current-time',
          buffering ? 'player-buffering' : ''
        ]"
      >
        {{ currentTimeText }}
      </div>

      <div
        ref="playerSeekbarEl"
        class="player-seekbar"
        @mousemove="handleMouseMove"
        @touchmove="handleMouseMove"
        @mousedown="handleMouseDown"
        @touchstart="handleMouseDown"
        @mouseup="handleMouseUp"
        @mouseleave="handleMouseUp"
        @touchend="handleMouseUp"
        @touchcancel="handleMouseUp"
      >
        <div ref="progressEl" class="progress">
          <div
            v-show="!buffering"
            ref="progressDotEl"
            class="progress-pin"
          ></div>
          <div
            ref="progressBarEl"
            class="progress-bar"
            role="progressbar"
            aria-valuemin="0"
            aria-valuemax="100"
            style="width: 0;"
          ></div>
        </div>
      </div>

      <div ref="endTimeEl" class="player-time player-end-time">
        {{ endTimeText }}
      </div>
    </div>
  </div>
</template>
<script>
const formatTime = secNum => {
  if (!secNum) {
    return "00:00";
  }
  const minutes = Math.floor(secNum / 60);
  const seconds = Math.floor(secNum - minutes * 60);

  return ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2);
};

let mousedown = false;

export default {
  name: "AudioPlayer",
  props: ["src", "disabled"],
  data() {
    return {
      paused: true,
      buffering: false,
      endTime: 0,
      currentTime: 0
    };
  },
  watch: {
    paused: function(newValue, oldValue) {
      const audioEl = this.$refs.audioEl;
      if (newValue !== oldValue)
        newValue ? !audioEl.paused && audioEl.pause() : audioEl.play();
    }
  },
  computed: {
    endTimeText: function() {
      return this.endTime ? formatTime(this.endTime) : "--:--";
    },
    currentTimeText: function() {
      return formatTime(this.currentTime);
    }
  },
  methods: {
    onLoadedMetaData() {
      this.endTime = this.$refs.audioEl.duration;
      this.$emit("loadedmetadata");
    },
    onLodedData() {
      this.endTime = this.$refs.audioEl.duration;
      this.buffering = false;
    },
    handlePlayerClick(e) {
      this.$emit("click", e);
    },
    handleIconClick(e) {
      const { playButton, audioEl } = this.$refs;

      if (this.disabled) return;

      if (audioEl.readyState <= 1) this.buffering = true;
      if (playButton.contains(e.target)) this.paused = !this.paused;
    },
    onTimeUpdate() {
      if (mousedown) return;

      const { audioEl } = this.$refs;

      if (!this.endTime || this.endTime !== audioEl.duration)
        this.endTime = audioEl.duration;

      if (audioEl.readyState > 1 && audioEl.currentTime) {
        if (!audioEl.paused) this.paused = false;
        else this.buffering = false;

        this.currentTime = audioEl.currentTime;
        this.handleProgess();
      }
    },
    handleMouseDown({ type, touches }) {
      if (
        type.includes("touch") &&
        this.isNearDot(touches[0].clientX, touches[0].clientY)
      )
        return;
      if (mousedown || this.disabled) return;
      mousedown = true;
    },
    handleMouseUp(e) {
      if (!mousedown || this.disabled) return;
      mousedown && this.scrub(e);
      mousedown = false;
    },
    handleMouseMove(e) {
      const isTouchEvent = e.type.includes("touch");
      const { playerSeekbarEl } = this.$refs;
      const touchPointY = isTouchEvent ? e.touches[0].clientY : e.clientY;
      const touchPointX = isTouchEvent ? e.touches[0].clientX : e.clientX;
      const { left, top } = playerSeekbarEl.getBoundingClientRect();

      if (!mousedown || this.disabled) return;

      if (e.cancelable) e.preventDefault();

      mousedown && this.scrub(e);

      if (
        touchPointY <= top ||
        touchPointY >= top + playerSeekbarEl.clientHeight ||
        touchPointX <= left - 10 ||
        touchPointX >= left + playerSeekbarEl.clientWidth + 10
      ) {
        mousedown = false;
        this.scrub(e);
      }
    },
    handleProgess() {
      const { progressBarEl, progressDotEl, audioEl } = this.$refs;
      const percent = (audioEl.currentTime / audioEl.duration) * 100;

      progressBarEl.style.width = `${percent}%`;
      progressDotEl.style.left = `${percent}%`;
    },
    scrub(e) {
      const { progressBarEl, progressEl, progressDotEl, audioEl } = this.$refs;
      const progressOffset = progressEl.getBoundingClientRect();
      const progressWidth = progressEl.clientWidth;
      let slidePosition =
        (e.type.includes("touch") ? e.changedTouches[0].clientX : e.clientX) -
        progressOffset.left;
      slidePosition =
        Math.max(slidePosition, 0) && Math.min(slidePosition, progressWidth);
      const scrubTime = (slidePosition / progressWidth) * audioEl.duration;
      const percent = (scrubTime / audioEl.duration) * 100;

      if (!this.buffering) progressBarEl.style.width = `${percent}%`;

      progressDotEl.style.left = `${percent}%`;

      this.currentTime = scrubTime;

      if (
        [
          "click",
          "mouseup",
          "touchend",
          "touchcancel",
          "touchleave",
          "mouseleave"
        ].includes(e.type) ||
        (!mousedown && e.type.includes("move"))
      ) {
        audioEl.currentTime = scrubTime;
      }
    },
    onPlay(e) {
      if (window.currentlyPlaying && window.currentlyPlaying !== e.target) {
        window.currentlyPlaying.pause();
      }
      window.currentlyPlaying = e.target;
      this.paused = false;
    },
    onPlaying() {
      this.buffering = false;
    },
    onPause() {
      this.paused = true;
    },
    onEnded() {
      this.paused = true;
      this.currentTime = 0;
      this.$refs.audioEl.currentTime = 0;
      this.handleProgess();
    },
    onBuffering() {
      this.buffering = true;
    },
    onError(e) {
      this.paused = true;
      this.buffering = false;
      this.$emit("error", e);
    },
    isNearDot(x, y) {
      const { progressDotEl } = this.$refs;
      const { top, left } = progressDotEl.getBoundingClientRect();
      if (
        x > left - 20 &&
        left + progressDotEl.clientWidth + 20 > x &&
        y > top - 20 &&
        top + progressDotEl.clientHeight + 20 > y
      )
        return false;
      return true;
    }
  }
};
</script>
