<script setup lang="ts">
import PrizeModals from '@/components/prize/prizeModal.vue';
import type { prizeType } from '~/types/prize';

const route = useRoute();
const playerStore = usePlayerStore();
const selectedPlayer = ref<File | null>(null);
const roomId = route.params.id as string;
// ตัวแปรสำหรับ ref ไปยัง PrizeModals component
const prizeModalsRef = ref<InstanceType<typeof PrizeModals> | null>(null);

const { isLoading, rooms } = storeToRefs(playerStore);
const roomName = computed(() => rooms.value.name);

const handleSubmitImport = async () => {
    console.log(selectedPlayer.value)
    if (!selectedPlayer.value) {
        alert('กรุณาเลือกไฟล์ก่อนเริ่มสุ่มรางวัล');
        return;
    }
    await playerStore.handlePlayerImport(selectedPlayer.value, roomId);
};

const handlePlayerChange = async (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0] ?? null;

    // ✅ เซ็ตค่า
    selectedPlayer.value = file;

    // ✅ ถ้าต้อง export ด้วยก็ทำต่อได้
    if (file) {
        await playerStore.handlePlayersExport(e);
    }
}


// ฟังก์ชั่นเมื่อคลิกแก้ไขรางวัล
const handleEditPrize = (prize: prizeType) => {
    if (prizeModalsRef.value) {
        prizeModalsRef.value.openEditModal(prize);
    }
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
            <PrizeField :handleEditPrize="handleEditPrize" />
            <div class="flex flex-col justify-center items-center">
                <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-fit shadow-lg border my-6 p-4">
                    <legend class="fieldset-legend text-left text-3xl">ผู้เล่น</legend>
                    <div class="form-control w-full text-left">
                        <label class="label">
                            <span class="label-text text-lg mb-2">นำเข้ารายชื่อผู้เข้าร่วม (.xls, .xlsx,
                                .csv)</span>
                        </label>
                        <input type="file" @change="handlePlayerChange" accept=".xls,.xlsx,.csv"
                            class="file-input file-input-bordered w-full" />
                    </div>
                    <NuxtLink :to="`../mainPage/${roomId}`" class="w-fit mx-auto mt-4">
                        <button @click="handleSubmitImport"
                            class="btn btn-secondary">เริ่มสุ่มรางวัล!</button>
                    </NuxtLink>
                </fieldset>
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