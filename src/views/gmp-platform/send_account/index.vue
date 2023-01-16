<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="handleCreate">
        新增
      </el-button>

      <el-input v-model="listQuery.title" placeholder="账号名称" style="width: 200px;" class="filter-item"/>
      <el-select v-model="listQuery.send_channel" placeholder="发送渠道" clearable style="width: 150px"
                 class="filter-item">
        <el-option v-for="item in channelList" :key="item.id" :label="item.name" :value="item.id"/>
      </el-select>

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>

    </div>

    <el-table
        v-loading="listLoading"
        :data="list"
        border
        height="70vh"
        style="width: 100%"
    >

      <el-table-column label="ID" prop="id" align="center"></el-table-column>
      <el-table-column label="账号名称" prop="title" align="center"></el-table-column>
      <el-table-column label="发送渠道" prop="send_channel" align="center">
        <template slot-scope="{row}">
          <span>{{ channelFilter(row.send_channel) }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column label="账户配置" prop="config" align="center"></el-table-column>-->
      <el-table-column label="账户配置" prop="config" align="center">
        <template slot-scope="{row}">
          <el-button type="text" @click="openDrawer(row)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" align="center">
        <template slot-scope="scoped">
          <el-switch
              v-model="scoped.row.status"
              @change="changeStatus($event,scoped.row,scoped.$index)"
              active-value="0"
              inactive-value="1"
          >
          </el-switch>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="250" class-name="small-padding fixed-width" fixed="right" align="center">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)" v-if="checkBtnPermission('updateMenu')">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize"
                @pagination="getList"/>

    <el-drawer title="账号配置" :visible.sync="lookDrawerVisible" :with-header="false" size="40%">

      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>账号配置</span>
        </div>
        <json-editor ref="jsonRef" v-model="jsonValue"/>
      </el-card>

    </el-drawer>

    <el-dialog
        :title="form.id > 0 ?'编辑':'新增'"
        :visible.sync="formVisible"
        v-if="formVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
    >
      <el-form ref="dataForm" :rules="rules" :model="form" label-position="left" label-width="100px"
               style="width: 500px; margin-left:50px;">
        <el-input v-model="form.id" type="hidden"/>
        <el-form-item label="账号名称" prop="name">
          <el-input v-model="form.title"/>
        </el-form-item>
        <el-form-item label="发送渠道" prop="name">
          <el-select v-model="form.send_channel" placeholder="请选择发送渠道" clearable>
            <el-option v-for="item in channelList" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="配置json" prop="name">
          <json-editor ref="formJsonRef" v-model="form.config"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="editData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import checkBtnPermission from '@/utils/permission'
import { sendAccountChangeStatus, sendAccountEdit, sendAccountList } from '@/api/gmp-platform/send_account'
import { getAllChannel } from '@/api/gmp-platform/msg'
import JsonEditor from '@/components/JsonEditor/index.vue'

export default {
  name: 'Template',
  components: { JsonEditor, Pagination },
  directives: { waves },
  filters: {
    timeToDay (times) {
      return times.slice(0, 10)
    },
    msgTypeFilter (v) {
      const map = {
        '10': '通知类消息',
        '20': '营销类消息',
        '30': '验证码类消息',
      }
      return map[v] ?? ''
    }
  },
  data () {
    return {
      isDisabled: false,
      lookDrawerVisible: false,
      formVisible: false,
      jsonValue: '',
      list: [],
      channelList: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 20,
        title: undefined,
      },
      form: {
        id: undefined,
        title: undefined,
        config: undefined,
        send_channel: undefined,
      },
      rules: {
        title: [{ required: true, message: '账号名称不得为空', trigger: 'blur' }],
      },
    }
  },
  created () {
    this.getList()
    this.getAllChannel()
  },
  methods: {
    checkBtnPermission,
    getList () {
      this.listLoading = true
      sendAccountList(this.listQuery).then(response => {
        this.list = response.data.rows
        this.total = parseInt(response.data.total)
      }).finally(() => {
        this.listLoading = false
      })
    },
    channelFilter (m) {
      let map = {}
      this.channelList.map(r => {
        map[r.id] = r.name
      })
      return map[m]
    },
    openDrawer (row) {
      this.jsonValue = JSON.parse(row.config)
      this.lookDrawerVisible = true
    },
    getAllChannel () {
      getAllChannel().then(response => {
        this.channelList = response.data.rows
      })
    },
    handleFilter () {
      this.listQuery.page = 1
      this.getList()
    },
    changeStatus (e, row, index) {
      sendAccountChangeStatus({ id: row.id, status: row.status })
    },
    handleUpdate (row) {
      this.form = Object.assign({}, row) // copy obj
      this.formVisible = true
      this.form.config = JSON.parse(this.form.config)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCreate () {
      this.formVisible = true
      this.form.config = {}
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    editData () {
      sendAccountEdit({
        ...this.form,
        config: JSON.stringify(JSON.parse(this.$refs.formJsonRef.getValue()))
      }).then(() => {
        this.$notify({
          title: '提示',
          message: '操作成功',
          type: 'success',
          duration: 1000
        })
        this.handleFilter()
        this.formVisible = false
      })
    },
  }
}
</script>


