import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useCozeStore = defineStore("coze", () => {
  const authorization = ref("");
  function updateAuthorization(data) {
    authorization.value = data;
  }

  const bot_id = ref("");
  function updateBotId(data) {
    bot_id.value = data;
  }
  return { authorization, updateAuthorization, bot_id, updateBotId };
});