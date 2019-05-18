<template lang='pug'>
layout.about-page(
)
  h2 About this project

</template>

<script>
import _ from 'lodash';

const components = {
  layout: require('@/components/layout').default,
};


export default {
  components,
  metaInfo: {
    title: 'About this project',
  },
  computed: {
  },
};
</script>

<style lang='less'>

</style>
