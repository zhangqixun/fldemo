<template>
  <div style="width: 180px;margin: 10px;display: inline-block;">
    <el-tag style="width: 180px;margin: 10px;display: inline-block; float:left;text-align:center" @click="dialogVisible = true">可信网络</el-tag>
    <el-card shadow="always" body-style="padding:20px"
            style="height: 230px;width: 180px;margin-left: 10px;margin-top: 0px;display: inline-block; float:left">
      <div style="display: flex;justify-content:space-around;align-items: center;font-weight: 600">
        <i class="el-icon-monitor"></i>

        <span style="margin-left: -50px;">{{clientname}}{{id+1}}</span>

      </div>
      <div style="display: flex;justify-content:space-around;align-items: center; " v-loading="isloading">
        <span style="margin-left: -10px;">可信平台</span>
      </div>

      <div style="margin-top: 10px;display: flex;justify-content: space-between;align-items: center">
        <span>本地数据集</span>
        {{samples}}
      </div>

      <div style="margin-top: 10px;display: flex;justify-content: space-between;align-items: center">
        <span>本地模型</span>
        {{clientModelStatus}}
      </div>

      <div style="margin-top: 10px;display: flex;justify-content: space-between;align-items: center">
        <span>{{clientModelReport}}</span>
        {{accu}}
      </div>
      <div style="margin-top: 10px; height: 60px;" v-if="isloading">
        <i class='el-icon-message-solid title_i'  ></i>
        <span style="font-color:#f00;">{{clientText}}</span>
      </div>
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose">
        <span>模型参数</span>
        <div id = "001">
            <img style="width: 100%" :src = "this.sfile"/>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>

    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Client',
  props: ['id', 'state', 'readonly', 'result', 'samples', 'clientnum', 'blockheight', 'clientname', 'clientText', 'isloading', 'clientModelStatus', 'clientModelReport'],
  data () {
    return {
      power: 4,
      colors: { 2: '#32CD32', 4: '#32CD32', 5: '#32CD32' },
      percentage: 0,
      status: null,
      loss: '--',
      accu: '--',
      winner: ' ',
      myreward: '--',
      dialogVisible: false,
      sfile: require('@/assets/img/w_c1.png'),
      myblockheight: this.blockheight
    }
  },
  methods: {},
  created: function () {
    const flag = this.id
    console.log(this.samples)
    this.samples = (this.samples[0][flag])
    this.accu = '--'
  },
  destroyed: function () {
  },
  watch: {
    blockheight: function (val) {
      this.myblockheight = val
    },
    clientname: function (val) {
      this.clientname = val
    },
    power: function (val) {
    },
    samples: function () {
      const flag = this.id
      this.samples = (this.samples[0][flag])
      this.accu = '--'
    },
    result: function () {
      const flag = this.id
      this.accu = (this.result[1][flag]).toFixed(4)
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
