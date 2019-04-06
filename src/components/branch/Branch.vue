<template>
  <div>
    <aside>
      <Input
        id='searchWords'
        type='text'
        v-model='searchNode'
        search
        enter-button
        placeholder='Enter something...'
        @on-enter='search'
      />
      <div class='custom-tree-container' id='treeClass'>
        <div class='block'>
          <el-tree
            :data='treeData'
            show-checkbox
            node-key='id'
            :props='defaultProps'
            default-expand-all
            :check-on-click-node='true'
            @node-click='handleNodeClick'
            :expand-on-click-node='false'
            :render-content='renderContent'
          ></el-tree>
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
              <el-button type='primary' @click='insertTree'>确 定</el-button>
            </div>
          </el-dialog>

          <el-dialog title='修改节点' :visible.sync='tableDialog'>
            <el-form :model='tableform'>
              <el-form-item label='名称' :label-width='tableformLabelWidth'>
                <el-input v-model='tableform.name'></el-input>
              </el-form-item>
              <el-form-item label='描述' :label-width='tableformLabelWidth'>
                <el-input v-model='tableform.desc'></el-input>
              </el-form-item>
            </el-form>
            <div slot='footer' class='dialog-footer'>
              <el-button @click='tableDialog = false'>取 消</el-button>
              <el-button type='primary' @click='updateTable'>确 定</el-button>
            </div>
          </el-dialog>
        </div>
      </div>
    </aside>
    <article>
      <section id='desc'>
        <ul>
          <li v-for='item in items' v-bind:key='item.id'>
            <h3 style='color: black; font-size: 15px; font-family:"仿宋"'>
              <p>{{item.id}}:{{item.text}}</p>
            </h3>
          </li>
        </ul>
      </section>
      <section id='list'>
        <!-- <h3 style='color: black; font-size: 30px; font-family:"仿宋"'>当前节点的子节点</h3> -->
        <Table border :columns='columns' :data='tableData'>
          <template slot-scope='{ row }' slot='name'>
            <strong>{{ row.name }}</strong>
          </template>
          <template slot-scope='{ row, index }' slot='action'>
            <Button
              type='primary'
              size='small'
              style='margin-right: 5px'
              @click='showEdit(index)'
            >修改</Button>
          </template>
        </Table>
      </section>
    </article>
  </div>
</template>

<script>
export default {
  data () {
    const data = []
    return {
      searchNode: '',
      clickData: '',
      // 树形数据
      treeData: JSON.parse(JSON.stringify(data)),
      // 数据属性名映射
      defaultProps: {
        children: 'children',
        label: 'node_name',
        id: 'node_id'
      },
      // 新增模态框
      dialogFormVisible: false,
      form: {
        name: '',
        desc: ''
      },
      formLabelWidth: '120px',
      // 修改模态框
      tableDialog: false,
      tableform: {
        name: '',
        desc: ''
      },
      tableformLabelWidth: '120px',
      // 表格结构
      columns: [
        {
          title: '编号',
          key: 'node_id'
        },
        {
          title: '名称',
          key: 'node_name'
        },
        {
          title: '描述',
          key: 'node_desc'
        },
        {
          title: '状态',
          key: 'node_state'
        },
        {
          title: '操作',
          slot: 'action',
          width: 150,
          align: 'center'
        }
      ],
      // 表格数据
      tableData: [],
      // 详情显示
      items: [
        { id: '编号', text: '' },
        { id: '名称', text: '' },
        { id: '描述', text: '' },
        { id: '状态', text: '' }
      ]
    }
  },
  // 创建时获取数据
  created () {
    // Vue实例被创建时获取数据、渲染
    this.$http
      // 获取首页传过来的根节点ID   + this.$route.query.node_id
      .get('/api/node/selectChilds/' + this.$route.query.node_id, {
        emulateJSON: true
      })
      .then(response => response.json())
      .then(json => {
        this.treeData = json
        // 详情中展示
        this.items = [
          { id: '编号', text: json[0].node_id },
          { id: '名称', text: json[0].node_name },
          { id: '描述', text: json[0].node_desc },
          { id: '状态', text: json[0].node_state }
        ]
        // 表格中展示
        this.tableData = json[0].children
      })
  },
  methods: {
    // 查询
    search: function () {
      this.$http
        .get(
          '/api/node/findNodes/' +
            this.searchNode +
            '?node_id=' +
            this.$route.query.node_id,
          { emulateJSON: true }
        )
        .then(res => {
          // 查询后显示在树结构中
          this.treeData = res.data
        })
    },
    // 获取点击节点的数据
    append (data) {
      // 显示模态窗口
      this.dialogFormVisible = true
      // 将节点数据传到全局变量
      this.clickData = data
    },
    // 删除节点
    remove (node, data) {
      this.$http.delete('/api/node/deleteNode/' + data.node_id).then(res => {
        const parent = node.parent
        const children = parent.data.children || parent.data
        const index = children.findIndex(d => d.node_id === data.node_id)
        children.splice(index, 1)
        // bus.$emit('sendDeleteDesc', 'deleteDesc')
        // 删除后详情清零
        this.items = [
          { id: '编号', text: '' },
          { id: '名称', text: '' },
          { id: '描述', text: '' },
          { id: '状态', text: '' }
        ]
        this.$Message.info('删除成功！')
      })
    },
    // 向树添加节点
    insertTree () {
      this.$http
        .post(
          '/api/node/insertNode',
          {
            node_id: this.clickData.node_id,
            node_name: this.form.name,
            node_desc: this.form.desc
          },
          { emulateJSON: true }
        )
        .then(
          res => {
            const newChild = {
              node_id: res.node_id,
              node_name: this.form.name,
              node_desc: this.form.desc,
              node_state: '使用中',
              children: []
            }
            if (!this.clickData.children) {
              this.$set(this.clickData, 'children', [])
            }
            this.clickData.children.push(newChild)
            this.$Message.success('添加成功！')
            this.dialogFormVisible = false
          },
          res => {
            this.$Message.success('添加失败！')
            this.dialogFormVisible = false
          }
        )
    },
    // 点击树节点发生事件 返回值为该节点的数据
    handleNodeClick (res) {
      // 获取选中节点的数组,并传输到article组件中
      fetch('/api/node/selectChilds1/' + res.node_id)
        .then(response => response.json())
        .then(json => {
          res.children = json
          this.tableData = json
        })
      // 点击树之后在详情显示节点的描述
      this.items = [
        { id: '编号', text: res.node_id },
        { id: '名称', text: res.node_name },
        { id: '描述', text: res.node_desc },
        { id: '状态', text: res.node_state }
      ]
    },
    // 树的结构中添加新增和删除
    renderContent (h, { node, data, store }) {
      return (
        <span class='custom-tree-node'>
          <span>{node.label}</span>
          <span>
            <el-button
              size='large'
              type='text'
              on-click={() => this.append(data)}
            >
              <i class='el-icon-plus' />
            </el-button>
            <el-button
              size='large'
              type='text'
              on-click={() => this.remove(node, data)}
            >
              <i v-show='true' class='el-icon-delete' />
            </el-button>
          </span>
        </span>
      )
    },
    // 修改表格子节点数据
    updateTable () {
      this.$http
        .put(
          '/api/node/updateNode',
          {
            node_name: this.tableform.name,
            node_desc: this.tableform.desc,
            node_id: this.updateId
          },
          { emulateJSON: true }
        )
        .then(
          //
          res => {
            this.$Message.success('修改成功！')
            this.tableDialog = false
            this.tableData[this.tableIndex].node_name = this.tableform.name
            this.tableData[this.tableIndex].node_desc = this.tableform.desc
            this.$http
              // 获取首页传过来的根节点ID
              .get('/api/node/selectChilds/' + this.$route.query.node_id, {
                emulateJSON: true
              })
              .then(response => response.json())
              .then(json => {
                this.treeData = json
              })
          },
          res => {
            this.$Message.success('修改失败！')
            this.tableDialog = false
          }
        )
    },
    // 点击表格获取表格索引
    showEdit: function (index) {
      this.tableDialog = true
      this.updateId = this.tableData[index].node_id
      this.tableIndex = index
    }
  }
}
</script>

<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
<style scoped>
aside {
  width: 25%;
  position: absolute;
  margin-left: 10%;
  margin-top: 30px;
  float: left;
}
article {
  width: 55%;
  position: absolute;
  margin-left: 38%;
  margin-top: 100px;
  float: left;
}
#treeClass {
  margin-top: 30px;
}
#list {
  margin-top: 20px
}
</style>
