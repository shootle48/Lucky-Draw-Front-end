<template>
    <div class="min-h-screen flex flex-col items-center justify-center text-center p-6">
        <h1 class="text-3xl font-bold text-red-600 drop-shadow">ยังไม่มีห้องที่ถูกสร้าง</h1>
        <p class="text-lg mt-4 text-gray-700">กรุณาสร้างห้องใหม่ก่อนเพื่อเริ่มต้นการจับรางวัล</p>

        <button @click="goHome"
            class="mt-6 px-6 py-3 bg-gradient-to-r from-green-400 to-green-600 text-white text-lg font-semibold rounded-full shadow hover:scale-105 transition cursor-pointer">
            กลับไปหน้าหลัก
        </button>
    </div>
</template>

<script setup lang="ts">
const router = useRouter()

function goHome() {
    router.push('/')
}
</script>
