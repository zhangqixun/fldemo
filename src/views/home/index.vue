<template>
  <el-container style="height: 100vh;padding:1% 3% 0 3%">
    <el-aside style="padding: 10px 10px 0 0;width: 200px">
      <h3>任务配置</h3>

      <div class="menu">
        <el-select v-model="tasklvalue"
                   :placeholder='请选择'
                   size="mini"
                   @change="initTask()"
                   :disabled="isTraining">
          <el-option-group
            v-for="group in taskoptions"
            :key="group.label"
            :label="group.label">
            <el-option
              v-for="item in group.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled">
            </el-option>
          </el-option-group>
        </el-select>
      </div>
      <div class="menu">
        客户端
        <el-input-number
          v-model="clientNum"
          controls-position="right"
          :min="2"
          :max="3"
          size="mini"
          :disabled="isTraining"
        ></el-input-number>
      </div>

      <el-divider></el-divider>

      <h3>数据集<i class='el-icon-question title_i' @click='show_samples()' ></i></h3>

      <div class="menu">
        <span class="menu_content">{{datasetcontent}}</span>
      </div>

      <el-divider></el-divider>
      <h3>模型<i class='el-icon-question title_i' @click='show_model()' ></i></h3>
      <div class="menu">
        <span class="menu_content">{{modelcontent}}</span>
      </div>

    </el-aside>
    <el-container style="padding: 10px 10px">
      <el-main >
        <div style="border: lightgray dashed 1px;border-radius: 10px;background-color: #f7f8fb;padding: 20px;margin-top: 12px">
          <span class="title">联邦学习过程展示</span>
          <el-button type="success"
                    v-text="btnFLMsg"
                    @click="startTrainFL()"
                    size="mini"
                    :disabled="isTraining">
          </el-button>
          <!-- <el-progress :percentage="currentpercentFL" :status="currentstatusFL"></el-progress> -->
          <el-divider></el-divider>
          <div>
            <el-steps :active="activestep" finish-status="success" >
              <el-step title="模型分发" description=""></el-step>
              <el-step title="模型训练"  description=""></el-step>
              <el-step title="聚合&更新&记账"  description=""></el-step>
              <el-step title="模型训练完成" description=""></el-step>
              <el-step title="模型应用" icon="el-icon-finished"></el-step>
            </el-steps>
            <el-button style="margin-top: 12px;" @click="next" :disabled="isStepEnd">下一步</el-button>
          </div>
          <div>
            <div style="margin-left: 10px;margin-bottom: -10px;display: flex;justify-content: flex-start;align-content: flex-start;flex-wrap: wrap">
              <ClientFL0  :key="index" :id=index :state="state"
                      :readonly="isTraining" :result="resultFL" :reward="reward" :clientnum="clientNum"
                      :serverText="serverText" :isloading="serverloading" :serverhide="serverhide"></ClientFL0>
            </div>

            <div style="width: 100%; height: 50px; margin-bottom: 1px;">

            </div >

            <div style="margin-top: -10px; display: flex;justify-content: flex-start;align-content: flex-start;flex-wrap: wrap">
              <ClientFL v-for="(client,index) in clientList" :key="index" :id=index :state="state"
                      :readonly="isTraining" :result="resultFL" :samples="samples" :clientnum="clientNum"
                      :clientText="clientText" :isloading="clientloading" :clientname="clientname"
                      :clientModelStatus="clientModelStatus" :clientModelReport="clientModelReport"></ClientFL>
            </div>
          </div>
        </div>

        <el-dialog
          title="提示"
          :visible.sync="dialogVisible"
          width="800px">
          <span>{{ dialogMessage }}</span>
          <div id = "001">
            <img style="width: 600px" :src = "this.sfile"/>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          </span>
        </el-dialog>

        <h3 style="margin-top: 40px;"> 数据对比分析 </h3>
          <img v-show="is_show_img"  style="width: 600px"  :src = "this.imgurl"/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import ClientFL from '@/components/ClientFL'
import ClientFL0 from '@/components/ClientFL0'
import { run, sample0 } from '@/assets/js/script.js'

export default {
  name: 'home',
  components: {
    ClientFL,
    ClientFL0
  },
  data () {
    return {
      activestep: 0,
      dialogVisible: false,
      clientNum: 2,
      clientList: [],
      drawer: false,

      is_show_img: false,

      serverloading: false,
      clientloading: false,
      clientText: '',
      clientModelReport: '识别准确率',
      serverText: '',
      dialogMessage: '',
      clientModelStatus: '--',
      stepnum: 1,
      btnMsg: 'Run',
      btnstep: 'Next',
      btnFLMsg: 'Run',
      serverhide: true,
      isStepEnd: true,
      state: 'free',
      stateFL: false,
      isTraining: false,
      currentpercentage: 0,
      currentstatus: null,
      currentpercentFL: 0,
      currentstatusFL: null,
      result: null,
      samples: null,
      updatetime: '',
      stateFLContent: '',
      clientname: '工厂',
      sfile: '',
      imgurl: require('@/assets/img/mnist_2.png'),
      tableData: [{
        id: '1',
        name: '准确率',
        amount1: '0.93',
        amount2: '0.96',
        amount3: '0.87'
      }, {
        id: '2',
        name: '准确率',
        amount1: '0.93',
        amount2: '0.96',
        amount3: '0.87'
      }, {
        id: '3',
        name: '准确率',
        amount1: '0.93',
        amount2: '0.96',
        amount3: '0.87'
      }],

      taskoptions: [{
        label: '图像识别',
        options: [{
          value: 'MNIST',
          label: 'MNIST'
        }]
      }, {
        label: '生物分子',
        options: [{
          value: 'ogbg-molhiv',
          label: 'ogbg-molhiv'
        }]
      }],
      tasklvalue: 'MNIST',

      datasetcontent: 'MNIST：手写数字识别数据集，每条数据是一张78*78的手写数字图片，标签为0-9。',
      modelcontent: 'Logistic Regression：逻辑回归模型，用来计算一个例子属于一个分类的概率，是监督学习中经典的分类方法，同时可以看成只有单个神经元的网络。',

      modeloptions: [{
        label: 'Neural Network',
        options: [{
          value: 'FedGCN',
          label: 'FedGCN'
        }, {
          value: 'CNN',
          label: 'CNN'
        }, {
          value: 'RNN',
          label: 'RNN',
          disabled: true
        }]
      }, {
        label: 'Linear Models',
        options: [{
          value: 'Linear-Regression',
          label: 'Linear Regression',
          disabled: true
        }, {
          value: 'Logistic-Regression',
          label: 'Logistic Regression',
          disabled: true
        }]
      }],
      modelvalue: '',

      datasetoptions: [
        {
          value: 'MNIST',
          label: 'MNIST'
        },
        {
          value: 'ogbg-molhiv',
          label: 'ogbg-molhiv'
        }
      ],
      datasetvalue: 'MNIST'
    }
  },
  created () {
    let tid = 0
    this.initClient()
    if (this.tasklvalue === 'MNIST') {
      tid = 1
      this.clientModelReport = '识别准确率'
    }

    if (this.tasklvalue === 'ogbg-molhiv') {
      tid = 2
      this.clientModelReport = 'ROC-AUC'
    }

    this.samples = sample0(tid)
    this.updatetime = this.getcurrenttime()
  },
  watch: {
    clientNum: function () {
      this.initClient()
      this.initTask()
      this.initImg()
    },
    result: function () {
    }
  },
  methods: {
    add0 (m) {
      return m < 10 ? '0' + m : m
    },

    getcurrenttime () {
      var time = new Date()
      var y = time.getFullYear()
      var m = time.getMonth() + 1
      var d = time.getDate()
      var h = time.getHours()
      var mm = time.getMinutes()
      var s = time.getSeconds()

      return y + '-' + this.add0(m) + '-' + this.add0(d) + ' ' + this.add0(h) + ':' + this.add0(mm) + ':' + this.add0(s)
    },
    // render 事件
    renderHeader (h, { column }) { // h即为cerateElement的简写，具体可看vue官方文档
      return h(
        'div', [
          h('span', column.label),
          h('i', {
            class: 'el-icon-question',
            style: 'color:#409eff;margin-left:5px;'
          })
        ]
      )
    },
    initImg () {
      this.is_show_img = false
      this.imgurl = ''
      if (this.clientNum === 2) {
        if (this.tasklvalue === 'MNIST') {
          this.imgurl = require('@/assets/img/mnist_2.png')
        }

        if (this.tasklvalue === 'ogbg-molhiv') {
          this.imgurl = require('@/assets/img/gcn_2.png')
        }
      }
      if (this.clientNum === 3) {
        if (this.tasklvalue === 'MNIST') {
          this.imgurl = require('@/assets/img/mnist_3.png')
        }

        if (this.tasklvalue === 'ogbg-molhiv') {
          this.imgurl = require('@/assets/img/gcn_3.png')
        }
      }
    },
    initTask () {
      this.setprocess(0)
      this.currentpercentFL = 0
      this.currentstatusFL = null
      let tid = 0
      this.initImg()
      this.clientModelStatus = '--'

      if (this.tasklvalue === 'MNIST') {
        this.datasetcontent = 'MNIST：手写数字识别数据集，每条数据是一张78*78的手写数字图片，标签为0-9。'
        this.modelcontent = 'Logistic Regression：逻辑回归模型，用来计算一个例子属于一个分类的概率，是监督学习中经典的分类方法，同时可以看成只有单个神经元的网络'
        this.clientModelReport = '识别准确率'
      }

      if (this.tasklvalue === 'ogbg-molhiv') {
        this.datasetcontent = 'ogbg-molhiv：根据分子结构预测分子性质（预测多种化合物抑制HIV复制的能力）。每个化合物被表示为一张图，节点是原子，边是原子间的化学键信息。数据集来源：https://ogb.stanford.edu/'
        this.modelcontent = 'GCN：图神经网络。图神经网络中每个节点通过迭代聚合邻居节点的信息更新自身的表示，最终采用图级别的池化技术得到图的表示，用于图的性质的预测。采用自适应联邦优化算法对多个客户端的训练过程进行聚合。'
        this.clientModelReport = 'ROC-AUC'
      }

      if (this.tasklvalue === 'MNIST') {
        tid = 1
      }

      if (this.tasklvalue === 'ogbg-molhiv') {
        tid = 2
      }
      if (this.tasklvalue === 'MNIST') {
        this.clientname = '工厂'
      }

      if (this.tasklvalue === 'ogbg-molhiv') {
        this.clientname = '医院'
      }
      this.samples = sample0(tid)
    },
    initClient () {
      this.clientList = new Array(this.clientNum)
    },

    show_samples () {
      if (this.tasklvalue === 'MNIST') {
        this.sfile = require('@/assets/img/mnist.jpeg')
        this.dialogMessage = '手写数字识别数据集，每条数据是一张78*78的手写数字图片，标签为0-9。'
      }

      if (this.tasklvalue === 'ogbg-molhiv') {
        this.sfile = require('@/assets/img/ogbg.png')
        this.dialogMessage = '根据分子结构预测分子性质（预测多种化合物抑制HIV复制的能力）。每个化合物被表示为一张图，节点是原子，边是原子间的化学键信息。数据集来源：https://ogb.stanford.edu/'
      }

      this.dialogVisible = true
    },
    show_model () {
      if (this.tasklvalue === 'MNIST') {
        this.sfile = ''
        this.dialogMessage = '逻辑回归模型，用来计算一个例子属于一个分类的概率，是监督学习中经典的分类方法，同时可以看成只有单个神经元的网络。'
      }

      if (this.tasklvalue === 'ogbg-molhiv') {
        this.sfile = require('@/assets/img/gcnmodel.png')
        this.dialogMessage = '图神经网络。图神经网络中每个节点通过迭代聚合邻居节点的信息更新自身的表示，最终采用图级别的池化技术得到图的表示，用于图的性质的预测。采用自适应联邦优化算法对多个客户端的训练过程进行聚合。'
      }
      this.dialogVisible = true
    },
    startTrainFL () {
      this.btnFLMsg = 'Runing'
      this.isTraining = true
      this.stepnum = 0
      this.isStepEnd = false
      this.serverhide = false
      this.setprocess(this.stepnum)
      this.next()
    },
    next () {
      this.btnFLMsg = 'Runing'
      this.isTraining = true
      this.stepnum++
      this.isStepEnd = true
      this.clientloading = true
      this.serverloading = true
      switch (this.stepnum) {
        case 2:
          this.clientModelStatus = 'train'
          break
        case 5:
          this.clientModelStatus = 'predict'
          break
      }
      switch (this.stepnum) {
        case 1:
          this.clientText = '正在接收全局模型结构及初始模型参数'
          this.serverText = '正在分发全局模型结构及初始模型参数'
          break
        case 2:
          this.clientText = '正在更新本地模型'
          this.serverText = '正在等待客户端更新模型'
          break
        case 3:
          this.clientText = '正在向服务端发送本地模型更新结果'
          this.serverText = '正在接收客户端本地模型更新结果'
          break
        case 4:
          this.clientText = '模型训练完成'
          this.serverText = ''
          this.serverhide = true
          this.serverloading = false
          break
        case 5:
          this.clientText = '应用模型'
          this.serverText = ''
          this.serverhide = true
          this.serverloading = false
          break
      }
      if (this.stepnum === 3) {
        setTimeout(() => {
          this.clientText = '等待服务端更新全局模型'
          this.serverText = '正在聚合多个客户端返回的本地模型更新结果并更新全局模型，同时将更新过程写入区块链'
          setTimeout(() => {
            this.clientText = '接收全局模型'
            this.serverText = '正在向客户端广播全局模型'
            setTimeout(() => {
              this.stepnum++
              this.setprocess(this.stepnum)
              this.clientModelStatus = 'avail'
              this.isStepEnd = false
              this.clientloading = false
              this.serverloading = false
            }, 10000)
          }, 10000)
        }, 10000)
      } else {
        setTimeout(() => {
          this.setprocess(this.stepnum)
          switch (this.stepnum) {
            case 1:
              this.clientModelStatus = 'ready'
              break
            case 2:
              this.clientModelStatus = 'train'
              break
            case 5:
              this.clientModelStatus = 'predict'
              break
          }
          if (this.stepnum === 5) {
            this.is_show_img = true
            let tid = 0
            if (this.tasklvalue === 'MNIST') {
              tid = 1
            }

            if (this.tasklvalue === 'ogbg-molhiv') {
              tid = 2
            }
            this.resultFL = run(tid, this.clientNum)
          }
          this.$notify({
            title: 'Message',
            message: '本步骤执行完成!',
            type: 'success'
          })
          this.isStepEnd = false
          this.clientloading = false
          this.serverloading = false
          if (this.stepnum === 5) {
            this.isStepEnd = true
            this.isTraining = false
            this.btnFLMsg = 'Run'
          }
        }, 10000)
      }
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 1 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    startMining () {
      setTimeout(() => {
        this.$notify({
          title: 'Message',
          message: 'Mine Finished!',
          type: 'success'
        })
        this.btnMsg = 'Run'
        this.isTraining = false
        this.state = 'synchronizing...'
        this.setprocess(4)
        setTimeout(() => {
          this.state = 'finish'
          this.blockheight += 1
          this.updatetime = this.getcurrenttime()
          this.$notify({
            title: 'Message',
            message: 'Synchronize Finished!',
            type: 'success'
          })
        }, 10000)
      }, 10000)
    },
    setprocess (step) {
      this.activestep = step
    }
  }
}
</script>
<style scoped>
  .menu {
    margin-top: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center
  }
  .title {
    margin-top: 22px;
    font-size: 16px;
    font-weight:bold;
    margin-right: 8px;
  }
  .title_i {
    font-size: 20px;
    margin-right: 20px;
    color: #409EFF
  }
  .menu_item {
    width: 140px;
    justify-content: space-between;
    align-items: center
  }
  .menu_content {
    width: 340px;
    justify-content: space-between;
    align-items: center
  }
  #div1 {
    float: left;
  }

</style>
