import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useTokenStore = defineStore("token", (data) => {
  console.log('111',data);
  
  const token = ref("");
  function updateStore() {
    token.value = data;
  }
console.log('aaaaaa',token);

  return { token, updateStore };
});
