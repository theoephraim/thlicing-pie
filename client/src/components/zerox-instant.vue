<template lang='pug'>
  button.zerox-instant(@click='renderZeroExInstant') Buy A Slice of Our Pie
</template>

<script>
export default {
  metaInfo: {
    script: [
      {
        src: 'https://instant.0x.org/instant.js',
      },
    ],
  },
  data() {
    return {
    };
  },
  computed: {
  },
  methods: {
    renderZeroExInstant() {
      window.zeroExInstant.render(
        {
          orderSource: 'https://api.radarrelay.com/0x/v2/',
        },
        'body',
      );
    },
  },
  mounted() {
  },
  beforeDestroy() {
  },
};
</script>

<style lang='less'>
@import '~normalize.css';

.zerox-instant {
  font-family: @regular-font;
  color: white;
  background-color: black;
  border-radius: 2px;
  padding: 5px 10px;
  font-weight: bold;
  cursor: pointer;
  border: 1px solid black;
  margin: 5px;

  &:hover {
    color: @brand-color;
  }

  &:active {
    color: black;
    background-color: white;
  }
}
</style>
