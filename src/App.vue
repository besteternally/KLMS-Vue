<template>
  <div class='line'>
    <el-menu
      :default-active='activeIndex2'
      class='el-menu-demo'
      mode='horizontal'
      @select='handleSelect'
      background-color='#545c64'
      text-color='#fff'
      active-text-color='#ffd04b'
    >
      <el-menu-item index='1'><router-link to="">用户登陆</router-link></el-menu-item>
      <el-menu-item index='2'><router-link to="rootLeaf">知识点管理</router-link></el-menu-item>
      <el-menu-item index='3'>用户管理</el-menu-item>
    </el-menu>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeIndex: '1',
      activeIndex2: '1'
    }
  },
  methods: {
    handleSelect (key, keyPath) {
      // console.log(key, keyPath)
    }
  }
}
</script>
