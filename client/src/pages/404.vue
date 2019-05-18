<template lang='pug'>
layout.not-found-page(
)
  h2 404 - Who ate all the pie?
</template>

<script>
const components = {
  layout: require('@/components/layout').default,
};


export default {
  components,
  metaInfo: {
    title: '404 - who ate all the pie?',
  },
  computed: {
  },
};
</script>

<style lang='less'>
</style>
