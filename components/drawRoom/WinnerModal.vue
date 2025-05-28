<template>
    <dialog open class="modal modal-open">
        <div class="modal-box flex flex-col items-center bg-[#ffffff]/98 text-black space-y-4">
            <h2 class="text-2xl font-bold text-green-600">ผู้โชคดี คนที่ {{ currentIndex + 1 }}</h2>
            <div v-if="prize.image_url"
                class="w-80 h-80 rounded-full overflow-hidden border-4 border-white drop-shadow-lg">
                <img :src="getImageSrc(prize.image_url)" :alt="prize.name" class="object-cover w-full h-full" />
            </div>
            <div v-else class="w-60 h-60 bg-gray-200 rounded-full flex items-center justify-center shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
            <p class="text-xl font-semibold">🎉 Congratulation 🎉</p>
            <p class="text-3xl">
                <strong>{{ currentWinner?.prefix }} {{ currentWinner?.first_name }} {{ currentWinner?.last_name
                    }}</strong>
            </p>
            <p>ได้รับ</p>
            <p class="text-2xl font-semibold">{{ prizeData.name }}</p>

            <div class="flex justify-center gap-4 mt-4">
                <button class="btn btn-success" @click="$emit('submitWinner', 'not_received')">✅
                    ยืนยันรับรางวัล</button>
                <button class="btn btn-warning" @click="$emit('submitWinner', 'waive')">⚠️ สละสิทธิ์</button>
                <!-- <button class="btn btn-error" @click="$emit('submitWinner', 'no_show')">❌ ไม่แสดงตน</button> -->
            </div>
        </div>
    </dialog>
</template>

<script setup>
defineProps(['currentWinner', 'currentIndex', 'prizeData'])
</script>