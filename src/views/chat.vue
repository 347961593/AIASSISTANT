<template>
  <ChatStyle title="安院长智能助手" @send="send">
    <template v-for="(item, index) in chatList" :key="index">
      <div class="user" v-if="item.type == 'question'">
        <div class="usertext" id="questionContent">
          {{ item.content }}
        </div>
      </div>
      <div class="system" v-else-if="item.type == 'answer'">
        <div class="system_text">
          <div class="system-title">
            <span></span> 【智能助手】已深度思考
            <img :src="down" alt="" />
          </div>
          <div class="system-thinking no-think"></div>
          <div class="system-content" :innerHTML="marked(item.content)"></div>
          <div class="voice-play">
            <div
              class="itemcon"
              @click="voicePlay(item.content)"
              v-if="voicePlayShow"
            >
              <div class="item"><img :src="play" mode="" />语音播放</div>
            </div>
            <div class="itemcon" @click="stopAudio" v-else>
              <div class="item"><img :src="stop" mode="" />停止播放</div>
            </div>
            <div class="right-btn">
              <img
                :src="reload"
                v-if="index == chatList.length - 1"
                alt=""
                @click="reloadAnswer"
              />
              <img :src="copy" alt="" @click="copyAnswer(item.content)" />
            </div>
          </div>
        </div>
      </div>
    </template>
  </ChatStyle>
</template>

<script setup>
import ChatStyle from "@comp/chatStyle.vue";
import { ref, watch, nextTick } from "vue";
import { ElMessage } from "element-plus";
import useClipboard from "vue-clipboard3";
import down from "@assets/imgs/down.png";
import play from "@assets/imgs/play.png";
import stop from "@assets/imgs/stop.png";
import reload from "@assets/imgs/reload.png";
import copy from "@assets/imgs/copy.png";
import { post } from "@/api";
import { marked } from "marked";
import { useCozeStore } from "@stores";
import { useRoute } from "vue-router";
const store = useCozeStore();
const route = useRoute();

watch(
  () => route.fullPath,
  (value, oldValue) => {
    if (route.query && route.query.type) {
      console.log(route.query.type);
      nextTick(() => {
        if (route.query.type == "question") {
          send(route.query.val);
        } else if (route.query.type == "chatlist") {
          getChatlist(route.query.id, route.query.conversationId);
        }
      });
    }
  },
  { immediate: true }
);

const conversation_id = ref("");
const chatList = ref([]);
let question = "";
let answer = "";
async function send(val) {
  question = val;
  chatList.value.push({ type: "question", content: val });
  if (conversation_id.value) {
    chat();
  } else {
    (await createChat()) && chat();
  }
  // addChatLog("question", question);
}
async function createChat() {
  const { code, data } = await post("/cozechat/v1/conversation/create");
  if (code == 0) {
    conversation_id.value = data.id;
    return true;
  }
}

async function chat() {
  const payload = {
    additional_messages: [
      {
        content: question,
        content_type: "text",
        role: "user",
      },
    ],
    bot_id: store.bot_id,
    user_id: "18348891588",
    auto_save_history: true,
    stream: true,
  };

  const response = await fetch(
    `/cozechat/v3/chat?conversation_id=${conversation_id.value}`,
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + store.authorization,
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify(payload),
    }
  );

  chatList.value.push({ type: "answer", content: "" });
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });

    // 处理接收到的数据
    updateChatUI(chunk);
  }
  addChatLog("answer", answer);
}
// 更新聊天界面
function updateChatUI(data) {
  const events = [];
  const lines = data.trim().split("\n"); // 按行分割
  let currentEvent = {};
  lines.forEach((line) => {
    if (line.startsWith("event:")) {
      // 提取事件类型
      currentEvent.event = line.replace("event:", "").trim();
    } else if (line.startsWith("data:")) {
      const data = line.replace("data:", "").trim();
      try { 
        // 尝试解析 JSON 数据
        currentEvent.data = JSON.parse(data);
        events.push(currentEvent); // 将完整事件添加到数组中
        currentEvent = {}; // 重置当前事件
      } catch (e) {
        // 如果解析失败，可能是数据不完整，继续累积
        console.warn("JSON 解析失败，可能是数据不完整:", e.message);
      }
    }
  });

  for (let i = 0; i < events.length; i++) {
    const ele = events[i];
    if (ele.event == "conversation.message.delta") {
      answer += ele.data.content;
      chatList.value[chatList.value.length - 1].content = answer;
    }
  }
  return events;
}
//保存聊天记录
async function addChatLog() {
  const { code, data } = await post("/api/index/addchatlog", {
    conversation_id: conversation_id.value,
    question: question,
    answer: answer,
  });
  if (code !== 200) {
    console.log("保存聊天记录失败");
  }
}
//获取历史聊天记录
async function getChatlist(id, conversationId) {
  conversation_id.value = conversationId;
  const { code, data } = await post("/api/member/chatlist", {
    conversation_id: id,
  });
  const list = data.data;
  if (code == 200) {
    console.log(list);
    chatList.value = [];
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      chatList.value.push({ type: "question", content: item.content });
      chatList.value.push({ type: "answer", content: item.data.content });
    }
  } else {
    console.log("获取历史聊天记录失败");
  }
}
//重新加载回答
function reloadAnswer() {
  // chatList.value.pop()
  // TODO conversation_id.value获取失败
  // chat()
}
//复制回答
const { toClipboard } = useClipboard();
async function copyAnswer(content) {
  try {
    await toClipboard(content);
    ElMessage.success("复制成功");
  } catch (e) {
    ElMessage.error("复制失败");
  }
}

const voicePlayShow = ref(true);
//语音播放
async function voicePlay(content) {
  const res = await post("/minimax/v1/tts/stream", {
    text: content,
    model: "speech-01",
    voice_id: "audiobook_male_1",
    audio_sample_rate: 16000,
    bitrate: 32000,
    format: "mp3",
    speed: 1.1,
  });
  processAndPlayAudio(res);
  voicePlayShow.value = false;
}
// 跟踪音频播放实例
let activeAudioSources = [];
let activeAudioElements = [];
let activeAudioContext = null;

/**
 * 完整处理和播放音频
 */
function processAndPlayAudio(rawData) {
  // 记录原始数据的一部分，以便调试
  console.log(
    "原始数据示例:",
    typeof rawData === "string"
      ? rawData.substring(0, 100) + "..."
      : "Not a string"
  );

  const processed = processAudioResponse(rawData);

  if (processed.success) {
    console.log(`成功处理音频数据，格式: ${processed.format}`);
    playAudio(processed.audioBuffer, processed.format);
    return true;
  } else {
    console.error(processed.message);
    return false;
  }
}

/**
 * 处理API响应数据以提取音频内容用于播放
 */
function processAudioResponse(responseText) {
  try {
    let audioData = "";

    // 处理以"data: "开头的响应
    if (
      typeof responseText === "string" &&
      responseText.trim().startsWith("data: ")
    ) {
      // 分离数据块
      const chunks = responseText
        .split("\n\n")
        .filter((chunk) => chunk.trim() !== "")
        .map((chunk) => {
          try {
            // 去掉"data: "前缀
            const jsonText = chunk.replace(/^data:\s/, "").trim();
            const parsedData = JSON.parse(jsonText);
            // 提取音频数据
            return parsedData.data?.audio || "";
          } catch (e) {
            console.error("解析数据块时出错:", e);
            return "";
          }
        });

      audioData = chunks.join("");
    }
    // 处理常规JSON对象或字符串
    else {
      const data =
        typeof responseText === "string"
          ? JSON.parse(responseText)
          : responseText;
      audioData = data?.data?.audio || "";
    }

    console.log("提取的音频数据长度:", audioData.length);

    // 尝试识别音频格式
    const format = detectAudioFormat(audioData);
    console.log("检测到的音频格式:", format);

    // 基于检测到的格式转换数据
    const audioBytes = convertToAudioBuffer(audioData, format);

    return {
      success: true,
      audioBuffer: audioBytes,
      format: format,
      message: "音频数据处理成功",
    };
  } catch (error) {
    console.error("处理音频数据时出错:", error);
    return {
      success: false,
      error: error.message,
      message: "处理音频数据失败",
    };
  }
}

/**
 * 尝试检测音频数据格式
 */
function detectAudioFormat(hexData) {
  // 查看前几个字节来确定格式
  // MP3 通常以 "ID3" 或 0xFF 0xFB 开头
  // WAV 以 "RIFF" 开头
  if (hexData.startsWith("494433")) {
    return "mp3-id3"; // ID3 标签的MP3
  } else if (hexData.startsWith("fff") || hexData.includes("fff3")) {
    return "mp3-raw"; // 原始MP3帧
  } else if (hexData.startsWith("52494646")) {
    return "wav"; // WAV 格式
  } else {
    // 从中间查找一些模式
    if (hexData.includes("fff3")) {
      return "mp3-with-markers"; // 带标记的MP3
    }
    return "unknown"; // 未知格式
  }
}

/**
 * 基于检测到的格式将数据转换为适当的格式
 */
function convertToAudioBuffer(hexData, format) {
  if (format === "mp3-with-markers") {
    // 移除所有 fff3 + 下一个字节，这些可能是标记而不是数据的一部分
    const cleanedHex = hexData.replace(/fff3../g, "");
    return hexToArrayBuffer(cleanedHex);
  } else if (format === "mp3-raw") {
    // 尝试修复数据以使其成为有效的MP3
    // 首先，检查是否有ID3标签，如果没有，添加一个最小的ID3v2标签
    if (!hexData.startsWith("494433")) {
      const id3tag = "494433030000000000"; // 最小ID3v2标签
      hexData = id3tag + hexData;
    }
    return hexToArrayBuffer(hexData);
  } else {
    // 对于其他格式，尝试直接转换
    return hexToArrayBuffer(hexData);
  }
}

/**
 * 将十六进制字符串转换为ArrayBuffer
 */
function hexToArrayBuffer(hexString) {
  // 确保字符数为偶数
  if (hexString.length % 2 !== 0) {
    hexString = "0" + hexString;
  }

  const bytes = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < hexString.length; i += 2) {
    bytes[i / 2] = parseInt(hexString.substring(i, i + 2), 16);
  }

  return bytes.buffer;
}

/**
 * 使用适当的方法播放音频，基于数据格式
 */
function playAudio(audioBuffer, format) {
  // 先停止任何正在播放的音频
  stopAudio();

  // 对于大多数格式，我们使用AudioContext
  if (["mp3-id3", "mp3-raw", "wav", "mp3-with-markers"].includes(format)) {
    playWithAudioContext(audioBuffer);
  } else {
    // 尝试使用备选方法
    playWithAudioElement(audioBuffer);
  }
}

/**
 * 使用AudioContext API播放音频
 */
function playWithAudioContext(audioBuffer) {
  try {
    // 创建新的AudioContext或重用现有的
    if (!activeAudioContext) {
      activeAudioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
    }

    activeAudioContext
      .decodeAudioData(audioBuffer)
      .then((decodedData) => {
        const source = activeAudioContext.createBufferSource();
        source.buffer = decodedData;
        source.connect(activeAudioContext.destination);

        // 保存源以便之后可以停止它
        activeAudioSources.push(source);

        // 添加结束监听器以清理资源
        source.onended = function () {
          const index = activeAudioSources.indexOf(source);
          if (index !== -1) {
            activeAudioSources.splice(index, 1);
          }
          console.log("音频播放结束，已清理资源");
        };

        source.start(0);
        console.log("音频播放已开始 (AudioContext)");
      })
      .catch((error) => {
        console.error("AudioContext解码失败:", error);
        // 尝试备选方法
        console.log("尝试备选播放方法...");
        playWithAudioElement(audioBuffer);
      });
  } catch (error) {
    console.error("初始化AudioContext时出错:", error);
    playWithAudioElement(audioBuffer);
  }
}

/**
 * 使用Audio元素播放音频（备选方法）
 */
function playWithAudioElement(audioBuffer) {
  try {
    // 将ArrayBuffer转换为Blob
    const blob = new Blob([audioBuffer], { type: "audio/mpeg" });
    const url = URL.createObjectURL(blob);

    // 创建Audio元素
    const audio = new Audio();
    audio.src = url;

    // 保存音频元素以便之后停止
    activeAudioElements.push({
      element: audio,
      url: url,
    });

    // 添加事件监听器
    audio.addEventListener("canplaythrough", () => {
      console.log("音频可以播放 (Audio元素)");
      audio.play().catch((e) => console.error("播放失败:", e));
    });

    audio.addEventListener("ended", () => {
      // 清理资源
      stopAudioElement(audio, url);
    });

    audio.addEventListener("error", (e) => {
      console.error("Audio元素错误:", e);
      stopAudioElement(audio, url);
    });
  } catch (error) {
    console.error("使用Audio元素播放失败:", error);
  }
}

/**
 * 停止指定的音频元素并清理资源
 */
function stopAudioElement(audioElement, url) {
  // 停止播放
  audioElement.pause();
  audioElement.src = "";

  // 移除监听器
  audioElement.onended = null;
  audioElement.onerror = null;
  audioElement.oncanplaythrough = null;

  // 释放URL
  URL.revokeObjectURL(url);

  // 从活动列表中移除
  const index = activeAudioElements.findIndex(
    (item) => item.element === audioElement
  );
  if (index !== -1) {
    activeAudioElements.splice(index, 1);
  }
}

/**
 * 停止所有正在播放的音频
 */
function stopAudio() {
  console.log("停止所有音频播放");

  // 停止所有AudioBufferSourceNode
  activeAudioSources.forEach((source) => {
    try {
      source.stop();
    } catch (e) {
      // 忽略已经停止的源
    }
  });
  activeAudioSources = [];

  // 停止所有Audio元素
  activeAudioElements.forEach((item) => {
    stopAudioElement(item.element, item.url);
  });
  activeAudioElements = [];

  // 关闭AudioContext（可选，有些情况下你可能想保持它打开）
  if (activeAudioContext) {
    // 注释: 如果你想每次都创建新的AudioContext，取消下面的注释
    // activeAudioContext.close().then(() => {
    //   console.log('AudioContext已关闭');
    //   activeAudioContext = null;
    // });
  }
  voicePlayShow.value = true;
}

/**
 * 创建并保存文件以供下载（用于调试）
 */
function saveAudioFile(buffer, filename = "audio.mp3") {
  const blob = new Blob([buffer], { type: "audio/mpeg" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.textContent = "下载处理后的音频文件";

  document.body.appendChild(a);
  a.click();

  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
}
</script>

<style lang="scss" scoped>
.user {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  margin-bottom: 20px;
  .usertext {
    background-image: linear-gradient(79deg, #ff896a, #ff371c);
    border-radius: 30px 0 30px 30px;
    max-width: 90%;
    padding: 10px 20px;
    color: #fff;
    font-size: 15px;
    margin-right: 10px;
  }
}
.system {
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 5px;
  .system_text {
    background-color: #fff;
    border-radius: 0 30px 30px;
    overflow: hidden;
    width: 90%;
    position: relative;
    font-size: 26px;
    line-height: 28px;
    color: #b6b6b6;
    box-shadow: 0 2px 5px #7a060933;
    .system-title {
      width: 100%;
      height: 40px;
      background: #fcf9f7;
      letter-spacing: 1px;
      color: #ff6937;
      display: flex;
      align-content: center;
      align-items: center;
      padding-left: 15px;
      position: relative;
      font-size: 14px;
    }
    .system-thinking {
      max-height: 9000px;
      overflow: hidden;
      transition: all 0.5s;
      font-size: 14px;
      line-height: 25px;
      padding: 0 20px;
    }
    .system-content {
      padding: 15px 20px;
      color: #000;
      font-size: 16px;
    }
    .voice-play {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .itemcon {
        .item {
          width: 106px;
          height: 27px;
          background: #fdeee9;
          border-radius: 30px;
          margin-bottom: 10px;
          margin-left: 15px;
          display: flex;
          justify-content: center;
          align-content: center;
          align-items: center;
          overflow: hidden;
          font-size: 14px;
          color: #ff6937;
          cursor: pointer;
          > img {
            width: 1rem;
            height: 1rem;
            margin-right: 10px;
          }
        }
      }
      .right-btn {
        margin-right: 30px;
        display: flex;
        align-items: center;
        > img {
          width: 1.25rem;
          margin-left: 10px;
        }
      }
    }
  }
}
</style>
