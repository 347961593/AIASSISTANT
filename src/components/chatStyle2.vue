<template>
  <div class="container">
    <HistoryList
      :show="historyListShow"
      @close="listShow"
      ref="historyListComp"
    ></HistoryList>
    <div class="chat">
      <section class="chat-container">
        <header>
          <div class="imgs">
            <img
              :src="history"
              class="header_img"
              alt=""
              @click="listShow(true)"
            />
            <img :src="newChat" class="header_img" alt="" @click="gotoHome" />
          </div>
          <span>{{ title }}</span>
        </header>
        <main>
          <slot></slot>
        </main>
      </section>
      <div class="input">
        <div class="change-bot">
          <div class="bot-list" v-show="agentlistShow">
            <div
              :class="`item ${item.id == agent.id ? 'current' : ''}`"
              v-for="item in agentlist"
              :key="item.id"
              @click="changeAgent(item)"
            >
              {{ item.title }}
            </div>
          </div>
          <div class="current-bot" @click="agentlistShowChange">
            {{ agent.title }}
            <img :src="top" alt="" />
          </div>
        </div>
        <div class="ask-input-all">
          <div class="ask-input-group">
            <div class="ask-input ask-input-text" v-if="!isVoiceMode">
              <input
                type="text"
                class="ask-question"
                placeholder="有什么问题都可以问我"
                v-model="inputText"
                @keyup.enter="sendMessage"
              />
              <p @click="toggleMode">
                <span>
                  <img :src="voice" alt="" />
                </span>
              </p>
            </div>
            <div class="ask-input" v-else>
              <div
                class="voice-btn"
                @mousedown.stop="startVoiceInput"
                @touchstart.stop="startVoiceInput"
                @mouseup.stop="stopVoiceInput"
                @touchend.stop="stopVoiceInput"
              >
                <img :src="speak" class="axsh" alt="" /><span>按下说话</span>
              </div>
              <div class="key-btn" @click="toggleMode">
                <img :src="keyboard" alt="" />
              </div>
            </div>
          </div>
        </div>
        <div class="tip">
          内容由<span class="warning">AI生成</span>，请仔细甄别
        </div>
        <div class="voiceNav" v-show="isListening">
          <div class="bg"></div>
          <div class="speanText">上滑取消 松开发送</div>
          <div
            class="speakCon"
            @mousedown.stop="startVoiceInput"
            @mouseup.stop="stopVoiceInput"
            @touchstart.stop="startVoiceInput"
            @touchend.stop="stopVoiceInput"
          >
            <div class="speakHt">
              <div class="speakHtbg"></div>
              <div class="speakHtCon">
                <img :src="speaking" alt="" />
              </div>
            </div>
            <div class="speakHtText"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { defineProps, reactive, ref, watch, onMounted } from "vue";
import { post } from "@/api";
import HistoryList from "./historyList.vue";
import history from "@assets/imgs/history.png";
import newChat from "@assets/imgs/newChat.png";
import voice from "@assets/imgs/voice.png";
import keyboard from "@assets/imgs/keyboard.png";
import speak from "@assets/imgs/speak.png";
import speaking from "@assets/imgs/speaking.png";
import top from "@assets/imgs/top.png";
// import { resultText, resultTextTemp, recorder, connectWebSocket } from "@utils/iat.js";
// import "@utils/iat1.js"
// import iat from "@utils/iat1.js"
import { useCozeStore } from "@stores";
import { useRouter, useRoute } from "vue-router";
const store = useCozeStore();
const router = useRouter();
const route = useRoute();

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
});
const emit = defineEmits(["send"]);
// defineExpose({ sendMessage });

const historyListShow = ref(false);
const historyListComp = ref(null);
function listShow(show) {
  if (show) {
    historyListComp.value.getConversationlist();
  }
  historyListShow.value = show;
}

function gotoHome() {
  router.push("/home");
}

const agentlistShow = ref(false);
const agentlist = ref([]);
const agent = ref({});
watch(agent, (newVal) => {
  store.updateAuthorization(newVal.token);
  store.updateBotId(newVal.bot_id);
});
function agentlistShowChange() {
  agentlistShow.value = !agentlistShow.value;
}
async function getAgentlist() {
  const { code, data } = await post("/api/index/getAgentlist");
  if (code == 200) {
    agent.value = data[0];
    agentlist.value = data;
  }
}
getAgentlist();
function changeAgent(item) {
  agent.value = item;
  agentlistShow.value = false;
}

const inputText = ref(""); // 输入框内容
const isVoiceMode = ref(false); // 是否为语音模式
const isListening = ref(false); // 是否正在录音

function sendMessage() {
  if (!route.fullPath.includes("/chat")) {
    router.push({
      path: "/chat",
      query: { type: "question", val: inputText.value },
    });
  } else {
    emit("send", inputText.value);
  }
  inputText.value = "";
}
// 切换输入模式
const toggleMode = () => {
  isVoiceMode.value = !isVoiceMode.value;
};

// 开始语音输入
const startVoiceInput = () => {
  isListening.value = true;
  // 这里可以调用语音识别 API
  // connectWebSocket()
  // console.log("111",resultText, resultTextTemp);
};

// 停止语音输入
const stopVoiceInput = () => {
  if (isListening.value) {
    isListening.value = false;

    // recorder.onStop();
    // console.log("222",resultText, resultTextTemp);

    // 这里可以处理语音识别结果
    inputText.value = "Recognized voice message"; // 模拟语音识别结果
  }
};
</script>
<style lang="scss" scoped>
.container {
  height: 100%;
  display: flex;
  & > :first-child {
    flex: 3;
  }
}
.chat {
  flex: 1;
  overflow: hidden;
  height: 100%;
  position: relative;
  max-width: 1080px;
  margin: auto;
}
.chat-container {
  display: flex;
  flex-direction: column;
  height: calc(100% - 100px);
  min-width: 50vh;
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
    overflow: auto;
    &::-webkit-scrollbar {
      display: none;
    }
  }
}
.input {
  width: calc(100% - 20px);
  min-width: 50vh;
  margin: auto;
  position: absolute;
  bottom: 0.5rem;
  left: 10px;
  .change-bot {
    width: 195px;
    height: 27px;
    margin-bottom: 0.5rem;
    background-size: contain;
    position: relative;
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
  .ask-input-all {
    width: 100%;
    height: 51px;
    position: relative;
    .ask-input-group {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 9999;
      .ask-input {
        width: 100%;
        height: 51px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        .ask-question {
          flex-grow: 1;
          height: 100%;
          overflow: hidden;
          border: none;
          background: none;
          margin-left: 25px;
          font-size: 16px;
          font-weight: 400;
          font-stretch: normal;
          letter-spacing: 1px;
          color: #333;
        }
        > p {
          width: 20px;
          display: flex;
          align-items: center;
          margin-top: 4px;
          margin-right: 27px;
        }
        .voice-btn {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          left: 0;
          top: 0;
          font-size: 16px;
          font-weight: 400;
          font-stretch: normal;
          letter-spacing: 1px;
          color: #333;
          overflow: hidden;
          border-radius: 46px;
          box-shadow: 0 0 9px #7a060933;
          border: solid 1px #fff;
          background: #fff;
          > img {
            width: 27px;
            display: block;
            margin-top: 5px;
            -webkit-user-select: none;
            user-select: none;
            pointer-events: none;
          }
        }
        .key-btn {
          width: 27px;
          height: 28px;
          position: absolute;
          right: 20px;
          z-index: 9;
          > img {
            width: 27px;
            height: 28px;
            display: block;
          }
        }
      }
      .ask-input-text {
        overflow: hidden;
        border-radius: 46px;
        box-shadow: 0 0 9px #7a060933;
        border: solid 1px #fff;
        background: #fff;
      }
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
  .voiceNav {
    width: 100%;
    height: 100vh;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 9999;
    -webkit-user-select: none;
    user-select: none;
    .bg {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: #00000080;
      position: absolute;
      left: 0;
      bottom: 0;
    }
    .speanText {
      width: 100%;
      height: auto;
      overflow: hidden;
      position: absolute;
      left: 0;
      bottom: 210px;
      text-align: center;
      font-size: 17px;
      color: #fff;
      pointer-events: none;
    }
    .speakCon {
      width: 100%;
      height: 334px;
      position: absolute;
      left: 0;
      bottom: 0;
      background: url("@assets/imgs/speaking-bgc.png") no-repeat center bottom;
      background-size: contain;
      .speakHt {
        width: 81px;
        height: 81px;
        position: absolute;
        bottom: 21px;
        left: 50%;
        border-radius: 50%;
        overflow: hidden;
        transform: translate(-50%);
        .speakHtbg {
          width: 81px;
          height: 81px;
          position: absolute;
          top: 0;
          left: 0;
          background: linear-gradient(to bottom, #ffb7ad, #ff3f26);
        }
        .speakHtCon {
          width: 60px;
          height: 60px;
          background-color: #e7f2ff;
          border-radius: 50%;
          overflow: hidden;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          justify-content: center;
          align-items: center;
          pointer-events: none;
          > img {
            width: 20px;
          }
        }
      }
    }
  }
}
</style>
