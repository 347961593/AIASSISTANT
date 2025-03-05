<template>
  <section class="container">
    <header>
      <div class="imgs">
        <img :src="history" class="header_img" alt="" />
        <img :src="newChat" class="header_img" alt="" />
      </div>
      <span>{{ title }}</span>
    </header>
    <main>
      <slot></slot>
    </main>
  </section>
  <div class="input">
    <div class="change-bot">
      <div class="bot-list show">
        <div class="item current">DeepSeek-V3</div>
        <div class="item">DeepSeek-R1</div>
      </div>
      <div class="current-bot">
        DeepSeek-V3
        <img :src="top" alt="" />
      </div>
    </div>
    <el-input v-model="input" placeholder="有什么问题都可以问我">
      <template #suffix>
        <img :src="voice" class="header_img" alt="" />
      </template>
    </el-input>
    <div class="tip">内容由<span class="warning">AI生成</span>，请仔细甄别</div>
  </div>
</template>
<script setup>
import { defineProps, ref } from "vue";
import history from "@assets/imgs/history.png";
import newChat from "@assets/imgs/newChat.png";
import voice from "@assets/imgs/voice.png";
import top from "@assets/imgs/top.png";
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
});
const input = ref("");
const model = ref("");
</script>
<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  > header {
    height: 3.75rem;
    line-height: 3.75rem;
    padding: 0 20px;
    font-size: 1.125rem;
    text-align: center;
    position: relative;
    .imgs {
      position: absolute;
      left: 20px;
      top: 0.25rem;
      .header_img {
        width: 1.5rem;
        height: 1.5rem;
        margin-right: 0.5rem;
      }
    }
  }
  > main {
    flex-grow: 1;
    padding: 20px;
  }
}
.input {
  width: calc(100% - 20px);
  margin: auto;
  position: fixed;
  bottom: 0.5rem;
  left: 10px;
  .change-bot {
    width: 195px;
    height: 27px;
    margin-bottom: 0.5rem;
    background-size: contain;
    position: relative;
    .bot-list.show {
      height: max-content;
    }
    .bot-list {
      width: 195px;
      height: max-content;
      overflow: hidden;
      background-color: #fde7e4;
      border-style: solid;
      border-width: 2px;
      border-image-source: linear-gradient(0deg, #faddd6 0%, #ffffff 100%);
      position: absolute;
      bottom: 10px;
      border-radius: 25px;
      border: 2px solid #fff;
      transition: all 0.5s;
      .item {
        margin: 20px auto 0;
        width: max-content;
        padding: 0 15px;
        font-size: 14px;
        letter-spacing: 1px;
        color: #999;
        cursor: pointer;
      }
      .current,
      .item:hover {
        background-color: #fff;
        border-radius: 18px;
        font-size: 14px;
        letter-spacing: 1px;
        color: #986b5f;
      }
      .item:last-child {
        margin-bottom: 25px;
      }
    }
    .current-bot {
      width: 195px;
      height: 27px;
      background: linear-gradient(0deg, #fff3f2, #f9d1cd),
        linear-gradient(#effcff, #effcff);
      background-size: contain;
      border-radius: 25px;
      position: absolute;
      left: 0;
      bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      color: #986b5f;
      border: 2px solid #fff;
      cursor: pointer;
      > img {
        margin-left: 10px;
      }
    }
  }
  .el-input {
    width: 100%;
    height: 51px;
    border-radius: 46px !important;
    overflow: hidden;
    box-shadow: 0 0 9px #7a060933;
    :deep .el-input__wrapper {
      padding: 1px 20px !important;
    }
  }
  .tip {
    margin-top: 0.5rem;
    font-size: 0.75rem;
    color: $gray1;
    text-align: center;
    .warning {
      color: $warning1;
    }
  }
}
</style>
