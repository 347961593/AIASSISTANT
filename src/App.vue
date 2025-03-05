<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="app">
    <RouterView />
  </div>
</template>

<style lang="scss" scoped>
.app{
  background-color: $orange1;
  height: 100vh;
  overflow: auto;
}
</style>
