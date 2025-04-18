<template>
    <div class="flex flex-col items-center h-screen mt-20">
        <h1 class="text-2xl font-bold">
            หน้าแสดงห้องทั้งหมด
        </h1>
        <NuxtLink to="/create"><button class="btn btn-primary">สร้างห้อง</button></NuxtLink>
        <div v-if="isLoading" class="flex justify-center py-4">
            <span class="loading loading-dots loading-xl"></span>
        </div>
        <div v-else>
            <tableRoom :rooms="rooms" :fetchRooms="fetchRooms" :isLoading="isLoading" />
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