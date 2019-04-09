<template>
<div>
  <header>
    <Input
      id='searchWord'
      type='text'
      v-model='searchNode'
      search
      enter-button
      placeholder='Enter something...'
      @on-enter='searchRoot'
    />
  </header>
  <article>
    <div>
      <Button type='success' @click='modalInsert = true'>添加根节点</Button>
      <Button type='success' @click='selectAll'>显示所有</Button>
      <Modal
        v-model='modalInsert'
        title='添加根节点'
        @on-ok='insertSubmit("formValidateInsert")'
        @on-cancel='insertReset("formValidateInsert")'
      >
        <Form
          ref='formValidateInsert'
          :model='formValidateInsert'
          :label-width='80'
        >
          <FormItem label='Name' prop='name'>
            <Input v-model='formValidateInsert.name' placeholder='请输入名称'></Input>
          </FormItem>
          <FormItem label='Desc' prop='desc'>
            <Input
              v-model='formValidateInsert.desc'
              type='textarea'
              :autosize='{minRows: 2,maxRows: 5}'
              placeholder='请输入描述...'
            ></Input>
          </FormItem>
        </Form>
      </Modal>
      <el-dialog title='新增节点' :visible.sync='dialogFormVisible'>
        <el-form :model='form'>
          <el-form-item label='名称' :label-width='formLabelWidth'>
            <el-input v-model='form.name'></el-input>
          </el-form-item>
          <el-form-item label='描述' :label-width='formLabelWidth'>
            <el-input v-model='form.desc'></el-input>
          </el-form-item>
        </el-form>
        <div slot='footer' class='dialog-footer'>
          <el-button @click='dialogFormVisible = false'>取 消</el-button>
          <el-button type='primary' @click='updateSubmit'>确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <Table width='100%' border :columns='columns' :data='data4'>
      <template slot-scope='{ row }' slot='name'>
        <strong>{{ row.name }}</strong>
      </template>
      <template slot-scope='{ row, index }' slot='action'>
        <Button type='primary' size='small' style='margin-right: 5px' @click='edit(index)'>编辑</Button>
        <Button type='success' size='small' style='margin-right: 5px' @click='update(index)'>修改</Button>
      </template>
    </Table>
    <router-view></router-view>
  </article>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // header部分
      searchNode: '',
      // article部分
      node_id: '',
      // 临时修改Id
      updateId: '',
      // 表格下标
      tableIndex: '',
      // 表格格式
      columns: [
        {
          title: '编号',
          key: 'node_id',
          fixed: 'middle'
        },
        {
          title: '名称',
          key: 'node_name',
          fixed: 'middle'
        },
        {
          title: '描述',
          key: 'node_desc',
          fixed: 'middle'
        },
        {
          title: '状态',
          key: 'node_state',
          fixed: 'middle'
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'small',
          slot: 'action'
        }
      ],
      // 数据源
      data4: [],
      // 修改模态
      dialogFormVisible: false,
      form: {
        name: '',
        desc: ''
      },
      formLabelWidth: '120px',
      // 新增模态
      modalInsert: false,
      formValidateInsert: {
        name: '',
        desc: ''
      }
    }
  },
  created () {
    this.$http.get('/api/node/knowledgeTree')
      .then(res => {
        this.data4 = res.data
      })
  },
  methods: {
    searchRoot: function () {
      this.$http
        .get('/api/node/knowledgeTree/' + this.searchNode, {
          emulateJSON: true
        })
        .then(res => {
          // bus.$emit('searchDataTree', res)
          this.data4 = res.body
        })
    },
    insertSubmit (name) {
      this.$http
        .post(
          '/api/node/addNode',
          {
            node_id: this.node_id,
            node_name: this.formValidateInsert.name,
            node_desc: this.formValidateInsert.desc
          },
          { emulateJSON: true }
        )
        .then(
          res => {
            if (res.data === -1) {
              this.$Message.success('名称已存在，添加失败！')
            } else if (res.data !== -1) {
              this.$http.get('/api/node/knowledgeTree')
                .then(res => {
                  this.data4 = res.data
                })
              this.$Message.success('添加成功！')
            }
          }
        )
    },
    insertReset (name) {
      this.$refs[name].resetFields()
    },
    edit: function (index) {
      this.$router.push({path: 'branch', query: {node_id: this.data4[index].node_id}})
    },
    update: function (index) {
      this.dialogFormVisible = true
      this.updateId = index
      this.tableIndex = index
    },
    selectAll: function () {
      this.$http.get('/api/node/knowledgeTree')
        .then(res => {
          this.data4 = res.data
        })
    },
    updateSubmit: function () {
      this.$http
        .put(
          '/api/node/updateNode',
          {
            node_name: this.form.name,
            node_desc: this.form.desc,
            node_id: this.data4[this.tableIndex].node_id
          },
          { emulateJSON: true }
        )
        .then(
          res => {
            this.data4[this.tableIndex].node_name = this.form.name
            this.data4[this.tableIndex].node_desc = this.form.desc
            this.$Message.success('修改成功！')
            this.dialogFormVisible = false
          },
          res => {
            this.$Message.success('修改失败！')
            this.dialogFormVisible = false
          }
        )
    }
  }
}
</script>
<style scoped>
header {
  width: 60%;
  position: absolute;
  margin-left: 20%;
  margin-top: 30px
}
article {
  width: 60%;
  position: absolute;
  margin-left: 20%;
  margin-top: 80px
}
</style>
