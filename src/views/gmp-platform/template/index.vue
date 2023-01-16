<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="handleCreate"
                 v-if="checkBtnPermission('createAPI')">
        新增
      </el-button>

      <el-input v-model="listQuery.name" placeholder="模板名称" style="width: 200px;" class="filter-item"/>
      <el-select v-model="listQuery.send_channel" placeholder="发送渠道" clearable style="width: 150px" class="filter-item">
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
      <el-table-column label="模板名称" prop="name" align="center"></el-table-column>
      <el-table-column label="消息类型" prop="msg_type" align="center">
        <template slot-scope="{row}">
          <span>{{ row.msg_type | msgTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发送账号" prop="send_account_name" align="center"> </el-table-column>
      <el-table-column label="发送渠道" prop="send_channel" align="center">
        <template slot-scope="{row}">
          <span>{{ channelFilter(row.send_channel) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="去重类型" prop="shield_type" align="center">
        <template slot-scope="{row}">
          <span>{{ row.shield_type == '0' ? '/' : row.shield_type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="模板编号" prop="template_sn" align="center"></el-table-column>
      <el-table-column label="创建时间" prop="create_at" align="center"></el-table-column>
      <el-table-column label="操作" width="250" class-name="small-padding fixed-width" fixed="right" align="center">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)" v-if="checkBtnPermission('updateMenu')">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)" v-if="checkBtnPermission('deleteMenu')">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize"
                @pagination="getList"/>

  </div>
</template>
<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import checkBtnPermission from '@/utils/permission'
import { templateList, templateRemove } from '@/api/gmp-platform/template'
import { getAllChannel } from '@/api/gmp-platform/msg'
import { deleteMenu, updateMenu } from '@/api/auth/menu'

export default {
  name: 'Template',
  components: { Pagination },
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
      list: [],
      channelList: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 20,
        name: undefined,
        send_channel: undefined,
      },
      dialogFormVisible: false,
      dialogStatus: '',
    }
  },
  created () {
    this.getList()
    this.getAllChannel()
  },
  methods: {
    checkBtnPermission,
    channelFilter (m) {
      let map = {}
      this.channelList.map(r => {
        map[r.id] = r.name
      })
      return map[m]
    },
    getList () {
      this.listLoading = true
      templateList(this.listQuery).then(response => {
        this.list = response.data.rows
        this.total = parseInt(response.data.total)
      }).finally(() => {
        this.listLoading = false
      })
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

    handleUpdate(row) {

    },
    updateData() {

    },
    handleDelete(row) {
      templateRemove({ id: row.id }).then(() => {
        this.getList()
        this.$notify({
          title: 'Success',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      })
    },
  }
}
</script>
