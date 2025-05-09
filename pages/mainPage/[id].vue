<script setup lang="ts">
import type { playerType } from '@/types/player';
import logo from '@/assets/logo.png';

const route = useRoute();
const playerStore = usePlayerStore();
const roomId = route.params.id as string;

const { isLoading, rooms, players } = storeToRefs(playerStore);
const roomName = computed(() => rooms.value.name);


onMounted(async () => {
    await playerStore.fetchRoom(roomId);
    await playerStore.fetchPlayers(roomId)
    console.log(playerStore.players)
});

const handleAddPlayer = async (newPlayer: playerType) => {
    try {
        await playerStore.addPlayer(newPlayer, roomId)
        await playerStore.fetchPlayers(roomId)
    } catch (error) {
        console.error('เพิ่มผู้เล่นไม่สำเร็จ:', error)
        alert('เกิดข้อผิดพลาดในการเพิ่มผู้เล่น')
    }
}
const handleEditPlayer = async (updatedPlayer: playerType) => {
    try {
        await playerStore.editPlayer(updatedPlayer)
        await playerStore.fetchPlayers(roomId)
    } catch (error: any) {
        console.error("แก้ไขผู้เล่นไม่สำเร็จ:", error)
        const errorMsg = error?.response?.data?.error || error?.message || 'เกิดข้อผิดพลาดในการแก้ไขผู้เล่น'
        alert(errorMsg)
    }
}


</script>

<template>
    <div>
        <div class="flex flex-col items-center">
            <div>
                <img :src="logo" alt="Lucky Draw Logo" class="w-70 h-50 md:w-100 md:h-70" />
            </div>
            <div
                class="bg-[#ffffff98] rounded-box  max-w-md shadow-lg py-4 px-6 sm:px-10 mb-4 text-center mx-4 md:mx-auto">
                <h1 class="text-black/70 text-xl md:text-2xl font-bold drop-shadow-lg">{{ roomName }}</h1>
            </div>
            <PrizeField />
            <div class="flex flex-col justify-center items-center">
                <PlayerField :players="players" @add="handleAddPlayer" @edit="handleEditPlayer"
                    v-if="playerStore.players.length > 0" class="mt-6" />

            </div>
        </div>
    </div>
    <div v-if='isLoading' class="h-full">
        <LoadingPage />
    </div>
    <!-- นำเข้า component PrizeModals -->
    <PrizeModals ref="prizeModalsRef" />
</template>

<style lang="scss" scoped></style>