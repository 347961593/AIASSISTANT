<template>
  <ChatStyle title="安院长智能助手" ref="chatStyleComp">
    <div class="user">
      <div class="usertext">怎样才能获取更多的课本知识</div>
    </div>
    <div class="system">
      <div class="system_text">
        <div class="system-title">
          <span></span> 【智能助手】已深度思考
          <img :src="down" alt="" />
        </div>
        <div class="system-thinking no-think"></div>
        <div class="system-content">
          <p>
            获取更多的课本知识，需要采用系统、高效的学习方法，并结合多种资源来加深理解和记忆。以下是一些具体策略：
          </p>
          <hr />
          <h3>1. <strong>高效阅读课本</strong></h3>
          <ul>
            <li>
              <strong>精读与略读结合</strong
              >：重点章节精读，非重点内容略读，提高效率。
            </li>
            <li>
              <strong>标记重点</strong
              >：用荧光笔或笔记标注重要概念、公式、案例等。
            </li>
            <li>
              <strong>提问式阅读</strong
              >：在阅读时提出问题，带着问题寻找答案，增强理解。
            </li>
          </ul>
          <hr />
          <h3>2. <strong>做好笔记</strong></h3>
          <ul>
            <li>
              <strong>结构化笔记</strong
              >：用思维导图、表格或大纲整理知识点，形成清晰的知识框架。
            </li>
            <li>
              <strong>用自己的语言总结</strong
              >：将课本内容用自己的话复述，加深记忆。
            </li>
            <li>
              <strong>记录疑问</strong
              >：将不懂的地方记下来，课后查阅或请教老师。
            </li>
          </ul>
          <hr />
          <h3>3. <strong>课前预习与课后复习</strong></h3>
          <ul>
            <li>
              <strong>预习</strong
              >：提前浏览课本内容，了解重点和难点，带着问题听课。
            </li>
            <li>
              <strong>复习</strong>：课后及时复习，巩固当天所学内容，避免遗忘。
            </li>
          </ul>
          <hr />
          <h3>4. <strong>多做练习</strong></h3>
          <ul>
            <li>
              <strong>课后习题</strong>：认真完成课本中的练习题，检验学习效果。
            </li>
            <li>
              <strong>拓展练习</strong
              >：寻找额外的练习题或模拟题，提升应用能力。
            </li>
          </ul>
          <hr />
          <h3>5. <strong>利用多种学习资源</strong></h3>
          <ul>
            <li>
              <strong>参考书籍</strong
              >：查阅与课本相关的参考书，获取更深入的解释和案例。
            </li>
            <li>
              <strong>在线资源</strong
              >：使用学习网站、视频课程（如Coursera、Khan Academy）补充知识。
            </li>
            <li>
              <strong>学术论文</strong
              >：对于高年级学生，可以阅读相关领域的论文，了解前沿知识。
            </li>
          </ul>
          <hr />
          <h3>6. <strong>主动思考与联系实际</strong></h3>
          <ul>
            <li>
              <strong>举一反三</strong
              >：将课本知识与实际生活或现实问题联系起来，加深理解。
            </li>
            <li>
              <strong>批判性思维</strong
              >：对课本内容提出疑问，思考其逻辑和应用场景。
            </li>
          </ul>
          <hr />
          <h3>7. <strong>参与讨论与交流</strong></h3>
          <ul>
            <li>
              <strong>小组学习</strong
              >：与同学组成学习小组，互相讲解知识点，解决疑问。
            </li>
            <li>
              <strong>请教老师</strong>：遇到不懂的问题，及时向老师或专家请教。
            </li>
          </ul>
          <hr />
          <h3>8. <strong>制定学习计划</strong></h3>
          <ul>
            <li>
              <strong>分阶段学习</strong>：将课本内容分成小目标，逐步完成。
            </li>
            <li><strong>时间管理</strong>：合理安排学习时间，避免拖延。</li>
          </ul>
          <hr />
          <h3>9. <strong>定期复习与自测</strong></h3>
          <ul>
            <li>
              <strong>间隔复习</strong
              >：根据艾宾浩斯遗忘曲线，定期复习已学内容。
            </li>
            <li>
              <strong>自我测试</strong>：通过模拟考试或自测题，检验学习效果。
            </li>
          </ul>
          <hr />
          <h3>10. <strong>培养学习兴趣</strong></h3>
          <ul>
            <li>
              <strong>寻找兴趣点</strong
              >：从课本中找到自己感兴趣的部分，激发学习动力。
            </li>
            <li>
              <strong>设定目标</strong>：为自己设定学习目标，完成后给予奖励。
            </li>
          </ul>
          <hr />
          <p>
            通过以上方法，你可以更高效地获取课本知识，并逐步建立扎实的知识体系。坚持实践，你的学习效果会显著提升！
          </p>
        </div>
        <div class="voice-play">
          <div class="itemcon">
            <div class="item"><img :src="play" mode="" />语音播放</div>
          </div>
          <div class="right-btn">
            <img :src="reload" alt="" /><img :src="copy" alt="" />
          </div>
        </div>
      </div>
    </div>
  </ChatStyle>
</template>

<script setup>
import ChatStyle from "@comp/chatStyle.vue";
import { ref } from "vue";
import down from "@assets/imgs/down.png";
import play from "@assets/imgs/play.png";
import reload from "@assets/imgs/reload.png";
import copy from "@assets/imgs/copy.png";
import { post } from "@/api";

async function createChat() {
  const { code, data } = await post("/coze/v1/conversation/create", {
    conversation_id: id,
  });
  if (code == 200) {
  } 
}
async function getChatlist(id) {
  const { code, data } = await post("member/chatlist", {
    conversation_id: id,
  });
  if (code == 200) {
  } 
}
const chatStyleComp = ref(null);
console.log('111',chatStyleComp);

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
