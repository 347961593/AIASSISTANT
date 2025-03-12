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
              <div class="item-left" @click="getChatlist(item)">
                <p>{{ item.title }}</p>
                <span>{{ item.addtime }}</span>
              </div>
              <div class="item-right" @click="deleteConversation(item.id)">
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
import { defineProps, defineEmits, defineExpose, ref, onMounted } from "vue";
import { post } from "@/api";
import left from "@assets/imgs/left.png";
import deleteIcon from "@assets/imgs/delete.svg";
import { ElMessage } from "element-plus";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();

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

defineExpose({ getConversationlist });
const conversationlist = ref([]);
async function getConversationlist() {
  const { code, data } = await post("/api/member/conversationlog", { page: 1 });
  if (code == 200) {
    conversationlist.value = data.data;
  }
}
onMounted(() => {
  getConversationlist();
});

function getChatlist(item) {
  router.push({
    path: "/chat",
    query: {
      type: "chatlist",
      id: item.id,
      conversation: item.conversation_id,
    },
  });
  closeLeft();
}
async function deleteConversation(id) {
  const { code, data } = await post("/api/member/delcoversation", {
    conversation_id: id,
  });
  if (code == 200) {
    getConversationlist();
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
      height: 100%;
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
