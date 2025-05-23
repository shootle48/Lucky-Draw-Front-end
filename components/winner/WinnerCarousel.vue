<script lang="ts" setup>
import type { winnerType } from '@/types/winner';
defineProps({
  items: {
    type: Array,
    required: true,
  },
  type: {
    type: String,
    default: 'winner',
  },
  autoplay: {
    type: Boolean,
    default: true,
  },
  autoplayDelay: {
    type: Number,
    default: 4000,
  },
})

const formatDate = (timestamp: number) => {
  if (!timestamp) return '-'
  const date = new Date(timestamp * 1000)
  return date.toLocaleString('th-TH', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

</script>

<template>
  <UCarousel v-slot="{ item }" :items="items" :autoplay="autoplay ? { delay: autoplayDelay } : false" loop arrows dots
    class="mx-auto lg:max-w-[1500px]" :ui="{
      item:
        type === 'winner'
          ? 'basis-full sm:basis-1/2 md:basis-1/2 lg:basis-1/3 xl:basis-1/4 grid grid-cols-1 gap-4'
          : 'basis-full sm:basis-1/3 md:basis-1/3 lg:basis-1/4 px-2 grid grid-cols-1 gap-4',
    }">

    <!-- Winner Card -->
    <div v-if="type === 'winner'" class="card bg-white/60 drop-shadow-lg hover:bg-white/50 md:min-w-70">
      <figure class="aspect-video overflow-hidden mt-5">
        <img v-if="item.image_url" :src="item.image_url" alt="Prize Image" class="rounded-xl object-contain h-full"
          @error="(e) => (e.target.src = '')" />
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 text-gray-400" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </figure>
      <div class="card-body flex items-center flex-col text-center max-w-[300px] mx-auto">
        <h3 class="card-title text-lg font-bold text-black">
          {{ item.prefix }}{{ item.first_name }} {{ item.last_name }}
        </h3>
        <p class="text-sm text-gray-500">
          {{ item.position }} | {{ item.member_id }}
        </p>
        <div class="badge badge-success gap-2 my-2">
          🏅 {{ item.prize_name }}
        </div>

        <button @click="$emit('show-detail', item)"
          class="btn h-fit bg-gradient-to-t from-[#E69DB8] to-[#FFD0C7] p-0.5 px-1.5 py-1.5 border-0 rounded-[2rem]  text-white shadow-black shadow-sm">
          <div class="bg-[#E69DB8] rounded-[2rem] p-0.25 px-2.5 text-sm md:text-lg font-medium flex items-center gap-1">
            <p class="drop-shadow-lg text-sm">ดูรายละเอียด</p>
          </div>
        </button>
        <p class="text-xs text-gray-400 mt-auto">
          สุ่มวันที่: {{ formatDate(item.created_at) }}
        </p>
      </div>
    </div>

    <!-- Prize Card -->
    <div v-else class="card bg-[#ffffff98] drop-shadow-lg hover:bg-white/50 md:min-w-50">
      <figure class="aspect-video overflow-hidden mt-5">
        <img v-if="item.image_url" :src="item.image_url" alt="Prize Image" class="rounded-xl object-contain h-full"
          @error="(e) => (e.target.src = '')" />
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 text-gray-400" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </figure>
      <div class="card-body flex flex-col items-center text-center p-4">
        <h3 class="card-title text-lg font-bold text-black truncate">
          {{ item.name }}
        </h3>
        <p class="text-sm text-gray-600">
          รางวัลที่เหลือ: {{ item.quantity }}
        </p>
      </div>
    </div>
  </UCarousel>
</template>

<style scoped></style>