<script setup lang="ts">
import type { playerType } from '@/types/player';

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
        <div class="flex flex-col m-6">
            <div class="flex justify-center">
                <h1 class="text-3xl font-bold">{{ roomName }}</h1>
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