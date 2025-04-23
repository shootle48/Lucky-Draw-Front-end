<script setup lang="ts">

const route = useRoute();
const prizeStore = usePrizeStore();

const { isLoading, prizes } = storeToRefs(prizeStore);

// Carousel config
const autoplay = ref(true);
const autoplayDelay = 2000;


// สร้าง computed property สำหรับ items ที่จะส่งให้ UCarousel
const carouselItems = computed(() => {
  // คืนค่า array ของรางวัลแต่ละชิ้น
  return prizes.value;
});

onMounted(() => {
  prizeStore.fetchPrizes(route.params.id as string);
  // ตั้งค่า room_id สำหรับรางวัลใหม่
  prizeStore.newPrize.room_id = route.params.id as string;
});

const toggleAutoplay = () => {
  autoplay.value = !autoplay.value;
};

const props = defineProps({
  handleEditPrize: Function
})
</script>

<template>
  <div class="card w-full px-10">
    <div class="">
      <div class="flex justify-end items-center mb-4">
        <div class="flex gap-2">
          <!-- ปุ่มเปิด/ปิดการเลื่อนอัตโนมัติ -->
          <button @click="toggleAutoplay" class="btn btn-sm btn-circle"
            :class="autoplay ? 'btn-success' : 'btn-outline'">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path v-if="autoplay" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path v-if="!autoplay" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button @click="prizeStore.showAddPrizeModal = true" class="btn btn-primary btn-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            เพิ่มรางวัล
          </button>
        </div>
      </div>

      <!-- รายการรางวัลแบบ UCarousel -->
      <div v-if="prizes.length > 0" class="mb-4">
        <UCarousel v-slot="{ item }" :items="carouselItems" :ui="{
          item: 'basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 px-2 grid grid-cols-1'
        }" :autoplay="autoplay ? { delay: autoplayDelay } : false" loop arrows dots class="">
          <div class="px-2">
            <PrizeCard :prize="item" :handleEditPrize="handleEditPrize" />
          </div>
        </UCarousel>
      </div>

      <!-- ถ้าไม่มีรางวัล -->
      <div v-if="prizes.length === 0" class="alert alert-info">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>ยังไม่มีรางวัล กรุณาเพิ่มรางวัลอย่างน้อย 1 รายการ</span>
      </div>
    </div>
  </div>
</template>