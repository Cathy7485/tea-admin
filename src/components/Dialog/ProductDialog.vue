<script setup lang="ts">
const props = defineProps<{
  dialogVisible: boolean;
  dialogTitle: string;
  defaultFormData: any | null;
  dialogRules: Record<string, any>;
  dialogType: string;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "submit", fromData: Partial<any>, selectPoints: number[]): void;
}>();

const closeDialog = () => {
  emit("close");
};
</script>

<template>
  <Teleport to="#teleport-container">
    <transition name="fade">
      <div v-if="dialogVisible" class="dialog-wrapper">
        <div class="dialog-control">
          <div class="dialog-title">
            {{ dialogTitle }}
            <div class="close-btn" @click="closeDialog">關閉</div>
          </div>
          <div class="dialog-content"></div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style lang="scss" scoped></style>
