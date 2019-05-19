import Vue from 'vue';
import Vuex from 'vuex';
import _ from 'lodash';
import { Contract, ContractFactory } from 'ethers';

import { getWallet, getProvider } from './ethers/ethersConnect';

const PIE_CONTRACT = require('../../../blockchain/build/contracts/PieOrg.json');

const genericContractFactory = new ContractFactory(PIE_CONTRACT.abi, PIE_CONTRACT.bytecode);

Vue.use(Vuex);

let contract;

const DAI_CONTRACT_ADDRESS = '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359';
const DAI_ABI = [{
  constant: true,
  inputs: [{ name: '_owner', type: 'address' }],
  name: 'balanceOf',
  outputs: [{ name: 'balance', type: 'uint256' }],
  payable: false,
  type: 'function',
}];


export default new Vuex.Store({
  modules: {
    ethers: require('./ethers').default,
  },
  state: {
    orgAddress: null,
    orgName: null,
    potBalance: {
      ETH: null,
      DAI: null,
    },
  },
  getters: {
    contractConnected: state => !!state.orgAddress,
    orgSliceHolders: state => [
      { address: '0xb45c0548E36757272742fE1E9Cf050ce0b596D6A', numSlices: 5 },
      { address: '0xb45c0548E36757272742fE1E9Cf050ce0b596D6B', numSlices: 10 },
      { address: '0xb45c0548E36757272742fE1E9Cf050ce0b596D6C', numSlices: 25 },
    ],
    orgTotalSlices: (state, getters) => _.sumBy(getters.orgSliceHolders, 'numSlices'),
    currentProposals: (state, getters) => _.filter(getters.allProposals, p => p.result === undefined),
    completedProposals: (state, getters) => _.filter(getters.allProposals, p => p.result !== undefined),
    allProposals: state => [
      { type: 'ISSUE_DIVIDENDS' },
      {
        type: 'SPEND', amount: '1', to: 'someaddress', myVote: true,
      },
      { type: 'GRANT_SLICES', amount: '100', to: '0xSomeaddress' },
      {
        type: 'GRANT_SLICES', amount: '300', to: 'OxOtheraddress', myVote: false,
      },
      {
        type: 'GRANT_SLICES',
        amount: '300',
        to: 'OxOtheraddress',
        myVote: false,
        result: false,
      },
      {
        type: 'ISSUE_DIVIDENDS',
        myVote: true,
        result: true,
      },
    ],
  },
  actions: {
    connectToCompany: async (ctx, contractAddress) => {
      ctx.commit('SET_COMPANY_ADDRESS', contractAddress);
      const connectedFactory = genericContractFactory.connect(getWallet());
      contract = connectedFactory.attach(contractAddress);

      console.log(contract);

      ctx.commit('SET_POT_TOKEN_BALANCE', 'ETH', contract.balance);

      ctx.commit('SET_ORG_NAME', await contract.orgName());

      ctx.dispatch('refreshPotBalance');
    },

    deployNewCompany: async (ctx, companyProps) => {
      try {
        console.log('deploying contract');
        const connectedFactory = genericContractFactory.connect(getWallet());
        console.log('connected', connectedFactory);
        contract = await connectedFactory.deploy(companyProps.name);
        console.log('deploy 1');
        await contract.deployed();
        console.log('deploy 2');
        console.log(contract);
        return contract.address;
      } catch (err) {
        console.log('error deploying', err);
      }
    },

    refreshPotBalance: async (ctx) => {
      const web3 = getProvider();
      const ethBalance = await web3.getBalance(ctx.state.orgAddress);
      console.log(ethBalance);
      ctx.commit('SET_POT_TOKEN_BALANCE', 'ETH', ethBalance);

      // enable when not running locally

      // const daiContract = new Contract(DAI_CONTRACT_ADDRESS, DAI_ABI, getWallet());
      // const daiBalance = await daiContract.balanceOf(ctx.state.orgAddress);
      // ctx.commit('SET_POT_TOKEN_BALANCE', 'DAI', daiBalance);
    },

  },
  mutations: {
    SET_COMPANY_ADDRESS: (state, contractAddress) => {
      state.orgAddress = contractAddress;
    },
    SET_ORG_NAME: (state, name) => {
      state.orgName = name;
    },
    SET_POT_TOKEN_BALANCE: (state, token, balance) => {
      Vue.set(state.potBalance, token, balance);
    },
  },
});
