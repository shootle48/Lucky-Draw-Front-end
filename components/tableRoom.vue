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
                            <button class="btn btn-sm btn-primary mr-2">Edit</button>
                            <button class="btn btn-sm btn-error">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { roomType } from '@/types/room'

const props = defineProps<{
    rooms: roomType[]
    isLoading: Boolean
    fetchRooms: Function
}>()
</script>

<style lang="scss" scoped></style>