<script setup lang="ts">
import { usePlayerStore } from '@/stores/playerStore';

const route = useRoute();
const playerStore = usePlayerStore();
const selectedPlayer = ref<File | null>(null);
const roomId = route.params.id as string;

const { isLoading, rooms } = storeToRefs(playerStore);
const roomName = computed(() => rooms.value.name);

const handlePlayerChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    if (target.files && target.files[0]) {
        selectedPlayer.value = target.files[0]
        console.log("seletedPlayer: ", selectedPlayer.value, "roomID: ",roomId)
    }
}

const handleSubmitImport = async () => {
    if (!selectedPlayer.value) {
        alert('กรุณาเลือกไฟล์ก่อนเริ่มสุ่มรางวัล');
        return;
    }
    await playerStore.handlePlayerImport(selectedPlayer.value, roomId);
};


onMounted(async () => {
    await playerStore.fetchRoom(route.params.id as string);
});
</script>


<style lang="scss" scoped></style>
<template>
    <div>
        <div class="flex flex-col m-6">
            <div class="flex justify-center">
                <h1 class="text-3xl font-bold">{{ roomName }}</h1>
            </div>
            <PrizeField />
            <div class="flex flex-col justify-center items-center my-6">
                <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-fit shadow-lg border p-4">
                    <legend class="fieldset-legend text-left text-3xl">ผู้เล่น</legend>
                    <div class="form-control w-full text-left">
                        <label class="label">
                            <span class="label-text text-lg mb-2">นำเข้ารายชื่อผู้เข้าร่วม (.xls, .xlsx,
                                .csv)</span>
                        </label>
                        <input type="file" @change="handlePlayerChange" accept=".xls,.xlsx,.csv"
                            class="file-input file-input-bordered w-full" />
                    </div>
                </fieldset>
                <PlayerField :players="playerStore.players" v-if="playerStore.players.length > 0" class="mt-6" />
            </div>
            <button @click="handleSubmitImport" class="btn btn-secondary w-fit mx-auto">เริ่มสุ่มรางวัล!</button>
        </div>
    </div>
    <div v-if='isLoading' class="h-full">
        <LoadingPage />
    </div>
</template>

<style lang="scss" scoped></style>