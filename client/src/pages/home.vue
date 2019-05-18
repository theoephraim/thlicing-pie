<template lang='pug'>
layout.home-page()
  h1 Thlicing Pie
  v-button(@click='') Create A New Company
  v-button(@click='') Donate to this project!
</template>

<script>
import _ from 'lodash';

const components = {
  layout: require('@/components/layout').default,
};

export default {
  components,
  metaInfo: {
  },
  data() {
    return {
    };
  },
  computed: {
  },
  methods: {

  },
  mounted() {
  },
  beforeDestroy() {
  },

};
</script>

<style lang='less'>

</style>
