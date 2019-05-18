<template lang='pug'>
layout#page-company()
  div(v-if='!ethersConnected')
    h2 Connecting to web3...
  div(v-else-if='!contractConnected')
    h2 Connecting to your contract
  div(v-else)
    .col-container
      .col1
        .total-slices Total Slices: {{ orgTotalSlices }}

        pie.pie(:data="pieChartData")
        ul.slice-holders
          li(v-for='holder in orgSliceHolders')
            | {{ holder.address.substr(0,6) }}..{{ holder.address.substr(-4) }} - {{ holder.numSlices }}
      .col2

      .col3
        .current-proposals
          h3 Active Proposals
          .proposal(v-for='proposal in currentProposals')
            .description
              b {{ proposal.type }}
            .buttons(:class='`voted-${proposal.myVote}`')
              .vote-yes.vote-button
                icon(name='check')
              .vote-no.vote-button
                icon(name='times')
          v-button(@click='showProposalPopup' icon='plus') Create new proposal
        .completed-proposals
          h3 Completed Proposals
          .proposal(v-for='proposal in completedProposals')
            icon(:name='proposal.result ? "check" : "times"')
            b {{ proposal.type }}

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
        required
      )

    form-row
      v-button() Create This Proposal


</template>

<script>
import _ from 'lodash';
import { mapGetters, mapState } from 'vuex';
import pie from '../components/pie.vue';

const components = {
  layout: require('@/components/layout').default,
  pie,
};


export default {
  components,
  metaInfo() {
    return {
      title: 'Manage company',
    };
  },
  props: {
    companyAddress: { type: String, required: true },
  },
  computed: {
    ...mapState({
      ethersConnected: state => state.ethers.connected,
    }),
    ...mapState(['orgName']),
    ...mapGetters([
      'contractConnected',
      'orgTotalSlices',
      'orgSliceHolders',
      'currentProposals',
      'completedProposals',
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
  methods: {
    randomGrey() {
      const colorNumber = Math.random() * (+120 - +0) + +0;
      return `rgb(${colorNumber},${colorNumber},${colorNumber})`;
    },
    showProposalPopup() {
      this.$refs.proposalPopup.open();
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
  bottom: 0;
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
    background: #eee;
  }
  .col3 {
    background: #eee;
  }

  .pie {
    width: 300px;
  }


  h2 { margin: 0;}
}

.current-proposals {
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


</style>
