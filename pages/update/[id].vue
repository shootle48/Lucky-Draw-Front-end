<template>
    <div class="mx-auto flex flex-col justify-center items-center h-screen">
        <form @submit.prevent="updateRoom">
            <fieldset class="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box">
                <legend class="fieldset-legend">Update Room Page</legend>
                <div class="join">
                    <input type="text" class="input join-item" placeholder="Room name" v-model="room.name" />
                    <button class="btn join-item">Create</button>
                </div>
            </fieldset>
        </form>
    </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import type { roomTypes } from '~/types/room'

const room = ref<roomTypes>({
    id: '',
    name: ''
})
const route = useRoute()
const showRoom = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API}/rooms/${route.params.id}`)
        if (response.status == 200) {
            room.value = response.data.data
        } else {
            console.error("Error fetching room:", response.statusText)
        }
    }
    catch (error) {
        console.error("Error fetching room:", error)
    }
}

const updateRoom = async () => {
    if (room.value.name !== '') {
        const response = await axios.patch(`${import.meta.env.VITE_API}/rooms/${route.params.id}`, {
            ...room.value,
        })
        if (response.status == 200) {
            alert('Update room successfully')
            navigateTo('/')
        }
    } else {
        alert('Please enter room name')
    }
}
onMounted(() => showRoom())



</script>

<style lang="scss" scoped></style>