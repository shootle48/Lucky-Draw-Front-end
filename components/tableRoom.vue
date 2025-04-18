<template>
    <div>
        <div class="overflow-x-auto">
            <table class="table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Room ID</th>
                        <th>Room Name</th>
                        <th>Tools</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(room, index) in rooms" :key="room.id">
                        <th>{{ index + 1 }}</th>
                        <td>{{ room.id }}</td>
                        <td>{{ room.name }}</td>
                        <td>
                            <NuxtLink :to="`/update/${room.id}`"><button
                                    class="btn btn-sm btn-primary mr-2">Edit</button></NuxtLink>
                            <button @click="deleteRoom(room.id)" class="btn btn-sm btn-error">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { roomType } from '@/types/room'
import axios from 'axios';

const deleteRoom = async (roomId: string) => {
    if (confirm("Are you sure you want to delete this room?")) {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_API}/rooms/${roomId}`)
            if (response.status == 200) {
                alert('Delete room successfully')
                props.fetchRooms()
            }
        } catch (error) {
            console.error("Error deleting room:", error)
        }
    }
}

const props = defineProps<{
    rooms: roomType[]
    isLoading: Boolean
    fetchRooms: Function
}>()
</script>

<style lang="scss" scoped></style>