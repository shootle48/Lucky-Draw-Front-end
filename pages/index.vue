<template>
    <div class="flex flex-col mx-autos items-center justify-center rela">
        <div class="hero bg-base-200 min-h-screen">
            <div class="hero-content text-center">
                <div>
                    <div class="min-w-lg">
                        <h1 class="text-5xl font-semibold">🎁 ระบบสุ่มของรางวัล</h1>
                        <p class="text-lg py-6 font-medium ">
                            บริหารรางวัล รายชื่อ และการสุ่ม ได้อย่างเป็นระบบ<br>
                            รองรับทุกขั้นตอน ใช้งานง่าย เหมาะสำหรับทุกกิจกรรมภายในองค์กร
                        </p>
                    </div>
                    <div class="flex flex-col items-center">
                        <form @submit.prevent="add_room">
                            <fieldset class="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box">
                                <legend class="fieldset-legend text-lg">สร้างห้องสุ่มรางวัล</legend>
                                <div class="join">
                                    <input type="text" class="input join-item" placeholder="ชื่อห้องสุ่มรางวัล"
                                        v-model="RoomData.name" />
                                    <button class="btn join-item">สร้างห้อง</button>
                                </div>
                            </fieldset>
                        </form>
                        <NuxtLink to="/room/7c2ee471-b9ba-4210-a8f4-57ecb6288818"><button
                                class="btn btn-primary font-medium">ห้องจำลอง</button></NuxtLink>
                    </div>
                </div>
            </div>
        </div>
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