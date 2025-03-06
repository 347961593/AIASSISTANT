<template>
  <div class="login">
    <img :src="hi" class="hi_img" alt="" />
    <el-input v-model="phoneNum" placeholder="请输入手机号"> </el-input>
    <el-button type="danger" round>登录</el-button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import hi from "@assets/imgs/hi.png";
const phoneNum = ref("");
</script>

<style lang="scss" scoped>
.login {
  height: 100%;
  max-width: 600px;
  margin: auto;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .hi_img {
    margin-top: 50px;
    width: 100%;
  }
  .el-button{
    margin-top: 10px;
    padding: 8px 40px;
  }
}
</style>
