<template lang='pug'>
component.button(
  :is='tagType'
  :to='routerLinkTo'
  :href='href'
  :class='classes'
  :style='computedStyles'
  :target='targetBlank ? "_blank" : "_top"'
  :type='buttonType'
  @click='$emit("click")'
  @mouseover='isHoverActive = true'
  @mouseleave='isHoverActive = false'
)
  template(v-if='loading')
    // icon(name='spinner')
    span {{ this.loadingText }}
  template(v-else)
    // icon(v-if='icon' :name='icon')
    slot
</template>

<script>
// NOTE: we can't call it "button" due to name collision with the native html button

import tinycolor from 'tinycolor2';

const components = {
  // icon: require('./icon').default,
};

const BUTTON_SIZES = 'small medium large xlarge'.split(' ');

export default {
  components,
  props: {
    size: {
      type: String,
      validator: val => BUTTON_SIZES.includes(val),
    },
    color: { type: String, default: '#212046' },
    transparent: Boolean,
    href: String, // passes through to <a>
    to: [String, Object], // passes through to <router-link>
    toNamedRoute: String,
    disabled: Boolean,
    loading: Boolean,
    targetBlank: Boolean,
    loadingText: {
      type: String,
      default: 'Loading...',
    },
    icon: String,
    inline: Boolean,
  },
  computed: {
    tagType() {
      if (this.href) return 'a';
      if (this.to || this.toNamedRoute) return 'router-link';
      return 'button';
    },
    buttonType() {
      // otherwise <button> defaults to type=submit and makes forms submit
      return this.tagType === 'button' ? 'button' : undefined;
    },
    classes() {
      return {
        'is-hover': this.isHoverActive,
        'is-disabled': this.disabled,
        'is-loading': this.loading,
        ...this.size && { [`button--${this.size}`]: true },
        ...this.theme && { [this.theme]: true },
        ...this.inline && { 'button--inline-important': true },
      };
    },
    routerLinkTo() {
      return this.toNamedRoute ? { name: this.toNamedRoute } : this.to;
    },
    computedStyles() {
      // css that gets injected into the head
      const legibleText = tinycolor.mostReadable(this.color, ['#211e2c', '#FFF']).toHexString();
      const tc = tinycolor(this.color);

      if (this.transparent) {
        return {
          borderColor: this.color,
          color: this.color,
          backgroundColor: 'transparent',
          ...this.isHoverActive && {
            backgroundColor: tc.clone().lighten(10).toHexString(),
            color: legibleText,
          },
        };
      }

      return {
        backgroundColor: this.color,
        color: legibleText,
        ...this.isHoverActive && {
          backgroundColor: tc.clone().lighten(10).toHexString(),
        },
      };
    },
  },
  data() {
    return {
      isHoverActive: false,
    };
  },
};
</script>

<style lang='less'>

@navy: #212046;
@dark-gray: #333;
@cta-blue: rgb(57, 85, 243);
@green: rgb(24, 114, 28);
@error-red-bg: #580808;


button.button {

}

.button {
  display: inline-block;
  cursor: pointer;
  border-radius: 0px;
  border-width: 1px;
  border-style: solid;
  border-color: rgba(0,0,0,0);
  line-height: 1.15rem;
  text-align: center;

  text-shadow: none;

  transition: .25s all;

  // text-transform: lowercase;
  font-weight: bold;
  font-size: 13px;

  user-select: none;
  margin-right: 3px;
  margin-bottom: 1px;


  svg {
    vertical-align: middle;
    margin-right: 10px;
    margin-left: -8px;
    margin-top: -2px;
    width: 20px;
    height: 20px;
    fill: currentColor;
  }

  &:focus {
    outline: none;
  }
  &:hover {

  }

  // Size options
  padding: 10px 30px;
  &.button--small {
    padding: 4px 10px;

    .icon {
      margin-right: 5px;
      margin-left: -3px;
      width: 16px;
      height: 16px;
    }

  }
  &.button--large {
    padding: 20px 60px;
    // font-size: 16px;
  }
  &.button--xlarge {
    padding: 10px 60px;
    max-width: 100%;
    font-size: 16px;
  }

  &.full {
    width: 100%;
  }

  // does not work because pointer-events: none
  // &.is-disabled {
  //   cursor: not-allowed;
  // }
  // &.is-loading {
  //   cursor: wait;
  // }
  &.is-disabled, &.is-loading {
    opacity: .3;
    pointer-events: none;
  }
  &.is-loading {
    opacity: .5;
    border-color: @dark-gray;
    color: @dark-gray;
    background: rgba(0,0,0,0);
  }

  // Color Theme options
  .create-theme(@color) {
    background-color: @color;
    color: contrast(@color);

    &:hover when (lightness(@color) > 50%) {
      background: darken(@color, 10%);
    }
    &:hover when (lightness(@color) < 50%) {
      background: lighten(@color, 10%);
    }
  }
  .create-transparent-theme(@color) {
    border-color: @color;
    color: @color;
    background: fade(@color, 0);
    &:hover {
      background: fade(@color, 60);
      color: contrast(@color);
      border-color: @color;
    }
  }

  &.transparent-dark { .create-transparent-theme(@dark-gray); }
  &.transparent-light { .create-transparent-theme(#FFFFFF); }
  &.transparent-blue { .create-transparent-theme(@cta-blue); }

  &.button--inline-important {
    display: inline !important;
    width: auto !important;
  }

}

</style>
