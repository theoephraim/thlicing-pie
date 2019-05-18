<template lang='pug'>
.popup(v-if='isActive' :class='classes')
  .popup-mask
  .popup-wrapper
    h2.popup-title(data-cy='popup-title') {{ title }}
    .popup-close-x(@click='close' v-if='!noExit')
      icon(name='times')
    .popup-content
      .popup-content-top
        slot(name='top')
      .popup-content-scroll
        slot
      .popup-content-bottom
        slot(name='bottom')
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  metaInfo() {
    if (!this.isActive) return {};
    // CAUTION - only a single body class can be set this way at a time
    // generally we should be avoiding body classes though, so it's ok for now?
    return { bodyAttrs: { class: 'popup-active' } };
  },
  props: {
    title: { type: String },
    fullScreen: { type: Boolean, default: false },
    noExit: { type: Boolean, default: false },
    startOpen: Boolean,
  },
  data() {
    return {
      isActive: this.startOpen,
    };
  },
  computed: {
    ...mapGetters(['apiErrorCode']),
    classes() {
      return {
        'popup--fullscreen': this.fullScreen,
        'popup--modal': !this.fullScreen,
      };
    },
  },
  methods: {
    open() {
      this.isActive = true;
      if (!this.noExit) {
        window.addEventListener('keyup', this.onKeyUp);
      }
    },
    close() {
      if (this.apiErrorCode) {
        this.$store.commit('HIDE_API_ERROR_POPUP');
      }
      this.isActive = false;
      this.$emit('close');
      window.removeEventListener('keyup', this.onKeyUp);
    },
    onKeyUp(e) {
      if (e.key === 'Escape') {
        this.close();
      }
    },
  },
};
</script>

<style lang='less'>
body.popup-active {
  overflow: hidden;
  .popup-mask { display: block; }
}

.popup-mask {
  background: fade(#dee8f9, 95);
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2000;
  display: none;
}
.header-bar .popup-mask {
  position: absolute;
}
.popup {
  .popup-wrapper {
    z-index: 2001;
    position: fixed;
    text-shadow: none;
    bottom: 20px;

    @media @mq-medium {
      margin: 0 auto;
      width: 650px;
      left: 50%;
      margin-left: -300px;
      top: 100px;
    }
    @media @mq-small-only {
      left: 10px;
      right: 10px;
      margin-top: 40px;
      bottom: 10px;
      //- override fullscreen setup below
      top: 0px !important;
      margin-left: 0 !important;
    }
  }
  &.popup--fullscreen {
    .popup-wrapper {
      width: 96%;
      margin-left: -48%;
      top: 44px;
    }
    .popup-content {
      min-height: 100%;
    }
    .popup-content-scroll {
      flex: 1 0 0;
    }
  }
  .popup-content {
    position: relative;
    background: white;
    border-top: 4px solid @navy;
    border-radius: 3px;
    box-shadow: 0 10px 20px 6px rgba(0, 0, 0, 0.05);
    max-height: 100%;
    z-index: 2002;
    display: flex;
    flex-direction: column;

    .popup.padded & {
      padding: 20px;
    }
    .popup.centered & {
      text-align: center;
    }

    @media @mq-small-only {
      max-height: 92%;
    }
  }
  .popup-content-top, .popup-content-bottom {
  }
  .popup-content-scroll {
    overflow: auto;
  }


  .popup-close-x {
    position: absolute;
    top: -42px;
    right: -12px;
    color: @navy;
    width: 44px;
    height: 44px;
    padding: 8px;
    cursor: pointer;
    z-index: 2002;
    svg {
      scale: 1;
      transition: all 0.3s;
      display: block;
      width: 100%;
      height: 100%;
      &:hover {
        transform: scale(1.2);
      }
    }
  }
  .popup-title {
    font-size: 24px;
    font-weight: bold;
    color: @navy;
    margin: 0;
    height: 44px;
    border-radius: 3px 3px 0 0;
    position: absolute;
    left: 2px;
    top: -36px;
  }

}
</style>
