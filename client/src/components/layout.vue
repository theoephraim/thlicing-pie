<template lang='pug'>
.layout.theme-page-bg
  .header-bar
    div this is the header

  slot
  footer.footer
    div this is the footer
</template>

<script>
const components = {
  'facebook-logo': require('@/assets/images/facebook.svg?inline').default,
  'instagram-logo': require('@/assets/images/instagram.svg?inline').default,
};

export default {
  components,
  metaInfo() {
    return {
      style: [{ type: 'text/css', cssText: this.themeStyles }],
    };
  },
  props: {
  },
  computed: {
  },
  methods: {
  },
};
</script>

<style lang="less">


</style>
