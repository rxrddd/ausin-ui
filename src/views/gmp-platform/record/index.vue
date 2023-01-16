<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        v-if="checkBtnPermission('createAPI')"
        class="filter-item"
        type="primary"
        icon="el-icon-plus"
        @click="handleCreate"
      >
        新增
      </el-button>

      <el-input v-model="listQuery.request_id" placeholder="请求ID" style="width: 200px;" class="filter-item" />
      <el-input v-model="listQuery.template_id" placeholder="模板ID" style="width: 200px;" class="filter-item" />
      <el-select v-model="listQuery.channel" placeholder="渠道" clearable style="width: 150px" class="filter-item">
        <el-option v-for="item in channelList" :key="item.channel" :label="item.name" :value="item.channel" />
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

      <el-table-column label="ID" prop="id" align="center" width="170px">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="渠道" prop="id" align="center">
        <template slot-scope="{row}">
          <span>{{ channelFilter(row.channel) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="模板ID" prop="id" align="center" width="170px">
        <template slot-scope="{row}">
          <span>{{ row.message_template_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="公众号msgID" prop="id" align="center" width="170px">
        <template slot-scope="{row}">
          <span>{{ row.msg_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="请求方式" prop="id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.msg }}</span>
        </template>
      </el-table-column>
      <el-table-column label="接收人" prop="id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.receiver }}</span>
        </template>
      </el-table-column>
      <el-table-column label="请求ID" prop="id" align="center" width="170px">
        <template slot-scope="{row}">
          <span>{{ row.request_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="id" align="center" width="170px">
        <template slot-scope="{row}">
          <span>{{ row.create_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发送时间" prop="id" align="center" width="170px">
        <template slot-scope="{row}">
          <span>{{ row.send_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发送间隔" prop="id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.send_since_time }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />

  </div>
</template>
<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import checkBtnPermission from '@/utils/permission'
import { getMsgRecord, getAllChannel } from '@/api/gmp-platform/msg'

export default {
  name: 'Record',
  components: { Pagination },
  directives: { waves },
  filters: {
    timeToDay(times) {
      return times.slice(0, 10)
    }
  },
  data() {
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
        request_id: undefined,
        template_id: undefined
      },
      dialogFormVisible: false,
      dialogStatus: ''
    }
  },
  created() {
    this.getList()
    this.getAllChannel()
  },
  methods: {
    checkBtnPermission,
    channelFilter(m) {
      const map = {}
      this.channelList.map(r => {
        map[r.channel] = r.name
      })
      return map[m]
    },
    getList() {
      this.listLoading = true
      getMsgRecord(this.listQuery).then(response => {
        this.list = response.data.rows
        this.total = parseInt(response.data.total)
      }).finally(() => {
        this.listLoading = false
      })
    },
    getAllChannel() {
      getAllChannel().then(response => {
        this.channelList = response.data.rows
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    }
  }
}
</script>
