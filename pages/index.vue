<template>
    <div class="min-h-screen bg-base-200 flex flex-col justify-center items-center px-4">
        <div class="text-center max-w-2xl">
            <h1 class="text-4xl md:text-5xl font-semibold">
                🎁 ระบบสุ่มของรางวัล
            </h1>
            <p class="text-base md:text-lg py-6 font-medium leading-relaxed">
                บริหารรางวัล รายชื่อ และการสุ่ม ได้อย่างเป็นระบบ<br />
                รองรับทุกขั้นตอน ใช้งานง่าย เหมาะสำหรับทุกกิจกรรมภายในองค์กร
            </p>

            <!-- ✅ ฟอร์มสร้างห้อง -->
            <form @submit.prevent="add_room" class="w-full flex flex-col items-center gap-4">
                <fieldset class="w-full max-w-md bg-base-100 border border-base-300 p-6 rounded-box shadow-md">
                    <legend class="text-lg font-medium mb-2">สร้างห้องสุ่มรางวัล</legend>
                    <div class="join w-full">
                        <input type="text" class="input join-item w-full" placeholder="ชื่อห้องสุ่มรางวัล"
                            v-model="RoomData.name" />
                        <button type="submit" class="btn join-item btn-primary">
                            สร้างห้อง
                        </button>
                    </div>
                </fieldset>
            </form>

            <!-- ✅ ลิงก์ทดสอบ -->
            <div class="mt-6">
                <NuxtLink to="/room/7c2ee471-b9ba-4210-a8f4-57ecb6288818">
                    <button class="btn btn-outline btn-secondary">
                        ห้องจำลอง
                    </button>
                </NuxtLink>
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