<script setup lang="ts">
import PrizeModals from '@/components/prize/prizeModal.vue';
import { getToast } from "@/composables/useToastPage";
import type { prizeType } from '~/types/prize';

const route = useRoute();
const router = useRouter()
const { showToast } = getToast();
const playerStore = usePlayerStore();
const prizeStore = usePrizeStore();

const selectedPlayer = ref<File | null>(null);
const roomId = route.params.id as string;
// ตัวแปรสำหรับ ref ไปยัง PrizeModals component
const prizeModalsRef = ref<InstanceType<typeof PrizeModals> | null>(null);

const { isLoading, rooms } = storeToRefs(playerStore);
const roomName = computed(() => rooms.value.name);


const handleSubmitImport = async () => {
    if (!selectedPlayer.value) {
        showToast("กรุณาเลือกไฟล์ก่อน", "alert-warning");
        return;
    }

    // 🔴 เช็คว่ามีของรางวัลหรือยัง
    if (prizeStore.prizes.length === 0) {
        showToast("ยังไม่มีรางวัลในห้องนี้ กรุณาเพิ่มรางวัลก่อนเริ่มจับฉลาก", "alert-warning");
        return;
    }

    try {
        await playerStore.handlePlayerImport(selectedPlayer.value, roomId);
        showToast("นำเข้ารายชื่อเรียบร้อยแล้ว", "alert-success");

        // ✅ ไปหน้าถัดไปได้
        router.push(`../mainPage/${roomId}`);
    } catch (_) {
        showToast("เกิดข้อผิดพลาดระหว่างการนำเข้ารายชื่อ ลองใหม่อีกครั้ง", "alert-error");
    }
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
    <div v-if='isLoading' class="h-full">
        <LoadingPage />
    </div>
    <div>
        <div class="flex flex-col m-6">
            <div class="flex justify-center">
                <h1 class="text-white text-3xl font-bold drop-shadow-lg">{{ roomName }}</h1>
            </div>
            <PrizeField :handleEditPrize="handleEditPrize" />
            <div class="flex flex-col justify-center items-center">
                <fieldset class="fieldset bg-[#ffffff98] rounded-box w-fit shadow-lg border my-6 p-4">
                    <legend class="fieldset-legend text-left text-2xl md:text-3xl text-[#000000]">ผู้เล่น</legend>
                    <div class="form-control w-full text-left">
                        <label class="label">
                            <span class="label-text text-lg mb-2 text-[#000000]">นำเข้ารายชื่อผู้เข้าร่วม (.xls, .xlsx,
                                .csv)</span>
                        </label>
                        <input type="file" @change="handlePlayerChange" accept=".xls,.xlsx,.csv"
                            class="file-input file-input-bordered w-full bg-[#ffffff] file-input-[#ffffff]" />
                    </div>
                    <button @click="handleSubmitImport"
                        class="btn h-fit bg-gradient-to-t mx-auto from-[#ff8f00] to-[#ffd902] p-2 mt-4 border-0 rounded-[2rem] w-fit text-white">
                        <div class="bg-[#ffae02] px-6 py-3 rounded-[2rem] text-lg font-semibold">
                            <p class="drop-shadow-lg">เริ่มจับฉลาก</p>
                        </div>
                    </button>

                </fieldset>
                <PlayerField :players="playerStore.players" v-if="selectedPlayer && playerStore.players.length > 0"
                    class="mt-6" />
            </div>
        </div>
    </div>
    <!-- นำเข้า component PrizeModals -->
    <PrizeModals ref="prizeModalsRef" />
    <!-- Global toast container -->
    <div class="toast toast-top toast-start fixed z-[9999]"></div>


</template>

<style scoped>
#file-upload-button {
    background-color: aqua;
}
</style>