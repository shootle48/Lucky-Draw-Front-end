<script setup lang="ts">
const route = useRoute();
const playerStore = usePlayerStore();
const roomId = route.params.id as string;

const { isLoading, rooms } = storeToRefs(playerStore);
const roomName = computed(() => rooms.value.name);


onMounted(async () => {
    await playerStore.fetchRoom(roomId);
    await playerStore.fetchPlayers(roomId)
    console.log(playerStore.players)
});
</script>

<template>
    <div>
        <div class="flex flex-col m-6">
            <div class="flex justify-center">
                <h1 class="text-3xl font-bold">{{ roomName }}</h1>
            </div>
            <PrizeField />
            <div class="flex flex-col justify-center items-center">
                <PlayerField :players="playerStore.players" v-if="playerStore.players.length > 0" class="mt-6" />
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