<template lang='pug'>
layout#page-home
  .home
    h2 A Slice of DAO is a universal, one-size-fits all model that creates a perfectly fair equity split in an early-stage, bootstrapped start-up company.
    h3 on the Ethereum blockchain

  .create
    create-company

  .donate
    v-button.chic-black(@click='openWyre') Donate to this project!
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
  metaInfo() {
    return {
      script: [
        {
          src: 'https://verify.sendwyre.com/js/widget-loader.js',
        },
      ],
    };
  },
  data() {
    return {
    };
  },
  computed: {
  },
  methods: {
    openWyre() {
      this.wyreWidget = new window.Wyre.Widget({
        env: 'test',
        accountId: 'AK-T7RJM3TT-LW7FTE76-BX7AWCBL-UU8H6XXJ',
        auth: { type: 'metamask' },
        operation: {
          type: 'debitcard',
          dest: 'ethereum:0x4b8f33d96fE99e80bE83bA9Ab2089A900e9f01CD',
          sourceCurrency: 'USD',
          destCurrency: 'ETH',
          destAmount: 0.05,
        },
      });

      this.wyreWidget.open();
    },
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
  margin-top: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.create-company {
  padding: 0.5rem 3rem;
}


</style>
