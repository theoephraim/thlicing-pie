<template lang='pug'>
layout#page-create-company
  h2 Create a new company

  p Using this will deploy a new instance of the ThlicingPie contract to the Ethereum blockchain. As the creator of the company, you will be the sole shareholder with a single "slice" of the company. As such you have all the voting power to approve any proposals you want.
  p After creating your company, you can issue share to yourself and any partners for your up-front investments so far.


  form-row
    form-input(
      v-model='company.name'
      label='Company Name'
      required required-message='What is your company called?'
    )
  form-row
    v-button(
      @click='createButtonHandler'
      :disabled='$vv.$error'
    ) Create your company!

</template>

<script>
import _ from 'lodash';

const { vuelidateGroupMixin } = require('@/lib/vuelidate-group');

const components = {
  layout: require('@/components/layout').default,
};


export default {
  components,
  mixins: [vuelidateGroupMixin],
  metaInfo: {
    title: 'Create your company',
  },
  data() {
    return {
      company: {},
    };
  },
  computed: {
  },
  methods: {
    async createButtonHandler() {
      if (this.$hasError()) return;
      // TODO: deploy new contract, show address to user
      const companyAddress = await this.$store.dispatch('deployNewCompany', this.company);
      this.$router.push({ name: 'company', params: { companyAddress } });
    },
  },
};
</script>

<style lang='less'>
#page-create-company {

}
</style>
