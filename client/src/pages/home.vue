<template lang='pug'>
layout#page-home
  p Welcome to Thlicing Pie!

  h2 THlicing Pie is a universal, one-size-fits all model that creates a perfectly fair equity split in an early-stage, bootstrapped start-up company.
  h3 on the Ethereum blockchain


  v-button(to-named-route='create') Create A New Company
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
