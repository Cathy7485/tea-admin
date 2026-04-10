<!-- <script setup lang="ts">
import type { TPagination } from "@/types/schedule";

const props = withDefaults(defineProps<TPagination>(), {
  maxVisible: 10,
});

const emit = defineEmits<{
  (e: "update:currentPage", page: number): void;
}>();

const totalPages = computed((): number => Math.max(1, Math.ceil(props.totalCount / props.limit)));

const paginationButtons = computed<(number | string)[]>((): (number | string)[] => {
  const pages: (number | string)[] = [];
  const total = totalPages.value;
  const { currentPage, maxVisible } = props;

  if (total <= maxVisible!) {
    for (let i = 1; i <= total; i++) pages.push(i);
    return pages;
  }

  let startPage = Math.max(1, currentPage - Math.floor(maxVisible! / 2));
  let endPage = startPage + maxVisible! - 1;

  if (endPage > total) {
    endPage = total;
    startPage = Math.max(1, endPage - maxVisible! + 1);
  }

  if (startPage > 1) {
    pages.push(1);
    if (startPage > 2) pages.push("...");
  }

  for (let i = startPage; i <= endPage; i++) pages.push(i);

  if (endPage < total) {
    if (endPage < total - 1) pages.push("...");
    pages.push(total);
  }

  return pages;
});

const goToPage = (page: number): void => {
  if (page >= 1 && page <= totalPages.value && page !== props.currentPage) {
    emit("update:currentPage", page);
  }
};
</script>

<template>
  <div class="page-controller" v-if="props.totalCount > 1 && !props.isShowChart">
    <button
      :disabled="props.currentPage === 1"
      :class="['btn-left', props.currentPage === 1 ? 'disabled' : '']"
      @click="goToPage(props.currentPage - 1)"
    >
      <img src="/images/arrow-left.png" alt="左鍵" />
    </button>

    <span
      v-for="(page, index) in paginationButtons"
      :key="index"
      :class="['page-num', { active: page === props.currentPage }]"
      @click="typeof page === 'number' && goToPage(page)"
      style="margin: 0 0.25rem"
    >
      {{ page }}
    </span>

    <button
      :disabled="props.currentPage === totalPages"
      :class="['btn-right', props.currentPage === totalPages ? 'disabled' : '']"
      @click="goToPage(props.currentPage + 1)"
    >
      <img src="/images/arrow-right.png" alt="右鍵" />
    </button>
  </div>
</template> -->
