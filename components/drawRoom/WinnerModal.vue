<template>
    <dialog open class="modal modal-open">
        <div class="modal-box flex flex-col items-center bg-[#ffffff]/98 text-black space-y-4">
            <h2 class="text-2xl font-bold text-green-600">ผู้โชคดี คนที่ {{ currentIndex + 1 }}</h2>
            <img :src="prizeData?.image_url" class="w-72 h-72 rounded-full overflow-hidden border-4 border-white shadow-lg" />
            <p class="text-xl font-semibold">🎉 Congratulation 🎉</p>
            <p class="text-3xl">
                <strong>{{ currentWinner?.prefix }} {{ currentWinner?.first_name }} {{ currentWinner?.last_name
                }}</strong>
            </p>
            <p>ได้รับ</p>
            <p class="text-2xl font-semibold">{{prizeData.name}}</p>

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