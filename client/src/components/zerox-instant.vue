<template lang='pug'>
  div(v-if="!userIsShareholder")
    v-button.zerox-popup(@click='showInfoPopup') Invest in our Company
    popup(
      ref='investorInfoPopup'
      title='Invest now in our company'
    )
      form-row(no-inputs)
        p You can be a part of our company. Click the button below to buy our tokens and to claim your slice of our pie!
      form-row(no-inputs v-if="userBalance==='0.0'")
        p You don't have any ethereum, buy some first!
        div.button-area
          button.zerox-instant(@click='openWyre') Click here to buy now
      form-row(no-inputs v-if="userBalance!=='0.0'")
        p Trade your eth for some of our tokens!
        div.button-area
          button.zerox-instant(@click='renderZeroExInstant') Click here to trade now
</template>

<script>
import _ from 'lodash';
import { mapState, mapGetters } from 'vuex';

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
    coinToBuyAddress() {
      return this.$route.params.companyAddress;
    },
    ...mapGetters(['userIsShareholder', 'userBalance']),
  },
  methods: {
    renderZeroExInstant() {
      console.log(this.ethers);
      this.closeInfoPopup();
      console.log({ cba: this.coinToBuyAddress });
      const assetData = window.zeroExInstant.assetDataForERC20TokenAddress(this.coinToBuyAddress);
      const additionalAssetMetaDataMap = {};
      const signedOrders = [{
        senderAddress: '0x0000000000000000000000000000000000000000',
        makerAddress: '0x4b8f33d96fe99e80be83ba9ab2089a900e9f01cd',
        takerAddress: '0x0000000000000000000000000000000000000000',
        makerFee: '0',
        takerFee: '0',
        makerAssetAmount: '2',
        takerAssetAmount: '200000000000000000',
        makerAssetData: '0xf47261b000000000000000000000000065436056800e3d3dbb077b630773890578c0b749',
        takerAssetData: '0xf47261b0000000000000000000000000d0a1e359811322d97991e03f863a0c30c2cf029c',
        expirationTimeSeconds: '1558595700',
        feeRecipientAddress: '0x0000000000000000000000000000000000000000',
        salt: '38923323787576995284598988622169605032273606714751018434921311550753785012126',
        signature: '0x1b6755268fb874506918d6bf1553f8a545eaed564b28b2c09cb8e81a6d6817ab266734ed5a224a838ae456076cceaafdd01e75dca64e469ef7215d94201e1abe1e03',
        exchangeAddress: '0x35dd2932454449b14cee11a94d3674a936d5d7b2',
      }];
      additionalAssetMetaDataMap[assetData] = {
        assetProxyId: window.zeroExInstant.ERC20_PROXY_ID,
        decimals: 0,
        symbol: 'SLICE',
        name: 'Slice of Pie',
      };
      window.zeroExInstant.render(
        {
          orderSource: signedOrders,
          additionalAssetMetaDataMap,
          availableAssetDatas: [
            assetData,
          ],
          defaultSelectedAssetData: assetData,
          networkId: 42,
        },
        'body',
      );
    },
    openWyre() {
      const userAddress = this.user;
      this.wyreWidget = new window.Wyre.Widget({
        env: 'test',
        accountId: 'AK-T7RJM3TT-LW7FTE76-BX7AWCBL-UU8H6XXJ',
        auth: { type: 'metamask' },
        operation: {
          type: 'debitcard',
          dest: `ethereum:${userAddress}`,
          sourceCurrency: 'USD',
          destCurrency: 'ETH',
          destAmount: 0.05,
        },
      });

      this.wyreWidget.open();
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
