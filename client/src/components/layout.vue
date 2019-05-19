<template lang='pug'>
.layout.theme-page-bg
  .header-bar
    router-link.main-logo(to='/')
      logo
      h1 Slice of DAO
  .main
    slot
  footer.footer
    div
</template>

<script>
const components = {
  logo: require('@/assets/images/logo.svg?inline').default,
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
.header-bar {
  background: #000;
  color: #FFF;
  width: 100%;
  height: 100px;
  padding: 20px;
}
.main-logo {
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-content: center;
  text-decoration: none;
  color: currentColor;
  &:hover {
    color: @brand-color;
  }

  h1 {
    display: inline-block;
    padding-left: 10px;
  }
  svg {
    display: inline-block;
    height: 100%;
    width: auto;
    fill: currentColor;
  }
}

.main {
  min-height: 80vh;
  background-color: black
}

.footer {
  background: #000;
  width: 100%;
  height: 100px;
  padding: 20px;
}

</style>
