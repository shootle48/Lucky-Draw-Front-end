<script setup lang="ts">
import { useToast } from '@/composables/useToastPage';
import axios from 'axios';
import type { roomTypes } from '@/types/room';
import logo from '@/assets/logo.png';

const Router = useRouter();
const { showToast } = useToast();
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

                showToast('สร้างห้องสำเร็จแล้ว!', 'success');
                await new Promise((resolve) => setTimeout(resolve, 1500));
                await Router.push(`/room/${roomId}`);
            }
        } else {
            showToast('กรุณากรอกชื่อห้อง', 'warning');
        }
    } catch (error) {
        console.error('Error creating room:', error);
        showToast('ไม่สามารถสร้างห้องได้ กรุณาลองใหม่', 'error');
    }
};
</script>


<template>
    <div class="relative bg-cover bg-no-repeat bg-fixed h-full ">
        <div class="absolute inset-0 backdrop-blur-sm"></div>
        <div class="relative z-10 flex flex-col justify-center items-center h-full  px-6 text-white">
            <img :src="logo" alt="Lucky Draw Logo" class="w-90 h-80" />
            <div class="text-center max-w-2xl">
                <h1 class="text-4xl md:text-5xl font-bold drop-shadow-lg">
                    🎁 ระบบสุ่มของรางวัล
                </h1>
                <p class="text-base md:text-lg py-6 font-medium leading-relaxed drop-shadow-sm">
                    บริหารรางวัล รายชื่อ และการสุ่ม ได้อย่างเป็นระบบ<br />
                    รองรับทุกขั้นตอน ใช้งานง่าย เหมาะสำหรับทุกกิจกรรมภายในองค์กร
                </p>

                <!-- ฟอร์มสร้างห้อง -->
                <form @submit.prevent="add_room" class="w-full flex flex-col items-center gap-4">
                    <fieldset
                        class="w-full max-w-md bg-white/10 border border-white/30 p-6 rounded-xl shadow-md backdrop-blur-xl">
                        <legend class="text-lg font-semibold mb-2 text-white">สร้างห้องสุ่มรางวัล</legend>
                        <div class="join w-full">
                            <input type="text" class="input join-item w-full bg-white/80 text-black"
                                placeholder="ชื่อห้องสุ่มรางวัล" v-model="RoomData.name" />
                            <button type="submit" class="btn join-item btn-accent text-white">สร้างห้อง</button>
                        </div>
                    </fieldset>
                </form>

                <!-- ลิงก์ทดสอบ -->
                <div class="mt-6">
                    <NuxtLink to="/room/b299cae3-5d35-4d8b-9ea4-a93aa44abf60">
                        <button class="btn btn-outline text-white border-white hover:bg-white hover:text-black">
                            ห้องจำลอง
                        </button>
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
    <div class="toast toast-top toast-end fixed z-[9999]"></div>
</template>

<style lang="scss" scoped></style>