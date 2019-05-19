import Vue from 'vue';
import Vuex from 'vuex';
import _ from 'lodash';
import { Contract, ContractFactory, ethers } from 'ethers';

import { getWallet, getProvider } from './ethers/ethersConnect';

const PIE_CONTRACT = require('../../../blockchain/build/contracts/PieOrg.json');

const genericContractFactory = new ContractFactory(PIE_CONTRACT.abi, PIE_CONTRACT.bytecode);

Vue.use(Vuex);

let contract;

console.log('PARSE', ethers.utils.parseEther('1'));


const DAI_CONTRACT_ADDRESS = '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359';
const DAI_ABI = [{
  constant: true,
  inputs: [{ name: '_owner', type: 'address' }],
  name: 'balanceOf',
  outputs: [{ name: 'balance', type: 'uint256' }],
  payable: false,
  type: 'function',
}];


const ACTION_TYPES = {
  ISSUE_SLICES: 0,
  DIVIDENDS: 1,
  SPEND: 2,
};


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
    sliceHolders: [],
    proposals: [],
  },
  getters: {
    contractConnected: state => !!state.orgAddress,
    orgSliceHolders: state => state.sliceHolders,
    orgTotalSlices: (state, getters) => _.sumBy(getters.orgSliceHolders, 'numSlices'),
    currentProposals: (state, getters) => _.filter(getters.allProposals, p => p.result === undefined),
    completedProposals: (state, getters) => _.filter(getters.allProposals, p => p.result !== undefined),
    allProposals: state => state.proposals,
    balances: state => state.potBalance,
  },
  actions: {
    connectToCompany: async (ctx, contractAddress) => {
      ctx.commit('SET_COMPANY_ADDRESS', contractAddress);
      const connectedFactory = genericContractFactory.connect(getWallet());
      contract = connectedFactory.attach(contractAddress);

      ctx.commit('SET_ORG_NAME', await contract.orgName());

      ctx.dispatch('refreshPotBalance');
      ctx.dispatch('refreshSliceHolders');
      ctx.dispatch('refreshProposals');
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
      const balance = await web3.getBalance(ctx.state.orgAddress);

      const ethBalance = ethers.utils.formatUnits(balance, 'ether');

      // const ethBalance = web3.utils.fromWei(weiBalance, 'ether');
      console.log(`${ethBalance} ETH`);

      // console.log('balance', ethBalance.toNumber());
      ctx.commit('SET_POT_TOKEN_BALANCE', {
        token: 'ETH', balance: ethBalance,
      });

      // enable when not running locally

      // const daiContract = new Contract(DAI_CONTRACT_ADDRESS, DAI_ABI, getWallet());
      // const daiBalance = await daiContract.balanceOf(ctx.state.orgAddress);
      // ctx.commit('SET_POT_TOKEN_BALANCE', 'DAI', daiBalance);
    },

    createProposal: async (ctx, proposal) => {
      let action = ACTION_TYPES[proposal.type];
      let amount = 0;
      let address = ctx.state.orgAddress;
      if (proposal.type === 'DIVIDENDS') {
        // nothing
      } else if (proposal.type === 'SPEND') {
        address = proposal.spendAddress;
        // convert amount to wei
        amount = ethers.utils.parseEther(proposal.spendAmount);
      } else if (proposal.type === 'ISSUE_SLICES') {
        action = 0;
        address = proposal.mintRecipient;
        amount = proposal.mintAmount;
      }

      const result = await contract.makeProposal(address, amount, ethers.utils.formatBytes32String(proposal.description), action);
      console.log(result);
      ctx.dispatch('refreshProposals');
    },
    refreshProposals: async (ctx) => {
      const rawProposals = await contract.getProposals();

      console.log(rawProposals);
      const proposals = [];
      for (let i = 0; i < rawProposals[0].length; i++) {
        const actionType = rawProposals[3][i].toNumber();
        proposals.push({
          id: i,
          address: rawProposals[0][i],
          ...actionType === ACTION_TYPES.SPEND && {
            amount: ethers.utils.formatUnits(rawProposals[1][i], 'ether'),
          },
          ...actionType === ACTION_TYPES.ISSUE_SLICES && {
            amount: rawProposals[1][i].toNumber(),
          },
          description: ethers.utils.parseBytes32String(rawProposals[2][i]),
          type: actionType,
          result: rawProposals[4][i] ? rawProposals[4][i] : undefined,
          myVote: {
            0: null,
            1: false,
            2: true,
          }[rawProposals[6][i].toNumber()],
        });
      }


      // address, amount, type, complete, success,
      // myvote = 0 no vote, 1 = no, 2 = yes

      // const proposals = [
      //   { type: 'ISSUE_DIVIDENDS' },
      //   {
      //     type: 'SPEND', amount: '1', to: 'someaddress', myVote: true,
      //   },
      //   { type: 'GRANT_SLICES', amount: '100', to: '0xSomeaddress' },
      //   {
      //     type: 'GRANT_SLICES', amount: '300', to: 'OxOtheraddress', myVote: false,
      //   },
      //   {
      //     type: 'GRANT_SLICES',
      //     amount: '300',
      //     to: 'OxOtheraddress',
      //     myVote: false,
      //     result: false,
      //   },
      //   {
      //     type: 'ISSUE_DIVIDENDS',
      //     myVote: true,
      //     result: true,
      //   },
      // ];
      ctx.commit('SET_PROPOSALS', proposals);
    },
    refreshSliceHolders: async (ctx) => {
      console.log('moo');
      const rawBalances = await contract.getTrackedAccounts();
      console.log('RAW', rawBalances);
      const balances = [];
      for (let i = 0; i < rawBalances[0].length; i++) {
        balances.push({
          address: rawBalances[0][i],
          numSlices: rawBalances[1][i],
        });
      }
      ctx.commit('SET_SLICE_HOLDERS', balances);
    },
    voteOnProposal: async (ctx, { proposalId, vote }) => {
      const result = await contract.voteProposal(proposalId, vote ? 1 : 0);
      ctx.dispatch('refreshProposals');
    },
  },
  mutations: {
    SET_COMPANY_ADDRESS: (state, contractAddress) => {
      state.orgAddress = contractAddress;
    },
    SET_ORG_NAME: (state, name) => {
      state.orgName = name;
    },
    SET_POT_TOKEN_BALANCE: (state, { token, balance }) => {
      Vue.set(state.potBalance, token, balance);
    },
    SET_SLICE_HOLDERS: (state, balances) => {
      state.sliceHolders = balances;
    },
    SET_PROPOSALS: (state, proposals) => {
      state.proposals = proposals;
    },
  },
});
