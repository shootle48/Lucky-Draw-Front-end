<template>
    <dialog open class="modal modal-open">
        <div class="modal-box text-center space-y-4">
            <h2 class="text-2xl font-bold text-green-600">🎉 ผู้โชคดี คนที่ {{ currentIndex + 1 }} 🎉</h2>
            <img :src="prizeData?.image_url" class="w-32 h-32 mx-auto rounded object-cover" />
            <p class="text-xl font-semibold">รางวัล: {{ prizeData?.name }}</p>
            <p class="text-lg">
                คุณ <strong>{{ currentWinner?.prefix }} {{ currentWinner?.first_name }} {{ currentWinner?.last_name
                    }}</strong>
            </p>

            <div class="flex justify-center gap-4 mt-4">
                <button class="btn btn-success" @click="$emit('submitWinner', 'not_received')">✅ ยืนยันรับรางวัล</button>
                <button class="btn btn-warning" @click="$emit('submitWinner', 'waive')">⚠️ สละสิทธิ์</button>
                <button class="btn btn-error" @click="$emit('submitWinner', 'no_show')">❌ ไม่แสดงตน</button>
            </div>
        </div>
    </dialog>
</template>

<script setup>
defineProps(['currentWinner', 'currentIndex', 'prizeData'])
</script>