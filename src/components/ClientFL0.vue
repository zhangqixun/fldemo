<template>
  <el-card shadow="always" body-style="padding:20px"
           style="height: 190px;width: 300px;margin: 10px;display: inline-block">

    <div style="display: flex;justify-content:space-around;align-items: center;font-weight: 600">
      <i class="el-icon-monitor"></i>

      <span>可信环境联邦学习执行平台</span>

    </div>
    <div style="text-align:center">
      <el-tag type="success" style="width: 80px;margin: 10px;display: inline-block; text-align:center">全局模型</el-tag>
    </div>
    <div style="margin-top: 10px;display: flex;justify-content:space-around;align-items: center;">
      <div>
        <div style="margin-left: 20px; height: 60px;" v-if="isloading">
          <i class='el-icon-message-solid title_i'  ></i>
          {{serverText}}
        </div>
        <div style="height: 10px;" v-loading="isloading"></div>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'Client',
  props: ['id', 'state', 'readonly', 'result', 'samples', 'clientnum', 'blockheight', 'isloading', 'serverText', 'serverhide'],
  data () {
    return {
      loading: true,
      power: 4,
      colors: { 2: '#32CD32', 4: '#32CD32', 5: '#32CD32' },
      percentage: 0,
      status: null,
      loss: '--',
      accu: '--',
      winner: ' ',
      myreward: '--',
      myblockheight: this.blockheight
    }
  },
  methods: {},
  created: function () {
  },
  destroyed: function () {
  },
  watch: {
    blockheight: function (val) {
      this.myblockheight = val
    },
    power: function (val) {
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
