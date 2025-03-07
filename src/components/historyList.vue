<template>
  <div class="leftMain" style="left: 0px; width: 600px" v-show="show">
    <div class="leftMainCon">
      <div class="title">
        <p>历史记录</p>
        <span
          ><img class="title_img" :src="left" alt="" @click="closeLeft"
        /></span>
      </div>
      <div class="history-con">
        <div class="history_today">
          <div class="todayList">
            <div class="item" v-for="item in conversationlist" :key="item.id">
              <div class="item-left">
                <p>{{ item.title }}</p>
                <span>{{ item.addtime }}</span>
              </div>
              <div class="item-right" @click="deleteConversation(item)">
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
import { defineProps, defineEmits, ref, onMounted } from "vue";
import { post } from "@/api";
import left from "@assets/imgs/left.png";
import deleteIcon from "@assets/imgs/delete.svg";
import { ElMessage } from "element-plus";

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

const conversationlist = ref([]);
async function getConversationlist() {
  const { code, data } = await post("member/conversationlog");
  if (code == 200) {
    conversationlist.value = data.data;
    // TODO 测试数据 待删除
    conversationlist.value = [
      {
        id: 209,
        conversation_id: "7478572241442357311",
        title: "怎么获取更多的课本知识",
        memberid: 20,
        addtime: "2025-03-06 14:00:02",
      },
      {
        id: 188,
        conversation_id: "7478143153082712079",
        title: "怎样才能获取更多的课本知识",
        memberid: 20,
        addtime: "2025-03-05 10:14:59",
      },
      {
        id: 186,
        conversation_id: "7478138104839143443",
        title: "请告诉我你的用法",
        memberid: 20,
        addtime: "2025-03-05 09:55:48",
      },
    ];
  }
}
onMounted(() => {
  getConversationlist();
});

async function deleteConversation(item) {
  const { code, data } = await post("member/delcoversation", {
    conversation_id: item.conversation_id,
  });
  if (code !== 200) {
    getConversationlist();
    //TODO 如果右边界面在删除项对应界面，则回到首页
  } else {
    ElMessage.error("删除失败");
  }
}
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
