<script setup lang="ts">
import type { prizeType } from '@/types/prize';

const prizeStore = usePrizeStore();
const route = useRoute();

const roomID = route.params.id
const isMainPage = computed(() => route.path.startsWith('/mainPage'));
const isPrizeChoose = computed(() => route.path.startsWith('/prizeChoose'))
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
  <div v-if="isPrizeChoose" class="card bg-[#ffffff98] border-0 rounded-box relative overflow-hidden mx-auto">


    <figure class="px-4 pt-4 w-fit mx-auto">
      <div v-if="prize.image_url" class="w-80 h-80 rounded-full overflow-hidden border-4 border-white drop-shadow-lg">
        <img :src="getImageSrc(prize.image_url)" :alt="prize.name" class="object-cover w-full h-full" />
      </div>
      <div v-else class="w-60 h-60 bg-gray-200 rounded-full flex items-center justify-center shadow-inner">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    </figure>


    <div class="p-4 flex flex-col items-center gap-2">
      <label class="text-black/50">รางวัล</label>
      <div class="">
        <h1 class="text-black text-xl md:text-2xl font-bold drop-shadow-lg">{{ prize.name }}</h1>
      </div>
      <div class="">
        <div class="text-black font-semibold text-sm lg:text-lg md:text-sm">
          จำนวน {{ prize.quantity }} รางวัล
        </div>
      </div>
    </div>
  </div>

  <div v-else class="card bg-[#ffffff98] border rounded-box relative overflow-hidden min-w-[215px] ">

    <!-- ✅ แสดงปุ่มลบเฉพาะใน /room/:id -->
    <div v-if="!isMainPage && !isPrizeChoose">
      <button @click="prizeStore.deletePrize(prize.id as string)"
        class="absolute top-2 right-2 btn btn-sm btn-circle btn-error  z-10">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>



    <figure class="px-4 pt-4">
      <div v-if="prize.image_url"
        class="w-60 h-60 rounded-full overflow-hidden border-4 border-white flex items-center justify-center">
        <img :src="getImageSrc(prize.image_url)" :alt="prize.name" class="object-cover w-full h-full" />
      </div>
      <div v-else class="w-60 h-60 bg-gray-200 rounded-full flex items-center justify-center shadow-inner">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    </figure>


    <div class="card-body p-4">
      <h3 class="font-bold text-center truncate text-xl text-black">{{ prize.name }}</h3>
      <div class="flex items-center justify-between">
        <div class="text-black mt-4 min-w-[80px] font-semibold p-0 lg:p-0 text-sm lg:text-lg md:text-sm">
          จำนวน {{ prize.quantity }} รางวัล
        </div>

        <div class="card-actions justify-center">
          <!-- ✅ ถ้าอยู่ mainPage → ปุ่ม "เลือก" กลางการ์ด -->
          <NuxtLink v-if="isMainPage" :to="`/prizeChoose/${roomID}/${prize.id}`">
            <button
              class="btn h-fit bg-gradient-to-t from-[#3fc028] to-[#5ee746] p-1 px-2 border-0 rounded-[2rem]  text-white shadow-black shadow-sm mt-4">
              <div class="bg-[#3fc028] rounded-[2rem] p-1 px-4 text-sm md:text-lg font-medium flex items-center gap-1">
                <p class="drop-shadow-lg">เลือก</p>
              </div>
            </button>
          </NuxtLink>
          <div v-else-if="isPrizeChoose" class="hidden"></div>

          <!-- ✅ ถ้าอยู่ room → ปุ่มแก้ไข -->
          <button v-else @click="handleEditPrize(prize)"
            class="btn h-fit bg-gradient-to-t mx-auto from-[#ff8f00] to-[#ffd902] p-1 sm:p-2 mt-4 border-0 rounded-[1.5rem] w-full sm:w-fit text-white shadow-black shadow-sm">
            <div class="bg-[#ffae02] px-4 py-2 sm:px-6 sm:py-3 rounded-[1.5rem] font-medium text-center">
              <p class="drop-shadow-lg">แก้ไข</p>
            </div>
          </button>

        </div>
      </div>
    </div>
  </div>

</template>