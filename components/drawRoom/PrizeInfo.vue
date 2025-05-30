<template>
    <div v-if="prizeData" class="bg-[#ffffff]/80 rounded-2xl w-fit mx-auto px-12 py-6 flex flex-col gap-4">
        <h3 class="text-4xl font-semibold">{{ prizeData.name }}</h3>
        <p>จำนวนรางวัลทั้งหมด: {{ prizeData.quantity }}</p>
        <div v-if="prizeData.image_url">
            <img :src="prizeData.image_url" :alt="prizeData.name" class="mx-auto w-60 h-60 object-cover rounded" />
        </div>
        <div v-else>
            <div class="w-60 h-60 bg-gray-200 rounded-full flex items-center justify-center shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
        </div>
        <div>
            <button
                class="btn h-fit bg-gradient-to-t from-[#ff8f00] to-[#ffd902] p-2 border-0 rounded-[2rem] w-fit shadow-md/30 shadow-black text-white "
                @click="$emit('startDrawing')" :disabled="isDrawing">
                <div class="bg-[#ffae02] px-4 py-2 rounded-[2rem] text-lg font-semibold">
                    <p class="drop-shadow-sm">สุ่ม {{ drawQuantity }} คน</p>
                </div>
            </button>
        </div>
    </div>
</template>

<script setup>
defineProps(['prizeData', 'drawQuantity', 'isDrawing'])
</script>