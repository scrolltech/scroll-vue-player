import { openBlock, createBlock, createVNode, toDisplayString, withDirectives, vShow } from 'vue';

const formatTime = secNum => {
  if (!secNum) {
    return "00:00";
  }
  const minutes = Math.floor(secNum / 60);
  const seconds = Math.floor(secNum - minutes * 60);

  return ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2);
};

let mousedown = false;

var script = {
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
      if (audioEl && newValue !== oldValue)
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
      if (!this.$refs.audioEl) return;
      this.endTime = this.$refs.audioEl.duration;
      this.$emit("loadedmetadata");
    },
    onLodedData() {
      if (!this.$refs.audioEl) return;
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

const _hoisted_1 = {
  ref: "progressEl",
  class: "progress"
};
const _hoisted_2 = {
  ref: "progressDotEl",
  class: "progress-pin"
};
const _hoisted_3 = {
  ref: "progressBarEl",
  class: "progress-bar",
  role: "progressbar",
  "aria-valuemin": "0",
  "aria-valuemax": "100",
  style: {"width":"0"}
};

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock("div", null, [
    createVNode("audio", {
      ref: "audioEl",
      src: $props.src,
      onLoadedmetadata: _cache[1] || (_cache[1] = (...args) => ($options.onLoadedMetaData && $options.onLoadedMetaData(...args))),
      onLoadeddata: _cache[2] || (_cache[2] = (...args) => ($options.onLodedData && $options.onLodedData(...args))),
      onTimeupdate: _cache[3] || (_cache[3] = (...args) => ($options.onTimeUpdate && $options.onTimeUpdate(...args))),
      onPlay: _cache[4] || (_cache[4] = (...args) => ($options.onPlay && $options.onPlay(...args))),
      onPlaying: _cache[5] || (_cache[5] = (...args) => ($options.onPlaying && $options.onPlaying(...args))),
      onWaiting: _cache[6] || (_cache[6] = (...args) => ($options.onBuffering && $options.onBuffering(...args))),
      onPause: _cache[7] || (_cache[7] = (...args) => ($options.onPause && $options.onPause(...args))),
      onEnded: _cache[8] || (_cache[8] = (...args) => ($options.onEnded && $options.onEnded(...args))),
      onError: _cache[9] || (_cache[9] = (...args) => ($options.onError && $options.onError(...args)))
    }, null, 40 /* PROPS, HYDRATE_EVENTS */, ["src"]),
    createVNode("div", {
      class: [
        'audio-player',
        $data.paused ? '' : 'audio-player-playing',
        $props.disabled ? 'audio-player-initialising' : ''
      ],
      ref: "playerEl",
      onClick: _cache[19] || (_cache[19] = (...args) => ($options.handlePlayerClick && $options.handlePlayerClick(...args)))
    }, [
      createVNode("div", {
        onClick: _cache[10] || (_cache[10] = (...args) => ($options.handleIconClick && $options.handleIconClick(...args))),
        ref: "playButton",
        class: "player-button gold-button"
      }, [
        createVNode("i", {
          class: ['icon', $data.paused ? 'audio-play-icon' : 'audio-pause-icon']
        }, null, 2 /* CLASS */)
      ], 512 /* NEED_PATCH */),
      createVNode("div", {
        ref: "currentTimeEl",
        class: [
          'player-time',
          'player-current-time',
          $data.buffering ? 'player-buffering' : ''
        ]
      }, toDisplayString($options.currentTimeText), 3 /* TEXT, CLASS */),
      createVNode("div", {
        ref: "playerSeekbarEl",
        class: "player-seekbar",
        onMousemove: _cache[11] || (_cache[11] = (...args) => ($options.handleMouseMove && $options.handleMouseMove(...args))),
        onTouchmove: _cache[12] || (_cache[12] = (...args) => ($options.handleMouseMove && $options.handleMouseMove(...args))),
        onMousedown: _cache[13] || (_cache[13] = (...args) => ($options.handleMouseDown && $options.handleMouseDown(...args))),
        onTouchstart: _cache[14] || (_cache[14] = (...args) => ($options.handleMouseDown && $options.handleMouseDown(...args))),
        onMouseup: _cache[15] || (_cache[15] = (...args) => ($options.handleMouseUp && $options.handleMouseUp(...args))),
        onMouseleave: _cache[16] || (_cache[16] = (...args) => ($options.handleMouseUp && $options.handleMouseUp(...args))),
        onTouchend: _cache[17] || (_cache[17] = (...args) => ($options.handleMouseUp && $options.handleMouseUp(...args))),
        onTouchcancel: _cache[18] || (_cache[18] = (...args) => ($options.handleMouseUp && $options.handleMouseUp(...args)))
      }, [
        createVNode("div", _hoisted_1, [
          withDirectives(createVNode("div", _hoisted_2, null, 512 /* NEED_PATCH */), [
            [vShow, !$data.buffering]
          ]),
          createVNode("div", _hoisted_3, null, 512 /* NEED_PATCH */)
        ], 512 /* NEED_PATCH */)
      ], 544 /* HYDRATE_EVENTS, NEED_PATCH */),
      createVNode("div", {
        ref: "endTimeEl",
        class: "player-time player-end-time"
      }, toDisplayString($options.endTimeText), 513 /* TEXT, NEED_PATCH */)
    ], 2 /* CLASS */)
  ]))
}

script.render = render;
script.__file = "src/components/AudioPlayer.vue";

export default script;
