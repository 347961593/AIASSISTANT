<template>
  <ChatStyle title="安院长智能助手">
    <div class="home">
      <span><img :src="hi" class="hi_img" alt="" /></span>
      <div>
        <div class="tip">— 你可以这样问我 —</div>
        <div class="list">
          <div
            class="item"
            v-for="item in recommendQuestionList"
            :key="item.id"
            @click="sendMessage(item)"
          >
            <img :src="question" alt="" />
            {{ item.title }}
          </div>
        </div>
      </div>
    </div>
  </ChatStyle>
</template>

<script setup>
import ChatStyle from "@comp/chatStyle.vue";
import hi from "@assets/imgs/hi.png";
import question from "@assets/imgs/question.png";
import { post } from "@/api";
import { ref, nextTick } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

const recommendQuestionList = ref([]);
async function recommendQuestion() {
  const { code, data } = await post("/api/login/recommendQuestion");
  if (code == 200) {
    recommendQuestionList.value = data.list;
  }
}
recommendQuestion();

function sendMessage(item) {
  router.push({ path: "/chat", query: { type: "question", val: item.title } });
}
</script>

<style lang="scss" scoped>
.hi_img {
  width: 100%;
  max-width: 400px;
  text-align: center;
}
.tip {
  font-size: 0.875rem;
  color: $gray2;
  text-align: center;
  margin-bottom: 15px;
}
.list {
  .item {
    width: max-content;
    padding-right: 40px;
    height: 33px;
    background-image: linear-gradient(180deg, #fff, #effcff),
      linear-gradient(#fff, #fff);
    background-blend-mode: normal, normal;
    box-shadow: 2px 5px 10px #fee1db78;
    border-radius: 33px;
    overflow: hidden;
    font-size: 14px;
    font-weight: 400;
    font-stretch: normal;
    letter-spacing: 1px;
    color: #352928;
    padding-left: 17px;
    display: flex;
    align-items: center;
    margin-bottom: 13px;
    cursor: pointer;
    img {
      width: 1rem;
      height: 1rem;
      margin-right: 10px;
    }
  }
}
@media (min-width: 720px) {
  .home {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
  }
}
</style>
