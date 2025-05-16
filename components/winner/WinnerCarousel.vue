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
          ? 'basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 px-2 grid grid-cols-1 gap-4'
          : 'basis-full sm:basis-2/3 md:basis-1/3 lg:basis-1/4 px-2 grid grid-cols-1 gap-4',
    }">
    <!-- Winner Card -->
    <div v-if="type === 'winner'" class="card bg-white/60 drop-shadow-lg hover:bg-white/50">
      <figure class="aspect-video overflow-hidden mt-5">
        <img :src="item.image_url" alt="Prize Image" class="rounded-xl object-contain h-full"
          @error="(e) => (e.target.src = '/default-image.png')" />
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
        <button class="btn mt-2" @click="$emit('show-detail', item)">
          ดูรายละเอียด
        </button>
        <p class="text-xs text-gray-400 mt-auto">
          สุ่มวันที่: {{ formatDate(item.created_at) }}
        </p>
      </div>
    </div>

    <!-- Prize Card -->
    <div v-else class="card bg-[#ffffff98] drop-shadow-lg hover:bg-white/50">
      <figure class="aspect-video overflow-hidden mt-5">
        <img :src="item.image_url" alt="Prize Image" class="rounded-xl object-contain h-full"
          @error="(e) => (e.target.src = '/default-image.png')" />
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
