<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-plus"
          @click="handleCreate"
      >
        新增
      </el-button>

      <el-input v-model="listQuery.name" placeholder="模板名称" style="width: 200px;" class="filter-item"/>
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

      <el-table-column label="ID" prop="id" align="center"/>
      <el-table-column label="模板名称" prop="name" align="center"/>
      <el-table-column label="消息类型" prop="msg_type" align="center">
        <template slot-scope="{row}">
          <span>{{ row.msg_type | msgTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发送账号" prop="send_account_name" align="center"/>
      <el-table-column label="发送渠道" prop="send_channel" align="center">
        <template slot-scope="{row}">
          <span>{{ channelFilter(row.send_channel) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="屏蔽策略" prop="shield_type" align="center">
        <template slot-scope="{row}">
          <span>{{ row.shield_type == '0' ? '/' : shieldFormat(row.shield_type) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="去重类型" prop="deduplication_config" align="center">
        <template slot-scope="{row}">
          <span>{{ deduplicationConfigFormat(row.deduplication_config) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="模板编号" prop="template_sn" align="center"/>
      <el-table-column label="创建时间" prop="create_at" align="center"/>
      <el-table-column label="操作" width="250" class-name="small-padding fixed-width" fixed="right" align="center">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.pageSize"
        @pagination="getList"
    />

    <el-dialog
        v-if="formVisible"
        :title="form.id > 0 ?'编辑':'新增'"
        :visible.sync="formVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        fullscreen
    >
      <el-form
          ref="dataForm"
          :rules="this.rules"
          :model="this.form"
          label-position="left"
          label-width="100px"
      >
        <el-input v-model="form.id" type="hidden"/>
        <el-form-item label="模板名称" prop="name" style="width: 50%">
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="发送渠道" prop="send_channel">
          <el-radio-group v-model="form.send_channel" size="small">
            <el-radio v-for="item in channelList" :label="item.id" border>
              {{ item.name }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="消息类型" prop="msg_type">
          <el-radio-group v-model="form.msg_type" size="small">
            <el-radio :label="30" border>验证码类消息</el-radio>
            <el-radio :label="10" border>通知类消息</el-radio>
            <el-radio :label="20" border>营销类消息</el-radio>
          </el-radio-group>
        </el-form-item>


        <el-form-item label="屏蔽策略" prop="shield_type">
          <el-radio v-for="item in shieldList" :label="item.id" border>
            {{ item.name }}
          </el-radio>

        </el-form-item>
        <el-form-item label="发送账号" prop="send_account">
          <el-select
              style="width: 50vh"
              v-model="form.send_account"
              clearable
              filterable
              remote
              placeholder="请输入账号名称"
              :remote-method="searchAccountRemoteMethod"
              :loading="searchAccountLoading">
            <el-option
                v-for="item in searchAccountOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="短信渠道" prop="sms_channel" v-if="form.send_channel=='30'">
          <el-radio-group v-model="form.sms_channel" size="small">
            <el-radio :label="'aliyun'" border>阿里云</el-radio>
            <el-radio :label="'yunpian'" border>云片</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="模板ID" prop="template_sn" v-if="form.send_channel=='50' && parseInt(form.send_account)>0">
          <el-select
              clearable
              style="width: 50vh"
              v-model="form.template_sn"
              placeholder="请选择模板ID">
            <el-option
                v-for="item in wxTemplateOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
          </el-select>
          <div class="template-sn-content"
               style="width: 50vh"
               v-if="template_sn_content!=''"
               v-html="template_sn_content"
          >
          </div>
        </el-form-item>

        <el-form-item label="消息模板" prop="msg_content" v-if="form.send_channel=='30'" style="width: 70%">
          <json-editor ref="formMsgContentRef" v-model="form.msg_content"/>
        </el-form-item>

        <el-form-item label="业务团队" prop="team" style="width: 50%">
          <el-input v-model="form.team"/>
        </el-form-item>
        <el-form-item label="业务方" prop="proposer" style="width: 50%">
          <el-input v-model="form.proposer"/>
        </el-form-item>
        <el-form-item label="是否去重" prop="is_deduplication_config">
          <el-radio-group v-model="form.is_deduplication_config" size="small">
            <el-radio :label="0" border>否</el-radio>
            <el-radio :label="1" border>是</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-if="form.is_deduplication_config==1">
          <el-form-item label="去重策略" prop="deduplication_config.type">
            <el-radio-group v-model="form.deduplication_config.type" size="small">
              <el-radio :label="10" border>内容去重</el-radio>
              <el-radio :label="20" border>一天内N次相同渠道去重</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="数量" prop="deduplication_config.num">
            <el-input-number
                :precision="0"
                :step="1"
                :min="1"
                :max="1000"
                step-strictly
                v-model="form.deduplication_config.num"
            />
          </el-form-item>
          <el-form-item
              label="时间"
              v-if="form.deduplication_config.type==10"
              prop="deduplication_config.time"
          >
            <el-input-number
                :precision="0"
                :step="1"
                :min="1"
                :max="1000"
                step-strictly
                v-model="form.deduplication_config.time"
            />
          </el-form-item>
        </div>
      </el-form>


      <div slot="footer" class="dialog-footer">
        <el-button @click="formVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateData()">
          确认
        </el-button>
      </div>

    </el-dialog>

  </div>


</template>
<style scoped>
.el-dialog__wrapper {
  position: absolute;
}

.dialog-footer {
  position: sticky;
  bottom: 10px;
  text-align: center;
}
</style>
<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import checkBtnPermission from '@/utils/permission'
import { templateEdit, templateList, templateOne, templateRemove } from '@/api/gmp-platform/template'
import { getAllChannel } from '@/api/gmp-platform/msg'
import { sendAccountQuery } from '@/api/gmp-platform/send_account'
import JsonEditor from '@/components/JsonEditor/index.vue'
import { getOfficialAccountTemplateList } from '@/api/gmp-platform/wx_template'
import { find, sortBy } from 'lodash/collection'

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
        '30': '验证码类消息'
      }
      return map[v] ?? ''
    }
  },
  data () {
    return {
      searchAccountLoading: false,
      searchAccountOption: [],
      wxTemplateOption: [],
      wxTemplateList: [],
      formVisible: false,
      isDisabled: false,
      list: [],
      channelList: [],
      channelTextMap: {},
      total: 0,
      listLoading: true,
      shieldList: [
        {
          'id': 10,
          'name': '夜间不屏蔽',
        },
        {
          'id': 20,
          'name': '夜间屏蔽',
        },
        {
          'id': 30,
          'name': '夜间屏蔽(次日早上8点发送)',
        }
      ],
      listQuery: {
        page: 1,
        pageSize: 20,
        name: undefined,
        send_channel: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      template_sn_content: '',
      form: {
        id: undefined,
        name: undefined,
        send_channel: '40',
        msg_type: 30,
        shield_type: 10,
        deduplication_config: {
          type: 10,
          num: 1,
          time: 1,
        },
        is_deduplication_config: 0,
        msg_content: {
          content: '您的验证码是{$code}，{$min}分钟内有效。请勿向他人泄露。如果非本人操作，可忽略本消息。'
        },
        send_account: undefined,
        team: undefined,
        proposer: undefined,
        template_sn: undefined,
        sms_channel: undefined,
      },
      rules: {
        name: [{ required: true, message: '模板名称不得为空', trigger: 'blur' }],
        send_channel: [{ required: true, message: '请选择发送渠道', trigger: 'blur' }],
        msg_type: [{ required: true, message: '请选择消息类型', trigger: 'blur' }],
        shield_type: [{ required: true, message: '请选择屏蔽策略类型', trigger: 'blur' }],
        send_account: [{ required: true, message: '请选择发送账号', trigger: 'blur' }],
        template_sn: [{ required: true, validate: this.validateTemplateSn, message: '请选择模板', trigger: 'blur' }],
      },

    }
  },
  created () {
    this.getList()
    this.getAllChannel()
  },
  methods: {
    checkBtnPermission,
    validateTemplateSn (rule, value, callback) {
      if (this.form.send_channel == '50' || !this.form.template_sn) {
        callback(new Error('请选择模板'))
      } else {
        callback()
      }
    },
    searchAccountRemoteMethod (query) {
      this.searchAccountLoading = true
      sendAccountQuery({
        title: query || '',
        send_channel: this.form.send_channel || undefined,
      }).then(r => {
        this.searchAccountOption = r.data.rows.map(r => {
          return {
            label: r.title,
            value: r.id,
          }
        })
      }).finally(() => this.searchAccountLoading = false)
    },
    channelFilter (m) {
      const map = {}
      this.channelList.map(r => {
        map[r.id] = r.name
      })
      return map[m]
    },
    shieldFormat (shield_type) {
      const { name = '/' } = find(this.shieldList, {
        id: shield_type
      }) || {}
      return name
    },
    deduplicationConfigFormat (deduplication_config) {
      if (deduplication_config) {
        const res = JSON.parse(deduplication_config || '{}')
        return res.type == '10'
            ? `${ res.time }秒内容重复${ res.num }次`
            : `一天内用户${ res.num }次相同渠道消息`
      }
      return '/'
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
        const rows = sortBy(response.data.rows, function (r) {
          return parseInt(r.id)
        })
        this.channelList = rows
        rows.map((r) => {
          this.channelTextMap[r.id] = r.name
        })
      })
    },
    handleFilter () {
      this.listQuery.page = 1
      this.getList()
    },
    handleUpdate (row) {
      templateOne({
        id: row.id
      }).then(r => {
        this.form = Object.assign({}, r.data)
        if (r.data.deduplication_config) {
          this.form.deduplication_config = JSON.parse(r.data.deduplication_config)
          this.form.is_deduplication_config = 1
        }
        this.formVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    handleCreate () {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let data = {
            ...this.form,
          }
          if (this.form.send_channel == '30') {
            data.msg_content = JSON.stringify(JSON.parse(this.$refs.formMsgContentRef.getValue()))
          } else {
            data.msg_content = ''
          }
          if (data.is_deduplication_config == '1') {
            data.deduplication_config = JSON.stringify(data.deduplication_config)
          } else {
            data.deduplication_config = ''
          }
          templateEdit(data).then(() => {
            this.$notify({
              title: '提示',
              message: '操作成功',
              type: 'success',
              duration: 1000
            })
            this.handleFilter()
            this.formVisible = false
          })
        }
      })
    },
    handleDelete (row) {
      this.$confirm('是否删除该模板? 删除后该模板无法找回', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        templateRemove({ id: row.id }).then(() => {
          this.getList()
          this.$notify({
            title: 'Success',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        })
      })
    },
    getWxTemplate () {
      getOfficialAccountTemplateList({
        send_account: this.form.send_account,
      }).then(r => {
        this.wxTemplateOption = r.data.rows.map(r => {
          return {
            label: r.title,
            value: r.template_id,
          }
        })
        this.wxTemplateList = r.data.rows
      })
    },
    onWxTemplateChange (template_id) {
      if (!template_id) {
        this.template_sn_content = ''
        return
      }
      const { content } = find(this.wxTemplateList, {
        template_id: template_id
      }) || {}
      this.template_sn_content = (content || '').replaceAll('\n', '</br>')
    },
  },
  watch: {
    'form.send_channel': {
      handler (oldVal, newVal) {
        this.form.send_account = ''
        if (this.form.send_channel) {
          this.searchAccountRemoteMethod()
        } else {
          this.searchAccountOption = []
        }
      },
    },
    'form.send_account': {
      handler (oldVal, newVal) {
        console.log(`this.form`, this.form)
        this.form.template_sn = ''
        if (this.form.send_account && this.form.send_channel == '50') {
          this.getWxTemplate()
        } else {
          this.wxTemplateOption = []
        }
      }
    },
    'form.template_sn': {
      handler (oldVal, newVal) {
        this.onWxTemplateChange(this.form.template_sn)
      }
    }
  }
}
</script>
