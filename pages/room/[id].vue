<script setup lang="ts">
import PrizeModals from '@/components/prize/prizeModal.vue';
import { getToast } from "@/composables/useToastPage";
import type { prizeType } from '~/types/prize';
import logo from '@/assets/logo.png';
import QrCodeModal from '@/components/player/QrCodeModal.vue'
import QrcodeVue from 'qrcode.vue';

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
const isMobile = ref(false);

const qrCodeLink = ref('');
const showQrModal = ref(false);

const openQrModal = () => {
    if (!qrCodeLink.value.trim()) {
        showToast("กรุณาใส่ลิงก์ฟอร์มก่อน", "alert-warning");
        return;
    }
    showQrModal.value = true;
}

const checkScreenSize = () => {
    isMobile.value = window.innerWidth <= 768;
};

const handleSubmitImport = async () => {
    if (!selectedPlayer.value) {
        showToast("กรุณาเพิ่มข้อมูลผู้เล่นก่อน", "alert-warning");
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
        await new Promise((resolve) => setTimeout(resolve, 1500));
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
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
});

onUnmounted(() => {
    window.removeEventListener('resize', checkScreenSize);
});
</script>


<style lang="scss" scoped></style>
<template>
    <div v-if='isLoading' class="h-full">
        <LoadingPage />
    </div>
    <div>
        <div class="flex flex-col items-center">
            <div>
                <img :src="logo" alt="Lucky Draw Logo" class="w-70 h-50 md:w-100 md:h-70" />
            </div>
            <div
                class="bg-[#ffffff69] rounded-box  max-w-md shadow-lg py-4 px-6 sm:px-10 mb-4 text-center mx-4 md:mx-auto">
                <h1 class="text-black text-xl md:text-2xl font-bold drop-shadow-lg">{{ roomName }}</h1>
            </div>

            <PrizeField :handleEditPrize="handleEditPrize" />
            <div class="flex flex-col justify-center items-center">
                <fieldset class="fieldset bg-[#ffffff98] rounded-box min-w-200 shadow-lg border my-6 p-4">
                    <legend class="fieldset-legend text-left text-2xl md:text-3xl text-[#000000]">ผู้เล่น</legend>
                    <div class="form-control w-full">

                        <div class="flex justify-between items-center mb-4 ">
                            <div class="label-text text-lg mb-2 text-[#000000]">
                                นำเข้ารายชื่อผู้เข้าร่วม (.xls, .xlsx, .csv)
                            </div>
                            <button @click="showQrModal = true"
                                class="btn h-fit bg-gradient-to-t from-[#ff3c9a] to-[#ff91c6] p-1 border-0 rounded-[2rem] w-fit text-white ">
                                <div class="bg-[#f850a1] px-2 py-0.5 rounded-[2rem] text-lg font-semibold">
                                    <p class="drop-shadow-lg text-xs">สร้าง QR Code</p>
                                </div>
                            </button>
                        </div>

                        <input type="file" @change="handlePlayerChange" accept=".xls,.xlsx,.csv"
                            class="file-input file-input-bordered w-full bg-[#ffffff] file-input-[#ffffff] text-black" />

                        <!-- ปุ่มแบบ fixed สำหรับ mobile -->
                        <div v-if="isMobile"
                            class="fixed top-[92%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999]">
                            <button @click="handleSubmitImport"
                                class="btn h-fit bg-gradient-to-t from-[#ff8f00] to-[#ffd902] p-2 mt-4 border-0 rounded-[2rem] w-fit text-white ">
                                <div class="bg-[#ffae02] px-6 py-3 rounded-[2rem] text-lg font-semibold">
                                    <p class="drop-shadow-lg">เริ่มจับฉลาก</p>
                                </div>
                            </button>
                        </div>

                        <!-- ปุ่มปกติสำหรับ desktop -->
                        <div v-else class="mx-auto w-fit">
                            <button @click="handleSubmitImport"
                                class="btn h-fit bg-gradient-to-t from-[#ff8f00] to-[#ffd902] p-2 mt-4 border-0 rounded-[2rem] text-white shadow-black shadow-sm">
                                <div class="bg-[#ffae02] px-6 py-3 rounded-[2rem] text-lg font-semibold">
                                    <p class="drop-shadow-lg">เริ่มจับฉลาก</p>
                                </div>
                            </button>
                        </div>
                    </div>

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

    <QrCodeModal v-if="showQrModal" :link="qrCodeLink" @update:link="(val: string) => qrCodeLink = val"
        @close="showQrModal = false" />
</template>

<style scoped>
#file-upload-button {
    background-color: aqua;
}
</style>