<script setup lang="ts">
import { getToast } from "@/composables/useToastPage";
import axios from 'axios';
import type { roomTypes } from '@/types/room';
import logo from '@/assets/fullLogo.png';

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
            <img :src="logo" alt="Lucky Draw Logo" class=" md:w-170 md:h-120" />
            <div class="text-center max-w-2xl">

                <!-- ฟอร์มสร้างห้อง -->
                <form @submit.prevent="add_room" class="w-full flex flex-col items-center gap-4">
                    <fieldset
                        class="w-fit max-w-md bg-white/20 border border-white/50 p-6 rounded-xl shadow-md backdrop-blur-3xl">
                        <legend class="text-2xl font-semibold drop-shadow-sm">สร้างห้องสุ่มรางวัล</legend>
                        <div class="join ">
                            <input type="text" class="input w-fit bg-white/80 text-black mr-4 rounded-lg"
                                placeholder="ชื่อห้องสุ่มรางวัล" v-model="RoomData.name" />
                            <button type="submit" class="btn  btn-accent text-[#EEEEFF] drop-shadow-lg rounded-lg">
                                <p class="text-lg font-medium ">สร้างห้อง</p>
                            </button>
                        </div>
                    </fieldset>
                </form>

                <!-- ลิงก์ทดสอบ -->
                <div class="mt-4">
                    <NuxtLink to="/mainPage/b299cae3-5d35-4d8b-9ea4-a93aa44abf60">
                        <button class="btn btn-outline text-white border-white hover:bg-white hover:text-black">
                            ห้องจำลอง
                        </button>
                    </NuxtLink>
                </div>
                <p class="mt-6 text-md md:text-2xl py-6 border p-2 rounded-2xl font-medium leading-relaxed drop-shadow-lg">
                    บริหารรางวัล รายชื่อ และการสุ่ม ได้อย่างเป็นระบบ<br />
                    รองรับทุกขั้นตอน ใช้งานง่าย เหมาะสำหรับทุกกิจกรรมภายในองค์กร
                </p>
            </div>
        </div>
    </div>
    <div class="toast toast-top toast-start fixed z-[9999]"></div>
</template>

<style lang="scss" scoped></style>