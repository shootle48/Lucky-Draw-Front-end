<script setup lang="ts">
import Swal from 'sweetalert2';
import { getToast } from "@/composables/useToastPage";
import logo from '@/assets/logo.png';

const { showToast } = getToast();
const router = useRouter();
const route = useRoute();
const playerStore = usePlayerStore();
const prizeStore = usePrizeStore();
const roomId = route.params.id as string;

const { isLoading, rooms, players } = storeToRefs(playerStore);
const { prizes } = storeToRefs(prizeStore);

const roomName = computed(() => rooms.value.name);

// ตรวจสอบว่ามีรางวัลเหลืออยู่หรือไม่
const hasAvailablePrizes = computed(() => {
    return prizes.value.some(prize => prize.quantity > 0);
});

onMounted(async () => {
    await playerStore.fetchRoom(roomId);
    await playerStore.fetchPlayers(roomId);
    await prizeStore.fetchPrizes(roomId);
});

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const handleAddPlayer = async (newPlayer: playerType) => {
    try {
        await playerStore.addPlayer(newPlayer, roomId);
        await playerStore.fetchPlayers(roomId);
        showToast("เพิ่มผู้เล่นสำเร็จ", "alert-success");
    } catch (error: any) {
        const errorMsg = error?.message || 'เกิดข้อผิดพลาดในการเพิ่มผู้เล่น';
        showToast(errorMsg, "alert-error");
    }
};

const handleEditPlayer = async (updatedPlayer: playerType) => {
    try {
        await playerStore.editPlayer(updatedPlayer);
        await playerStore.fetchPlayers(roomId);
        showToast("แก้ไขผู้เล่นสำเร็จ", "alert-success");
    } catch (error: any) {
        const errorMsg = error?.response?.data?.error || error?.message || 'เกิดข้อผิดพลาดในการแก้ไขผู้เล่น';
        showToast(errorMsg, "alert-error");
    }
};

// ✅ ปรับปรุง deleteRoom ให้มี sweet alert + loading + toast
const deleteRoom = async () => {
    const result = await Swal.fire({
        title: 'คุณแน่ใจหรือไม่?',
        text: "คุณต้องการลบห้องนี้หรือไม่ การลบครั้งนี้จะไม่สามารถย้อนกลับได้อีก!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ใช่, ลบเลย!',
        cancelButtonText: 'ยกเลิก'
    });

    if (result.isConfirmed) {
        isLoading.value = true;
        try {
            await playerStore.deleteRoom(roomId);
            router.push('/');
        } catch (error: any) {
            const errorMsg = error?.response?.data?.error || error?.message || 'เกิดข้อผิดพลาดในการลบห้อง';
            showToast(errorMsg, "alert-error");
            await delay(1500);
        } finally {
            isLoading.value = false;
        }
    }
};
</script>


<template>
    <div>
        <!-- แสดงเมื่อไม่มีรางวัลที่สามารถจับได้ -->
        <div v-if="!hasAvailablePrizes && prizes.length > 0"
            class="min-h-screen flex flex-col items-center justify-center text-center p-6 ">
            <!-- ไอคอนขนาดใหญ่ -->
            <div class="mb-6">
                <div
                    class="w-32 h-32 mx-auto bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                </div>
            </div>

            <!-- หัวข้อที่โดดเด่น -->
            <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-2xl border-4 border-red-300">
                <h1
                    class="text-4xl font-black text-transparent bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text mb-3">
                    ไม่มีรางวัลที่สามารถจับได้แล้ว
                </h1>
                <div class="w-full h-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mx-auto mb-4"></div>
                <p class="text-xl font-semibold text-gray-800 leading-relaxed">
                    รางวัลทั้งหมดถูกจับหมดแล้ว<br>
                    กรุณาตรวจสอบผลการจับรางวัล
                </p>
            </div>

            <!-- ปุ่มที่โดดเด่น -->
            <button @click="$router.push(`/dashboard/${roomId}`);"
                class="relative overflow-hidden px-10 py-4 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 
                       text-white text-xl font-bold rounded-2xl shadow-2xl 
                       border-4 border-white/50
                       hover:scale-110 hover:shadow-3xl 
                       transform transition-all duration-300 ease-out
                       before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent 
                       before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700 cursor-pointer">
                <span class="relative z-10 flex items-center gap-3">
                    ไปยังหน้าสรุปของรางวัล
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </span>
            </button>
            <button @click="deleteRoom"
                class="relative overflow-hidden px-5 py-4 bg-gradient-to-r from-rose-500 via-red-500 to-pink-500 
                       text-white text-md font-bold rounded-2xl shadow-2xl mt-4
                       border-4 border-white/50
                       hover:scale-110 hover:shadow-3xl 
                       transform transition-all duration-300 ease-out
                       before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent 
                       before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700 cursor-pointer">
                <span class="relative z-10 flex items-center gap-3">
                    ลบห้องสุ่มรางวัล ?
                </span>
            </button>
        </div>

        <!-- แสดงเมื่อมีรางวัลที่สามารถจับได้ -->
        <div v-else class="flex flex-col">
            <div class="mx-auto">
                <img :src="logo" alt="Lucky Draw Logo" class="w-70 h-50 md:w-100 md:h-70" />
            </div>
            <div
                class="bg-[#ffffff69] rounded-box  max-w-md shadow-lg py-4 px-6 sm:px-10 mb-4 text-center mx-4 md:mx-auto">
                <h1 class="text-black text-xl md:text-2xl font-bold drop-shadow-lg">{{ roomName }}</h1>
            </div>

            <div class="flex flex-col justify-center items-center">
                <PrizeField />
                <PlayerField :players="players" @add="handleAddPlayer" @edit="handleEditPlayer"
                    v-if="playerStore.players.length > 0" class="mt-6" />
            </div>
        </div>
    </div>

    <div v-if='isLoading' class="h-full">
        <LoadingPage />
    </div>
    <!-- นำเข้า component PrizeModals -->
    <PrizeModal ref="prizeModalsRef" />
    <div class="toast toast-top toast-start fixed z-[9999]" />
</template>

<style lang="scss" scoped></style>