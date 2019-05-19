<script>
import { Pie, mixins } from 'vue-chartjs';

const options = {
  legend: {
    display: false,
  },
};

export default {
  extends: Pie,
  props: ['data'],

  mounted() {
    // this.chartData is created in the mixin.
    // If you want to pass options please create a local options object
    this.renderChart(this.data, options);
  },
  watch: {
    data: {
      deep: true,
      handler() {
        this.renderChart(this.data, options);
      },
    },
  },
};
</script>
