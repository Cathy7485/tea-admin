<script setup lang="ts">
const props = defineProps<{
  imgUrl: string;
  imgTitle: string;
}>();
</script>

<template>
  <div class="img-box">
    <img :src="imgUrl" :alt="imgTitle" />
  </div>
</template>

<style lang="scss" scoped></style>
