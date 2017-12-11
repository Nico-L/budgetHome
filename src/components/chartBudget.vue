<script>
import { Doughnut } from 'vue-chartjs'

export default {
  extends: Doughnut,
  props: ['data', 'options'],
  mounted () {
    console.log('bing !')
    console.log(this.data.dataCollection)
    this.renderChart(this.data.dataCollection, this.options)
  },
  watch: {
    data: function () {
      this.$data._chart.destroy()
      this.renderChart(this.data, this.options)
    }
  }
}
</script>

<style>
</style>
