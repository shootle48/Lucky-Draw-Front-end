<template>
    <div>
        <div v-if='isLoading'  class="h-full">
        <LoadingPage/>
    </div>
    <div v-else  class="flex flex-col m-6">
            <div class="flex justify-center mb-4">
                <h1 class="text-3xl font-bold">{{ roomName }}</h1>
            </div>
            <div class="flex justify-center p-4">
                <PrizeField />
            </div>
            <div class="flex flex-col justify-center items-center p-4">
                <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-fit shadow-lg border p-4">
                    <legend class="fieldset-legend text-left text-3xl">ผู้เล่น</legend>
                    <div class="form-control w-full text-left">
                        <label class="label">
                            <span class="label-text text-lg mb-2">นำเข้ารายชื่อผู้เข้าร่วม (.xls, .xlsx, .csv)</span>
                        </label>
                        <input type="file" @change="playerStore.handlePlayersImport" accept=".xls,.xlsx,.csv"
                            class="file-input file-input-bordered w-full" />
                    </div>
                </fieldset>
                <PlayerField :players="playerStore.players" v-if="playerStore.players.length > 0" class="mt-6" />
            </div>
            <button class="btn btn-secondary w-fit mx-auto">เริ่มสุ่มรางวัล!</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { usePlayerStore } from '@/stores/playerStore';

const route = useRoute();
const playerStore = usePlayerStore();
const roomName = playerStore.rooms.name;
const isLoading = computed(() => playerStore.isLoading)



onMounted( ()=> {
     playerStore.fetchRoom(route.params.id as string);
})
</script>

<style lang="scss" scoped></style>