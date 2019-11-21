<template>
  <div class="highcharts-container"></div>
</template>
<script>
import Highcharts from 'highcharts';
export default {
  props: ['styles'],
  name: 'highcharts',
  data() {
    return {
      chart: null
    };
  },
  methods: {
    initChart(options) {
      this.$el.style.width = (this.styles.width || 800) + 'px';
      this.$el.style.height = (this.styles.height || 400) + 'px';
      this.chart = new Highcharts.Chart(this.$el, options);
    }
  }
};

</script>
<style lang="less" scoped>
.highcharts-container {
  width: 800px;
  height: 400px;
}

</style>
