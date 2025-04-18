<template>
    <div class="mx-auto flex flex-col justify-center items-center h-screen">
        <form @submit.prevent="add_room">
            <fieldset class="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box">
                <legend class="fieldset-legend">Create Room Page</legend>
                <div class="join">
                    <input type="text" class="input join-item" placeholder="Room name" v-model="RoomData.name" />
                    <button class="btn join-item">Create</button>
                </div>
            </fieldset>
        </form>
    </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import type { roomTypes } from '@/types/room';

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
                alert('Room created successfully');
                const routeData = await Router.push(`/room/${roomId}`);
                console.log(routeData);
            }
        } else {
            alert('Please enter room name')
        }
    }
    catch (error) {
        console.error("Error creating room:", error);
    }
}

</script>

<style lang="scss" scoped></style>