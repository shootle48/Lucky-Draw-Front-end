<script setup lang="ts">
import { getToast } from "@/composables/useToastPage";
import axios from 'axios';
import type { roomTypes } from '@/types/room';
import logo from '@/assets/Full_Logo.png';
import QrcodeVue from 'qrcode.vue';
import { useMediaQuery } from '@vueuse/core'

definePageMeta({
    layout: false
});
const showQR = ref(false)
const isMdUp = useMediaQuery('(min-width: 768px)')
const QRcodeTamplateForm = import.meta.env.VITE_QR_CODE_TEMPLATE_FORM_URL;

const { showToast } = getToast();
const playerStore = usePlayerStore();
const Router = useRouter();


const RoomData = ref<roomTypes>({
    id: '',
    name: '',
    password: ''
});
const usePassword = ref(false)
const Rooms = toRef(playerStore, 'Rooms');
const currentRoomPassword = ref<string>('');
const isModalOpen = ref<boolean>(false);
const selectedRoom = ref<roomTypes | null>(null);
const pagination = computed(() => playerStore.pagination);
const { isLoading } = storeToRefs(playerStore)
const isPasswordVisible = ref(false);

const add_room = async () => {
    try {
        if (RoomData.value.name.trim() !== '') {
            const response = await axios.post(`${import.meta.env.VITE_API}/rooms/create`, {
                ...RoomData.value,
            });

            if (response.status === 200) {
                const roomId = response.data.data.id;
                showToast('สร้างห้องสำเร็จแล้ว!', 'alert-success');
                await new Promise((resolve) => setTimeout(resolve, 1500));
                await Router.push(`/room/${roomId}`);
            }
        } else {
            showToast('กรุณากรอกชื่อห้อง', 'alert-warning');
        }
    } catch (error) {
        showToast('ไม่สามารถสร้างห้องได้ กรุณาลองใหม่', 'alert-error');
    }
};

const openPasswordModal = (room: roomTypes) => {
    if (!room.has_password) {
        Router.push(`mainPage/${room.id}`)
        return
    } else {
        selectedRoom.value = room;
        currentRoomPassword.value = '';
        isModalOpen.value = true;
    }
};

const closeModal = () => {
    isModalOpen.value = false;
    selectedRoom.value = null;
    currentRoomPassword.value = '';
};

const submitPassword = async () => {
    if (!selectedRoom.value) return;

    try {
        const res = await axios.post(`${import.meta.env.VITE_API}/rooms/login`, {
            id: selectedRoom.value.id,
            password: currentRoomPassword.value.trim()
        });

        if (res.status === 200) {
            const roomId = selectedRoom.value.id
            closeModal();
            Router.push(`/mainPage/${roomId}`);
        } else {
            showToast("รหัสผ่านไม่ถูกต้อง", "alert-warning");
        }
    } catch (error) {
        showToast("ไม่สามารถเข้าห้องได้ กรุณาลองใหม่", "alert-error");
    }
};


const changePage = async (direction: 'next' | 'prev') => {
    const { page, size, total } = pagination.value;
    const newPage = direction === 'next' ? page + 1 : page - 1;

    if (newPage < 1 || newPage > Math.ceil(total / size)) return;

    pagination.value.page = newPage;
    await playerStore.fetchRooms(newPage, size);
};


onMounted(async () => {
    await playerStore.fetchRooms(pagination.value.page, pagination.value.size);
    Rooms.value = playerStore.Rooms;
    pagination.value.total = playerStore.pagination.total;
});
</script>


<template>
    <div class="relative bg-cover bg-no-repeat bg-fixed h-full ">
        <div class="absolute inset-0 backdrop-blur-sm"></div>
        <div class="relative z-10 flex flex-col justify-center items-center h-full mb-10 px-6 text-white">
            <img :src="logo" alt="Lucky Draw Logo" class=" md:w-130 md:h-100 mt-10" />
            <div class="text-center max-w-2xl">
                <!-- ฟอร์มสร้างห้อง -->
                <form @submit.prevent="add_room" class="w-full flex flex-col gap-4">
                    <div
                        class="w-fit bg-white/20 border border-white/50 min-w-100 p-6 rounded-xl shadow-md backdrop-blur-3xl">
                        <legend class="text-2xl text-black/70 font-semibold drop-shadow-lg pb-4">
                            สร้างห้องสุ่มรางวัล
                        </legend>

                        <div class="join flex flex-col gap-4">
                            <!-- ชื่อห้อง -->
                            <input type="text" class="input bg-white/80 text-black mr-4 rounded-lg w-full pr-12"
                                placeholder="ชื่อห้องสุ่มรางวัล" v-model="RoomData.name" />

                            <!-- ✅ Toggle รหัสผ่าน -->
                            <div class="flex ">
                                <label class="text-black/70">สร้างรหัสห้อง</label>
                                <label class="inline-flex items-center ml-2 space-x-2 cursor-pointer">
                                    <input type="checkbox" v-model="usePassword" class="peer hidden" />
                                    <div
                                        class="w-5 h-5 rounded border border-gray-400 bg-red-400 peer-checked:bg-green-400 transition-colors duration-300">
                                    </div>
                                    <span class="text-sm" :class="usePassword ? 'text-green-600' : 'text-red-600'">
                                        {{ usePassword ? 'สร้าง' : 'ไม่สร้าง' }}
                                    </span>
                                </label>
                            </div>

                            <!-- ✅ ช่องรหัสผ่าน (แสดงเมื่อเปิด toggle) -->
                            <div v-if="usePassword" class="relative w-full">
                                <input :type="isPasswordVisible ? 'text' : 'password'"
                                    class="input bg-white/80 text-black mr-4 rounded-lg w-full pr-12"
                                    placeholder="รหัสผ่านห้อง" v-model="RoomData.password" />
                                <button type="button"
                                    class="btn btn-square absolute right-0 top-0 z-10 bg-transparent border-0"
                                    @click="isPasswordVisible = !isPasswordVisible" tabindex="0">
                                    <svg v-if="!isPasswordVisible" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
                                        fill="none" viewBox="0 0 24 24" stroke="#000000" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                        viewBox="0 0 24 24" stroke="#000000" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.964 9.964 0 012.293-3.95M6.428 6.428A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.953 9.953 0 01-4.227 5.147M15 12a3 3 0 01-4.243-4.243M3 3l18 18" />
                                    </svg>
                                </button>
                            </div>

                            <!-- ปุ่มสร้าง -->
                            <button type="submit"
                                class="btn h-fit w-fit mx-auto bg-gradient-to-t from-[#ff8f00] to-[#ffd902] p-2 border-0 rounded-[2rem] text-white shadow-black shadow-sm">
                                <div class="bg-[#ffae02] px-2.5 py-1 rounded-[2rem] text-lg font-semibold w-full">
                                    <p class="drop-shadow-lg">สร้างห้อง</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <!-- รายการห้อง -->
            <div>
                <h1 class="mt-8 mb-4 text-xl font-semibold drop-shadow-lg lg:min-w-250 text-black">รายการห้องทั้งหมด
                </h1>
                <div v-if="Rooms.length === 0" class="badge badge-outline badge-primary shadow-md w-full h-40 flex items-center justify-center
                    gap-4 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="black" viewBox="0 0 24 24"
                        class="stroke-current shrink-0 w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span class=" text-xl font-bold drop-shadow-2xl text-black">ยังไม่มีห้องที่สร้างไว้</span>
                </div>
                <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div v-for="room in Rooms" :key="room.id" class="relative">
                        <div
                            class="bg-white/30 backdrop-blur-md border border-white/40 rounded-xl p-6 shadow-md text-black">

                            <!-- 🔒 ไอคอนล็อก -->
                            <svg v-if="room.has_password" xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"
                                class="size-6 text-black absolute top-2 right-2">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                            </svg>

                            <h3 class="text-xl font-bold mb-2">{{ room.name }}</h3>

                            <button @click="openPasswordModal(room)"
                                class="btn bg-gradient-to-r from-green-500 to-lime-400 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:scale-105 transition-transform duration-200 w-full">
                                เข้าห้อง
                            </button>
                        </div>
                    </div>

                </div>

                <!-- Pagination Controls -->
                <div class="flex justify-center items-center gap-4 mt-6">
                    <button @click="changePage('prev')" :disabled="pagination.page === 1"
                        class="btn btn-outline border-white text-white disabled:opacity-50">
                        ⬅️ ย้อนกลับ
                    </button>

                    <span class="text-white font-medium">หน้าที่ {{ pagination.page }}</span>

                    <button @click="changePage('next')"
                        :disabled="pagination.page * pagination.size >= pagination.total"
                        class="btn btn-outline border-white text-white disabled:opacity-50">
                        ถัดไป ➡️
                    </button>
                </div>
            </div>

        </div>
    </div>
    <div class="toast toast-top toast-start fixed z-[9999]"></div>

    <!-- Password Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center z-50">
        <div class="absolute inset-0 bg-black/80 bg-opacity-50 " @click="closeModal"></div>
        <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4 z-10 relative">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">เข้าห้อง {{ selectedRoom?.name }}</h2>
            <form @submit.prevent="submitPassword" class="space-y-4">
                <div>
                    <label for="password" class="block text-gray-700 mb-2">รหัสผ่าน</label>
                    <div class="input-group relative">
                        <input :type="isPasswordVisible ? 'text' : 'password'" id="password"
                            v-model="currentRoomPassword"
                            class="input input-bordered w-full bg-gray-100 focus:border-lime-500 text-black pr-12"
                            placeholder="กรอกรหัสผ่านเพื่อเข้าห้อง" />
                        <button type="button" class="btn btn-square absolute right-0 top-0 z-10 bg-[#00000000] border-0"
                            @click="isPasswordVisible = !isPasswordVisible" tabindex="0">
                            <svg v-if="!isPasswordVisible" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
                                fill="none" viewBox="0 0 24 24" stroke="#000000" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                viewBox="0 0 24 24" stroke="#000000" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.964 9.964 0 012.293-3.95M6.428 6.428A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.953 9.953 0 01-4.227 5.147M15 12a3 3 0 01-4.243-4.243M3 3l18 18" />
                            </svg>
                        </button>
                    </div>

                </div>
                <div class="flex justify-end space-x-2">
                    <button type="button" @click="closeModal"
                        class="btn btn-outline border-gray-400 text-gray-700 hover:bg-gray-100">
                        ยกเลิก
                    </button>
                    <button type="submit" class="btn bg-gradient-to-r from-green-500 to-lime-400 text-white border-0">
                        เข้าห้อง
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- ปุ่ม toggle สำหรับเปิด/ปิด QR (แสดงเฉพาะหน้าจอเล็ก) -->
    <button @click="showQR = !showQR"
        class="fixed right-4 bottom-5 z-20 text-white px-2.5 py-2 rounded-full shadow-lg md:hidden text-xs"
        :class="showQR ? 'bg-gray-400' : 'bg-rose-600'">
        {{ showQR ? 'Close' : 'Open Form' }}
    </button>

    <!-- QR Code Display -->
    <NuxtLink v-if="showQR || isMdUp" :to="QRcodeTamplateForm" target="_blank">
        <div
            class="fixed right-4 bottom-4 border z-10 border-gray-300 shadow-lg rounded-2xl bg-white/90 backdrop-blur-md p-2.5 flex flex-col items-center transition-transform hover:scale-105 bottom-15 md:bottom-4">
            <div class="rounded-xl overflow-hidden border-4 border-white shadow-inner">
                <QrcodeVue :value="QRcodeTamplateForm" :size="155" class="max-w-20 max-h-20 md:max-w-full md:max-h-full"
                    :level="'M'" />
            </div>
            <div class="mt-1 text-sm font-medium text-blue-950 text-center">
                ตัวอย่างฟอร์มลงทะเบียน
            </div>
        </div>
    </NuxtLink>

    <LoadingPage v-if="isLoading" />
</template>

<style lang="scss" scoped></style>