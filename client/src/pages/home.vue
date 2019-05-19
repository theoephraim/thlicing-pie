<template lang='pug'>
layout#page-home
  .home
    h2 A Slice of DAO is a universal, one-size-fits all model that creates a perfectly fair equity split in an early-stage, bootstrapped start-up company.
    h3 on the Ethereum blockchain

  .create
    create-company

  .donate
    v-button.chic-black(@click='') Donate to this project!
</template>

<script>
import createCompany from './create-company.vue';

const components = {
  layout: require('@/components/layout').default,
  createCompany,
  logo: require('@/assets/images/logo.svg?inline').default,
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
.home {
  padding: 2rem 14rem;
  color: white;
}

.create-new {
  display: flex;
  align-items: center;
  justify-content: center;
}

.donate {
  display: flex;
  align-items: center;
  justify-content: center;
}

.create-company {
  padding: 2rem 3rem;
}


</style>
