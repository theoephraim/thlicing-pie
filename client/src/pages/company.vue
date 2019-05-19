<template lang='pug'>
layout#page-company(
  :orgName='orgName'
  :orgAddress='orgAddress'
)
  div(v-if='!ethersConnected')
    h2 Connecting to web3...
  div(v-else-if='!contractConnected')
    h2 Connecting to your contract
  div(v-else)
    .col-container
      .col1
        zeroxInstant
        .org-name {{ orgName }}
        .shareholder shareholder? {{ userIsShareholder }}
        .total-slices Total Slices: {{ orgTotalSlices }}

        .pie-info
          pie.pie(:data="pieChartData")
          ul.slice-holders
            li(v-for='holder in orgSliceHolders')
              //- | {{ holder.address.substr(0,6) }}..{{ holder.address.substr(-4) }} - {{ holder.numSlices }}
              | {{ holder.address }} - {{ holder.numSlices }}
              | {{ (holder.numSlices / orgTotalSlices * 100).toFixed() }}%

        .balance
          .pot-balance  Pot Balance
          .eth-balance {{ balances.ETH }} ETH
      //- .col2

      .col3
        .current-proposals
          h3 Active Proposals
          p(v-if='!currentProposals.length')
            i no current proposals to vote on

          .proposal(v-for='proposal in currentProposals' :key='`p-${proposal.id}`')
            .description
              template(v-if='proposal.type === 0')
                .action-name Issue Slices
                div
                  span.amount {{ proposal.amount }} slices
                  span= ' to '
                  span.address {{ proposal.address.substr(-4) }}
                .description {{ proposal.description }}
              template(v-if='proposal.type === 1')
                .action-name Disperse Dividends
              template(v-if='proposal.type === 2')
                .action-name Spend ETH
                div
                  span.amount {{ proposal.amount }} ETH
                  span= ' to '
                  span.address {{ proposal.address.substr(-4) }}
                .description {{ proposal.description }}
            .buttons(:class='`voted-${proposal.myVote}`')
              .vote-yes.vote-button(@click='tryVote(proposal.id, true)')
                icon(name='check')
              .vote-no.vote-button(@click='tryVote(proposal.id, false)')
                icon(name='times')
          v-button.create-proposal-button(
            v-if='userIsShareholder'
            @click='showProposalPopup' icon='plus'

          ) Create new proposal
        .completed-proposals
          h3 Completed Proposals
          .proposal(v-for='proposal in completedProposals')
            icon(:name='proposal.result ? "check" : "times"')
            template(v-if='proposal.type === 0')
              .action-name Issue Slices
              div
                span.amount {{ proposal.amount }} slices
                span= ' to '
                span.address {{ proposal.address.substr(-4) }}
              .description {{ proposal.description }}
            template(v-if='proposal.type === 1')
              .action-name Disperse Dividends
            template(v-if='proposal.type === 2')
              .action-name Spend ETH
              div
                span.amount {{ proposal.amount }} ETH
                span= ' to '
                span.address {{ proposal.address.substr(-4) }}
              .description {{ proposal.description }}

  popup(
    ref='proposalPopup'
    title='Create Proposal'
  )
    form-row(no-inputs)
      p Create a proposal. Shareholders will be able to vote to approve or deny. Their "voting power" is equal to the percentage of slices they own.
      p
        b 70% of the voting power must vote yes to approve

    form-row
      form-input(
        type='radio' v-model='proposal.type'
        label='What do you want to do?'
        required auto-select
      )
        form-input-option(value='DIVIDENDS') Issue dividends to shareholders
        form-input-option(value='SPEND') Spend from the company pot
        form-input-option(value='ISSUE_SLICES') Issue slices to someone
    form-row
      form-input(
        v-model='proposal.description'
        label='Description' :max-length='32'
        required
      )
    form-row(v-if='proposal.type === "SPEND"')
      form-input(
        v-model='proposal.spendAddress'
        label='Where to send funds'
        required
      )
      form-input(
        v-model='proposal.spendAmount'
        label='Spend amount'
        required
      )
    form-row(v-if='proposal.type === "ISSUE_SLICES"')
      form-input(
        v-model='proposal.mintRecipient'
        label='To who'
        required
      )
      form-input(
        v-model='proposal.mintAmount'
        label='How many slices?'
        instructions='slices should compensate for $1'
        required
      )

    form-row
      v-button(@click='confirmProposalButtonHandler') Create This Proposal


</template>

<script>
import _ from 'lodash';
import { mapGetters, mapState } from 'vuex';

const { vuelidateGroupMixin } = require('@/lib/vuelidate-group');

const components = {
  layout: require('@/components/layout').default,
  pie: require('@/components/pie').default,
  zeroxInstant: require('@/components/zerox-instant').default,
};


export default {
  components,
  mixins: [vuelidateGroupMixin],
  metaInfo() {
    return {
      title: 'Manage company',
      script: [
        {
          src: 'https://verify.sendwyre.com/js/widget-loader.js',
        },
      ],
    };
  },
  props: {
    companyAddress: { type: String, required: true },
  },
  computed: {
    ...mapState({
      ethersConnected: state => state.ethers.connected,
    }),
    ...mapState(['orgName', 'orgAddress']),
    ...mapGetters([
      'contractConnected',
      'orgTotalSlices',
      'orgSliceHolders',
      'currentProposals',
      'completedProposals',
      'balances',
      'userIsShareholder',
    ]),
    pieChartData() {
      if (!this.contractConnected || !this.orgSliceHolders) return {};
      return {
        labels: _.map(this.orgSliceHolders, 'address'),
        datasets: [{
          label: 'Shareholders',
          backgroundColor: [this.randomGrey(), this.randomGrey(), this.randomGrey()],
          data: _.map(this.orgSliceHolders, 'numSlices'),
        }],
      };
    },
  },
  watch: {
    ethersConnected() {
      if (this.ethersConnected) {
        this.$store.dispatch('connectToCompany', this.companyAddress);
      }
    },
  },
  data() {
    return {
      proposal: {},
    };
  },
  mounted() {
    if (this.ethersConnected) {
      this.$store.dispatch('connectToCompany', this.companyAddress);
    }
  },
  methods: {
    randomGrey() {
      const colorNumber = Math.random() * (+120 - +0) + +0;
      return `rgb(${colorNumber},${colorNumber},${colorNumber})`;
    },
    showProposalPopup() {
      this.proposal = {};
      this.$refs.proposalPopup.open();
    },
    async confirmProposalButtonHandler() {
      if (this.$hasError()) return;
      await this.$store.dispatch('createProposal', this.proposal);
      this.$refs.proposalPopup.close();
    },
    tryVote(proposalId, vote) {
      this.$store.dispatch('voteOnProposal', { proposalId, vote });
    },
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
};
</script>

<style lang='less'>

@yes-green: #27a301;
@no-red: #c00101;

.col-container {

  position: absolute;
  top: 100px;
  bottom: 100px;
  left: 0;
  right: 0;
  display: flex;
  overflow: hidden;

  .col1, .col2, .col3 {
    flex: 1 0 0;
    padding: 15px;
    position: relative;
  }
  .col1 {
    flex: 2 0 0;
    background: #eee;
  }
  .col3 {
    background: #d6d6d6;
  }

  .pie {
    margin-left: 1rem;
    width: 25vw;
  }


  h2 { margin: 0;}
}

.pie-info {
  display: flex;
}

.slice-holders {
  margin-left: 0.5rem;
}

.current-proposals {
  .create-proposal-button {
    width: 100%;
    margin-top: 10px;
  }

  .proposal {
    display: flex;
    margin-bottom: 5px;
  }
  .description {
    flex: 1 0 0;
  }
  .buttons {
    display: flex;
    .vote-yes {
      margin-right: 5px;
    }
  }

  .vote-yes, .vote-no {
    width: 40px;
    height: 40px;
    border-radius: 4px;
    padding: 5px;
    text-align: center;
    color: #FFF;

    svg {
      fill: currentColor;
      width: 100%;
      height: 100%;
      display: inline-block;
    }

    &:hover {
      cursor: pointer;
      background: #000;
    }

    &.disabled {

    }
  }
  .vote-yes {
    background: @yes-green;
  }
  .vote-no {
    background: @no-red;
  }
  .voted-true .vote-button, .voted-false .vote-button {
    pointer-events: none;
  }
  .voted-true .vote-yes,
  .voted-false .vote-no {
    border: 2px solid black;
  }

  .voted-true .vote-no, .voted-false .vote-yes {
    background: #AAA;
    color: #DDD;
  }
}

.completed-proposals {
  .proposal {
    display: flex;
    margin-bottom: 5px;
  }
}

.org-name {
  font-size: 30px;
  margin-bottom: 1rem
}

.pot-balance {
  margin-top: 1.2rem;
  font-size: 25px;
  margin-bottom: 0.75rem;
}

.eth-balance {
  margin-left: 0.75rem;
}
</style>
