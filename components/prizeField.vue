<script setup lang="ts">
import type { prizeType } from '@/types/prize';

const prizeStore = usePrizeStore();
const prizes = ref<prizeType[]>([]);

onMounted(async () => {
  await prizeStore.fetchPrizes(); // Fetch prizes from the store
  prizes.value = prizeStore.prizes;
});
</script>

<template>
  <div class="container mx-auto p-4">
    <PrizeCarousel :prizes="prizes"/>
  </div>
</template>