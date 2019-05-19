<template lang='pug'>
.layout.theme-page-bg
  .header-bar
    router-link.main-logo(to='/')
      logo
      h1 Slice of DAO
    .org-info
      h2.org-name {{ orgName }}
      .org-address {{ orgAddress }}
  .main
    slot
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
    orgName: {},
    orgAddress: {},
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  .org-info {
    text-align: right;
    .org-name {
      color: @brand-color;
      display: block;
      margin: 10px 0 5px;
      font-size: 32px;
    }
    .org-address {
      font-style: italic;
      color: #AAA;
      font-size: 9px;
    }
  }
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
  height: 100%;
  background-color: #171717;
}

.footer {
  background: #171717;
  width: 100%;
  height: 100px;
  padding: 20px;
  display: flex;
  justify-content: space-evenly;
}

</style>
