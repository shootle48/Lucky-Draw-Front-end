<script setup lang="ts">
import PrizesCarousel from './prizesCarousel.vue';


const route = useRoute();
const prizeStore = usePrizeStore();
const roomId = route.params.id as string;

onMounted(async () => {
  await prizeStore.fetchPrizes(roomId);
});

const props = defineProps({
  handleEditPrize: Function
})
</script>

<template>
  <div class="container mx-auto">
    <fieldset class="fieldset glass rounded-box border p-4">
      <legend class="fieldset-legend">
        <h2 class="card-title text-3xl">รางวัล</h2>
      </legend>
      <PrizesCarousel :handleEditPrize="handleEditPrize" />
    </fieldset>
  </div>
</template>