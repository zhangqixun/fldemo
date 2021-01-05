<template>
  <el-card shadow="always" body-style="padding:10px"
           style="height: 150px;width: 250px;margin: 20px;display: inline-block"
           v-loading="this.state==='mining...'" element-loading-text="mining..."
           element-loading-spinner="el-icon-loading">

    <div style="display: flex;justify-content:space-around;align-items: center;font-weight: 600">
      <i class="el-icon-monitor"></i>

      <span>安全可信服务端</span>

    </div>

    <div style="margin-top: 10px;display: flex;justify-content: space-between;align-items: center">
      <span>数据集</span>
      {{samples}}
    </div>

    <div style="margin-top: 10px;display: flex;justify-content: space-between;align-items: center">
      <span>准确率</span>
      {{accu}}
    </div>

    <div style="margin-top: 10px;display: flex;justify-content: space-between;align-items: center">
      <span>损失</span>
      {{loss}}
    </div>

  </el-card>
</template>

<script>
export default {
  name: 'Client',
  props: ['id', 'state', 'readonly', 'result', 'reward', 'clientnum', 'blockheight'],
  data () {
    return {
      power: 4,
      colors: { 2: '#32CD32', 4: '#32CD32', 5: '#32CD32' },
      percentage: 0,
      status: null,
      samples: 8000,
      loss: '--',
      accu: '--',
      winner: ' ',
      myreward: '--',
      myblockheight: this.blockheight
    }
  },
  methods: {},
  created: function () {
    this.$store.commit('add', {
      id: this.id,
      power: this.power
    })
  },
  destroyed: function () {
    this.$store.commit('remove', {
      id: this.id,
      power: this.power
    })
  },
  watch: {
    blockheight: function (val) {
      this.myblockheight = val
    },
    power: function (val) {
      this.$store.commit('update', {
        id: this.id,
        power: this.power
      })
    },
    result: function () {
      const flag = this.power * 2 - 1
      this.loss = (this.result[0][flag] - this.samples / 1000 * 0.001 + Math.random() * 0.001).toFixed(4)
      this.accu = (this.result[1][flag] + this.samples / 1000 * 0.001 + Math.random() * 0.001).toFixed(4)
    },
    state: function (val) {
      if (val === 'training...') {
        this.winner = ' '
      }
      if (val === 'synchronizing...') {
        // let winnerId = this.$store.getters.candidates
        const winnerId = 1
        if (this.id === winnerId) {
          this.myblockheight += 1
          this.winner = 'WINNER'
        }
        if (this.id === winnerId) {
          this.myreward = (this.reward * 0.7 / this.clientnum * this.accu + this.reward * 0.2).toFixed(3)
        } else {
          this.myreward = (this.reward * 0.7 / this.clientnum * this.accu).toFixed(3)
        }
      }
    }
  }
}
</script>

<style scoped>
</style>
