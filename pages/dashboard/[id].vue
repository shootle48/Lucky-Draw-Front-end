<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { useWinnerStore } from '@/stores/winnerStore'
import { usePlayerStore } from '@/stores/playerStore'
import { ref, watch } from 'vue'
import WinnerCarousel from '@/components/winner/WinnerCarousel.vue'
import WinnerModal from '@/components/winner/WinnerModal.vue'
import type { winnerType } from '@/types/winner'

const route = useRoute()
const winnerStore = useWinnerStore()
const playerStore = usePlayerStore()

const showModal = ref(false)
const selectedWinner = ref<winnerType | null>(null)

const openDetail = (winner: winnerType) => {
    selectedWinner.value = winner
    showModal.value = true
}

const toggleAutoplay = () => {
    autoplay.value = !autoplay.value
}

const autoplay = ref(true)
const autoplayDelay = 4000

// ดึง roomID จาก route param (url) แทนการดึงจาก store
const roomID = ref(route.params.id as string)

// ถ้าต้องการซิงค์ roomID ลง playerStore ก็ทำได้ (ไม่จำเป็นก็ข้ามได้)
playerStore.currentRoomId = roomID.value

// เวลาที่ route.params.id เปลี่ยน หรือ หน้าโหลดใหม่
watch(
    () => route.params.id,
    async (newId) => {
        if (typeof newId === 'string') {
            roomID.value = newId
            playerStore.currentRoomId = newId // ซิงค์ถ้าต้องการ
            await winnerStore.fetchDashboard(newId)
        }
    },
    { immediate: true }
)
</script>

<template>
    <div class="p-6 space-y-6">
        <h1 class="text-3xl font-bold text-center text-black">
            Summary of the Dashboard
        </h1>

        <LoadingPage v-if="winnerStore.isLoading" />

        <div v-else>
            <!-- 🏆 ผู้ชนะ -->
            <div class="card w-full px-10">
                <h2 class="text-2xl font-semibold text-center text-black">🏆 ผู้ที่ได้รางวัล</h2>
                <div v-if="winnerStore.winners.length === 0" class="text-xl text-gray-500 text-center my-4">
                    ยังไม่มีผู้ชนะรางวัล
                </div>

                <div class="flex justify-end mb-4">
                    <button @click="toggleAutoplay"
                        class="btn bg-gradient-to-t from-[#3fc028] to-[#5ee746] p-2 border-0 rounded-full text-white shadow-md"
                        :class="autoplay ? 'btn-success' : 'btn-outline'">
                        <!-- icon toggle -->
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <template v-if="autoplay">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </template>
                            <template v-else>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </template>
                        </svg>

                    </button>
                </div>

                <WinnerCarousel :items="winnerStore.winners" type="winner" :autoplay="autoplay"
                    :autoplayDelay="autoplayDelay" @show-detail="openDetail" />
                <WinnerModal v-model:show="showModal" :data="selectedWinner ?? undefined" />
            </div>

            <!-- 🎁 รางวัลที่เหลือ -->
            <div class="card w-full px-10 mt-15">
                <h2 class="text-2xl font-semibold text-center text-black mb-5">🎁 รางวัลที่เหลือ</h2>
                <div v-if="winnerStore.prizes.length === 0" class="text-xl text-gray-500 text-center my-4">
                    ไม่มีรางวัลที่เหลือ
                </div>

                <WinnerCarousel :items="winnerStore.prizes" type="prize" :autoplay="true" :autoplayDelay="6000" />
            </div>
        </div>
    </div>


</template>

<style scoped></style>
