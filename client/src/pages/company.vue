<template lang='pug'>
layout.about-page()
  h2 Manage Company
  .company-address {{ companyAddress }}

  pie.pie(:data="chartData")

</template>

<script>
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
  },
  data() {
    return {
      chartData: {
        labels: ['aidan', 'micah', 'theo'],
        datasets: [
          {
            label: 'Data One',
            backgroundColor: [this.randomGrey(), this.randomGrey(), this.randomGrey()],
            data: [1, 10, 5],
          },
        ],
      },
    };
  },
  methods: {
    randomGrey() {
      const colorNumber = Math.random() * (+120 - +0) + +0;
      return `rgb(${colorNumber},${colorNumber},${colorNumber})`;
    },
  },
};
</script>

<style lang='less'>
.pie {
  width: 50%;
}

</style>
