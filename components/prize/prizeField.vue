<script setup lang="ts">
import PrizesCarousel from './prizesCarousel.vue';


const route = useRoute();
const prizeStore = usePrizeStore();
const { prizes } = storeToRefs(prizeStore);
const roomId = route.params.id as string;

onMounted(async () => {
  await prizeStore.fetchPrizes(roomId);
});
</script>

<template>
  <div class="container mx-auto">
    <fieldset class="fieldset bg-base-200 border-base-300 rounded-box border p-4">
      <legend class="fieldset-legend">
        <h2 class="card-title text-3xl">รางวัล</h2>
      </legend>
      <PrizesCarousel />
    </fieldset>
  </div>
</template>