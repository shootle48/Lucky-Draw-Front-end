<script setup lang="ts">
import type { prizeType } from '@/types/prize';

const prizeStore = usePrizeStore();

const getImageSrc = (image: string | File | null): string => {
  if (!image) return "";
  if (typeof image === "string") return image;
  return URL.createObjectURL(image); 
};

const props = defineProps<{
  prize: prizeType;
  handleEditPrize: Function
}>();
</script>

<template>
  <div class="card bg-neutral hover:shadow-md transition-shadow duration-200 relative overflow-hidden">
    <!-- ปุ่มลบรางวัล -->
    <button @click="prizeStore.deletePrize(prize.id as string)"
      class="absolute top-2 right-2 btn btn-sm btn-circle btn-error z-10">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
        stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <!-- แถบสีด้านบนการ์ด -->
    <div class="h-2 w-full bg-primary"></div>

    <figure class="px-4 pt-4">
      <img v-if="prize.image_url" :src="getImageSrc(prize.image_url)" :alt="prize.name"
        class="rounded-xl object-contain h-60" />

      <div v-else class="bg-base-300 rounded-xl flex items-center justify-center h-60 w-60 ">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-base-content opacity-30" fill="none"
          viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    </figure>

    <div class="card-body p-4">
      <h3 class="font-bold text-center truncate">{{ prize.name }}</h3>
      <div class="badge badge-primary badge-outline mx-auto">
        จำนวน {{ prize.quantity }} รางวัล
      </div>

      <div class="card-actions justify-end mt-2">
        <button @click="handleEditPrize(prize)" class="btn btn-sm btn-outline btn-info">แก้ไข</button>
      </div>
    </div>
  </div>
</template>