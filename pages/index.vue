<template>
    <div class="flex flex-col mx-autos items-center h-screen justify-center relative">
        <div class="hero bg-base-200 min-h-screen">
            <div class="hero-content text-center">
                <div class="min-w-lg">
                    <h1 class="text-5xl font-semibold">🎁 ระบบสุ่มของรางวัล</h1>
                    <p class="text-lg py-6 font-medium ">
                        บริหารรางวัล รายชื่อ และการสุ่ม ได้อย่างเป็นระบบ<br>
                        รองรับทุกขั้นตอน ใช้งานง่าย เหมาะสำหรับทุกกิจกรรมภายในองค์กร
                    </p>
                    <NuxtLink to="/create"><button class="btn btn-primary font-medium">สร้างห้องเลย!</button></NuxtLink>
                    <NuxtLink to="/room/bf084d88-6ed6-42d0-8046-609798566d0b"><button class="btn btn-primary font-medium ml-4">ห้องจำลอง</button></NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import type { roomTypes } from "@/types/room";


</script>

<style lang="scss" scoped></style>