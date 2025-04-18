<template>
    <div class="flex flex-col mx-autos items-center h-screen justify-center relative">
        <LoadingPage v-if="isLoading" />
        <div v-else class="hero bg-base-200 min-h-screen">
            <div class="hero-content text-center">
                <div class="min-w-lg">
                    <h1 class="text-5xl font-semibold">🎁 ระบบสุ่มของรางวัล</h1>
                    <p class="text-lg py-6 font-medium ">
                        บริหารรางวัล รายชื่อ และการสุ่ม ได้อย่างเป็นระบบ<br>
                        รองรับทุกขั้นตอน ใช้งานง่าย เหมาะสำหรับทุกกิจกรรมภายในองค์กร
                    </p>
                    <NuxtLink to="/create"><button class="btn btn-primary font-medium">สร้างห้องเลย!</button></NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import type { roomTypes } from "@/types/room";

const rooms = ref<roomTypes[]>([]);
const isLoading = ref<boolean>(false);

const fetchRooms = async () => {
    isLoading.value = false;
    try {
        isLoading.value = true;
        const response = await axios.get(`${import.meta.env.VITE_API}/rooms/list`);
        rooms.value = response.data.data;
        isLoading.value = false;
        if (response.status == 200) {
            console.log("Rooms fetched successfully:", rooms.value);
        } else {
            console.error("Error fetching rooms:", response.statusText);
        }
    } catch (error) {
        console.error("Error fetching rooms:", error);
    }
};

onMounted(() => {
    fetchRooms();
});

</script>

<style lang="scss" scoped></style>