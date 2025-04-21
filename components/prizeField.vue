<script setup lang="ts">
import type { prizeType } from '@/types/prize';
import { useRoute } from 'vue-router' 

const route = useRoute();

const prizeStore = usePrizeStore();
const prizes = ref<prizeType[]>([]);

onMounted(async () => {
  const roomId = route.params.id as string;
  await prizeStore.fetchPrizes(roomId);
  prizes.value = prizeStore.prizes;
});
</script>

<template>
  <div class="container mx-auto p-4">
    <PrizeCarousel :prizes="prizes"/>
  </div>
</template>