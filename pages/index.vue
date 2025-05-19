<script setup lang="ts">
import { getToast } from "@/composables/useToastPage";
import axios from 'axios';
import type { roomTypes } from '@/types/room';
import logo from '@/assets/Full_Logo.png';
import qrForm from '@/assets/image-template-form/Lucky-Draw-QrCode-Form.png'


const { showToast } = getToast();
const Router = useRouter();
const RoomData = ref<roomTypes>({
    id: '',
    name: '',
});

const add_room = async () => {
    try {
        if (RoomData.value.name !== '') {
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
        console.error('Error creating room:', error);
        showToast('ไม่สามารถสร้างห้องได้ กรุณาลองใหม่', 'alert-error');
    }
};
</script>
<template>
    <div class="relative bg-cover bg-no-repeat bg-fixed h-full ">
        <div class="absolute inset-0 backdrop-blur-sm"></div>
        <div class="relative z-10 flex flex-col justify-center items-center h-full  px-6 text-white">
            <img :src="logo" alt="Lucky Draw Logo" class=" md:w-130 md:h-100 mt-10" />
            <div class="text-center max-w-2xl ">

                <!-- ฟอร์มสร้างห้อง -->
                <form @submit.prevent="add_room" class="w-full flex flex-col items-center gap-4  ">
                    <div
                        class="w-fit max-w-md bg-white/20 border border-white/50 p-6 rounded-xl shadow-md backdrop-blur-3xl">
                        <legend class="text-2xl text-black/70 font-semibold drop-shadow-lg pb-4">สร้างห้องสุ่มรางวัล
                        </legend>
                        <div class="join ">
                            <input type="text" class="input w-fit bg-white/80 text-black mr-4 rounded-lg"
                                placeholder="ชื่อห้องสุ่มรางวัล" v-model="RoomData.name" />
                            <!-- <button type="submit" class="btn  btn-accent text-[#ffffff] drop-shadow-lg rounded-lg">
                                <p class="text-lg font-medium ">สร้างห้อง</p>
                            </button> -->
                            <button type="submit"
                                class="btn h-fit bg-gradient-to-t from-[#ff8f00] to-[#ffd902] p-2 border-0 rounded-[2rem] text-white shadow-black shadow-sm">
                                <div class="bg-[#ffae02] px-2.5 py-0.25 rounded-[2rem] text-lg font-semibold">
                                    <p class="drop-shadow-lg">สร้างห้อง</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </form>

                <!-- ลิงก์ทดสอบ -->
                <div class="mt-4">
                    <NuxtLink to="/mainPage/86053268-6699-4f67-ad1d-a96bf5b02b69">
                        <button class="btn btn-outline text-ffffff border-ffffff hover:bg-ffffff hover:text-ffffff">
                            ห้องจำลอง
                        </button>
                    </NuxtLink>
                </div>
                <p
                    class="mt-6 text-md md:text-2xl py-6 border p-2 rounded-2xl font-medium leading-relaxed drop-shadow-lg">
                    บริหารรางวัล รายชื่อ และการสุ่ม ได้อย่างเป็นระบบ<br />
                    รองรับทุกขั้นตอน ใช้งานง่าย เหมาะสำหรับทุกกิจกรรมภายในองค์กร
                </p>
            </div>
        </div>
    </div>
    <div class="toast toast-top toast-start fixed z-[9999]"></div>

    <!-- QR Code form -->
    <NuxtLink to="https://docs.google.com/forms/d/1Ewo0i9c58WnQJxd0_oBUPE_OWte88bmu44oz_5o73dQ/copy" target="_blank">
        <div class="fixed right-4 bottom-4 z-50 border-2">
        <img :src="qrForm" alt="แบบฟอร์มลงทะเบียน"
            class=" w-40 h-auto opacity-90 hover:opacity-100 transition-opacity duration-300 " />
        <div class="text-sm text-center text-blue-950 bg-white/50">
            แบบฟอร์มลงทะเบียน
        </div>
    </div>
    </NuxtLink>
</template>

<style lang="scss" scoped></style>