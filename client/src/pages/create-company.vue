<template lang='pug'>
  .create-company
    h2 Create a new company

    .smaller-text Clicking the button below will deploy a new instance of the Slice of Dao contract to the Ethereum blockchain. As the creator of the company, you will be the sole shareholder with a single "slice" of the company. As such you have all the voting power to approve any proposals you want.
    .smaller-text After creating your company, you can issue share to yourself and any partners for your up-front investments so far.


    form-row
      form-input.chic-black(
        v-model='company.name'
        label='Company Name'
        required required-message='What is your company called?'
      )
    form-row
      v-button.chic-green(
        @click='createButtonHandler'
        :disabled='$vv.$error'
      ) Create your company!

</template>

<script>

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
      if (companyAddress) {
        this.$router.push({ name: 'company', params: { companyAddress } });
      }
    },
  },
};
</script>

<style lang='less'>
.create-company {
  color: white;
}

.smaller-text {
  margin-bottom: 15px;
  font-size: 20px;
}
</style>
