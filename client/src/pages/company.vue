<template lang='pug'>
layout.about-page()
  h2 Manage Company
  .company-address {{ companyAddress }}

</template>

<script>
import _ from 'lodash';

const components = {
  layout: require('@/components/layout').default,
};


export default {
  components,
  metaInfo() {
    return {
      title: 'Manage company',
    };
  },
  props: {
    companyAddress: { type: String, required: true },
  },
  computed: {
  },
};
</script>

<style lang='less'>

</style>
