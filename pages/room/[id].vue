<template>
    <div class="h-screen">
        <div class="flex m-6 min-h-6xl">
            <div class="flex1/2 bg-amber-500 w-full p-4 text-center">
                <button class="btn btn-primary">เพิ่มผู้เล่น</button>
            </div>
            <div class="flex1/2 bg-rose-500 w-full p-4 text-center">
                <button class="btn btn-secondary">เพิ่มรางวัล</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import type { roomTypes } from "@/types/room";

const Route = useRoute();
const room = ref<roomTypes>({
    id: '',
    name: '',
});
const fetchRoom = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API}/rooms/${Route.params.id}`);
        room.value = response.data.data;
        console.log("Room fetched successfully:", room.value);
    } catch (error) {
        console.error("Error fetching room:", error);
    }
}

onMounted(() => {
    fetchRoom();
});


</script>

<style lang="scss" scoped></style>