<template lang='pug'>
  div(v-if="!isShareholder")
    v-button.zerox-popup(@click='showInfoPopup') Invest in our Company
    popup(
      ref='investorInfoPopup'
      title='Invest now in our company'
    )
      form-row(no-inputs)
        p You can be a part of our company. Click the button below to buy our tokens and to claim your slice of our pie!
      div.button-area
        button.zerox-instant(@click='renderZeroExInstant') Click here to buy now
</template>

<script>
import _ from 'lodash';
import { mapState } from 'vuex';

export default {
  metaInfo: {
    script: [
      {
        src: 'https://instant.0x.org/instant.js',
      },
    ],
  },
  data() {
    return {};
  },
  computed: {
    ...mapState('ethers', ['user']),
    ...mapState(['sliceHolders']),
    isShareholder() {
      return _.find(this.sliceHolders, { address: this.user });
    },
    coinToBuyAddress() {
      return this.$route.params.companyAddress;
    },
  },
  methods: {
    renderZeroExInstant() {
      this.closeInfoPopup();
      window.zeroExInstant.render(
        {
          orderSource: 'https://api.radarrelay.com/0x/v2/',
          // availableAssetDatas: [
          //   '0xA80008d296De83570670450E72F6a7Ef541b7c7D',
          // ],
          availableAssetDatas: [
            this.coinToBuyAddress,
          ],
          defaultSelectedAssetData: this.coinToBuyAddress,
          networkId: 42,
        },
        'body',
      );
    },
    showInfoPopup() {
      this.$refs.investorInfoPopup.open();
    },
    closeInfoPopup() {
      this.$refs.investorInfoPopup.close();
    },
  },
  mounted() {
  },
  beforeDestroy() {
  },
};
</script>

<style lang='less'>
@import '~normalize.css';

.zerox-popup {
  font-family: @regular-font;
  color: black;
  background-color: white;
  border-radius: 12px;
  padding: 5px 10px;
  font-weight: bold;
  cursor: pointer;
  border: 2px solid black;
  margin: 5px;

  &:hover {
    color: white;
    background-color: black;
  }

  &:active {
    color: @brand-color;
  }
}

.zerox-instant {
  font-family: @regular-font;
  color: white;
  background-color: black;
  border-radius: 2px;
  padding: 5px 10px;
  font-weight: bold;
  cursor: pointer;
  border: 1px solid black;
  margin: 15px;

  &:hover {
    color: @brand-color;
  }

  &:active {
    color: black;
    background-color: white;
  }
}

.button-area {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
