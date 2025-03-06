<template>
  <div class="leftMain" style="left: 0px; width: 600px" v-show="show">
    <div class="leftMainCon">
      <div class="title">
        <p>历史记录</p>
        <span><img class="title_img" :src="left" alt="" @click="closeLeft" /></span>
      </div>
      <div class="history-con">
        <div class="history_today">
          <div class="todayList">
            <div class="item">
              <div class="item-left">
                <p>怎样才能获取更多的课本知识</p>
                <span>2025-03-05 10:14:59</span>
              </div>
              <div class="item-right">
                <img :src="deleteIcon" alt="" />
              </div>
            </div>
            <div class="item">
              <div class="item-left">
                <p>请告诉我你的用法</p>
                <span>2025-03-05 09:55:48</span>
              </div>
              <div class="item-right">
                <img :src="deleteIcon" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from "vue";
import left from "@assets/imgs/left.png";
import deleteIcon from "@assets/imgs/delete.svg";
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["close"]);
const closeLeft = () => {
  emit("close", false);
};
</script>

<style lang="scss" scoped>
.leftMain {
  height: 100%;
  max-width: 300px;
  background-color: #fef6f4;
  overflow: hidden;
  z-index: 9999;
  position: relative;
  transition: all 0.2s;
  box-shadow: 1px 2px 5px #7a060933;
  .leftMainCon {
    padding: 20px 16px;
    height: 100vh;
    overflow-y: auto;
    .title {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title_img {
        width: 1rem;
        height: 1rem;
      }
    }
    .history-con {
      width: 100%;
      height: calc(100% - 100px);
      overflow-y: auto;
      .history_today {
        width: 100%;
        .todayList {
          width: 100%;
          margin-top: 25px;
          .item {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 30px;
            .item-left {
              width: calc(100% - 25px);
              display: flex;
              flex-wrap: wrap;
              align-content: center;
              > p {
                width: 100%;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;
                font-size: 0.875rem;
                color: #333;
                padding: 0;
                margin: 0;
              }
              > span {
                letter-spacing: 0px;
                color: #999;
                font-size: 0.8125rem;
              }
            }
            .item-right {
              display: flex;
              justify-content: center;
              align-items: center;
            }
          }
        }
      }
    }
  }
}
</style>
