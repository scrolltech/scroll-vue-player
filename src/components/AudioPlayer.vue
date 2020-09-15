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
      @click="handleMouseClick"
      @mousemove="handleMouseMove"
      @touchmove="handleMouseMove"
      @mousedown="handleMouseDown"
      @touchstart="handleMouseDown"
      @mouseup="handleMouseUp"
      @mouseleave="handleMouseUp"
      @touchend="handleMouseUp"
      @touchcancel="handleMouseUp"
    >
      <div class="player-button gold-button">
        <i
          :class="['icon', paused ? 'audio-play-icon' : 'audio-pause-icon']"
        ></i>
      </div>

      <div ref="currentTimeEl" class="player-time player-current-time">
        {{ currentTimeText }}
      </div>

      <div ref="playerSeekbarEl" class="player-seekbar">
        <div
          ref="progressEl"
          :class="['progress', buffering ? 'indeterminate-progress' : '']"
        >
          <div ref="progressDotEl" class="progress-pin"></div>
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
const formatTime = (secNum, format) => {
  if (!secNum) {
    return "00:00";
  }
  const minutes = Math.floor(secNum / 60);
  const seconds = Math.floor(secNum - minutes * 60);
  if (format === "ISO-8601") {
    return "T" + minutes + "M" + seconds + "S";
  }
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
    },
    buffering: function(newValue, oldValue) {
      if (newValue !== oldValue && newValue)
        this.$refs.progressBarEl.style.width = "100%";
    }
  },
  computed: {
    endTimeText: function() {
      const { endTimeEl } = this.$refs;
      if (endTimeEl) {
        endTimeEl.setAttribute("content", formatTime(this.endTime, "ISO-8601"));
      }
      return formatTime(this.endTime);
    },
    currentTimeText: function() {
      const { currentTimeEl } = this.$refs;
      if (currentTimeEl) {
        currentTimeEl.setAttribute(
          "content",
          formatTime(this.currentTime, "ISO-8601")
        );
      }
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
    handleMouseClick(e) {
      const { currentTimeEl, endTimeEl, audioEl } = this.$refs;
      const ignoreList = [currentTimeEl, endTimeEl];

      e.preventDefault();

      this.$emit("click", e);

      if (this.disabled) return;

      if (this.isNearSeekBar(e) || ignoreList.indexOf(e.target) !== -1) return;
      if (audioEl.readyState <= 1) this.buffering = true;

      this.paused = !this.paused;
    },
    onTimeUpdate() {
      if (mousedown) return;

      const { audioEl } = this.$refs;

      if (this.endTimeText === "00:00") this.endTime = audioEl.duration;

      if (audioEl.readyState > 1 && audioEl.currentTime) {
        if (!audioEl.paused) this.paused = false;
        else this.buffering = false;

        this.currentTime = audioEl.currentTime;
        this.handleProgess();
      }
    },
    handleMouseDown(e) {
      if (mousedown || this.disabled) return;
      if (this.isNearSeekBar(e)) mousedown = true;
    },
    handleMouseUp(e) {
      if (!mousedown || this.disabled) return;
      mousedown && this.scrub(e);
      mousedown = false;
    },
    handleMouseMove(e) {
      e.preventDefault();
      if (this.disabled) return;
      mousedown && this.scrub(e);
    },
    handleProgess() {
      const { progressBarEl, progressDotEl, audioEl } = this.$refs;
      const percent = (audioEl.currentTime / audioEl.duration) * 100;

      progressBarEl.style.width = `${percent}%`;
      progressDotEl.style.left = `${percent}%`;
    },
    scrub(e) {
      const isTouchEvent = e.type.includes("touch");
      const { progressBarEl, progressEl, progressDotEl, audioEl } = this.$refs;

      const progressOffset = progressEl.getBoundingClientRect();
      const progressWidth = progressEl.clientWidth;

      let slidePosition =
        (isTouchEvent ? e.changedTouches[0].clientX : e.clientX) -
        progressOffset.left;

      if (slidePosition < 0) {
        slidePosition = 0;
      } else if (slidePosition > progressWidth) {
        slidePosition = progressWidth - 1;
      }

      if (slidePosition >= 0 && slidePosition <= progressWidth - 1) {
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
          slidePosition === 0 ||
          slidePosition === progressWidth
        ) {
          audioEl.currentTime = scrubTime;
        }
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
    },
    onBuffering() {
      this.buffering = true;
    },
    onError(e) {
      this.paused = true;
      this.buffering = false;
      this.$emit("error", e);
    },
    getHnalder(handler) {
      if (this.disabled) () => {};
      else handler;
    },
    isNearSeekBar(e) {
      const isTouchEvent = e.type.includes("touch");
      const { progressEl, playerEl } = this.$refs;
      const progressElOffset = progressEl.getBoundingClientRect();
      const playerElOffset = playerEl.getBoundingClientRect();
      const touchPointX = isTouchEvent ? e.touches[0].clientX : e.clientX;
      const touchPointY = isTouchEvent ? e.touches[0].clientY : e.clientY;

      if (
        touchPointX >= progressElOffset.left &&
        touchPointX <= progressElOffset.left + progressEl.clientWidth &&
        touchPointY >= playerElOffset.top &&
        touchPointY <= playerElOffset.top + playerEl.clientHeight
      ) {
        return true;
      }
      return false;
    }
  }
};
</script>
