<template lang='pug'>
  .create-company
    .bigger-text Create a new company

    .smaller-text Clicking the button below will deploy a new instance of the Slice of Dao contract to the Ethereum blockchain. As the creator of the company, you will be the sole shareholder with a single "slice" of the company. As such you have all the voting power to approve any proposals you want.
    .smaller-text After creating your company, you can issue share to yourself and any partners for your up-front investments so far.

    .creative-form-input
      form-row.half-width
        form-input.chic-black(
          v-model='company.name'
          placeholder='Your Company Name...'
          required required-message='What is your company called?'
        )
      form-row.half-width
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
  margin: 0rem 16rem;
  color: white;
  background-color:#474747;
  // background-color:white;
  border-radius: 5px;
  // box-shadow: -5px 5px 0px 0px @brand-color;
}

.bigger-text {
  font-size: 30px;
  padding: 20px 0px;
}

.smaller-text {
  margin-left: 15px;
  margin-right: 15px;
  margin-bottom: 15px;
  font-size: 20px;
}

.creative-form-input {
  display: flex;
  flex-direction: column;
  align-items: center;
}

</style>
