<template>
    <div v-if="prizeData" class="bg-[#ffffff]/80 rounded-2xl w-fit mx-auto px-12 py-6 flex flex-col gap-4">
        <h3 class="text-4xl font-semibold">{{ prizeData.name }}</h3>
        <p>จำนวนรางวัลทั้งหมด: {{ prizeData.quantity }}</p>
        <img :src="prizeData.image_url" :alt="prizeData.name" class="mx-auto w-60 h-60 object-cover rounded" />
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