<template>
  <div class="dashboard-container">
    <div style="padding: 10px 10px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>今日发送量</span>
            </div>
            <div>
              图标
            </div>

            <div>
              <count-to :start-val="0" :end-val="102400" :duration="2000" class="card-panel-num" />
            </div>

          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>昨日发送量</span>
            </div>
            <div>
              图标
            </div>

            <div>
              <count-to :start-val="0" :end-val="102400" :duration="2000" class="card-panel-num" />
            </div>

          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>本周发送量</span>
            </div>
            <div>
              图标
            </div>

            <div>
              <count-to :start-val="0" :end-val="102400" :duration="2000" class="card-panel-num" />
            </div>

          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>本月发送量</span>
            </div>
            <div>
              图标
            </div>

            <div>
              <count-to :start-val="0" :end-val="102400" :duration="2000" class="card-panel-num" />
            </div>

          </el-card>
        </el-col>
      </el-row>
    </div>


  </div>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  name: 'Dashboard',
  components: {
    CountTo
  },
  data () {
    return {
      currentRole: 'adminDashboard'
    }
  },
  created () {

  }
}
</script>
<style scoped>
.card-panel-num {
  font-size: 20px;
}
</style>