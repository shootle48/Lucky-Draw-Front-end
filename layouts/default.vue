<script setup lang="ts">
import Swal from 'sweetalert2'
import logo from '@/assets/7.png'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { usePlayerStore } from '@/stores/playerStore'

const route = useRoute()
const playerStore = usePlayerStore()
const Year = new Date().getFullYear()

// ✅ ดึง roomId แบบ dynamic
const resolvedRoomId = computed(() => {
    const id = route.params.id as string
    const path = route.path

    // ✅ ระบุเฉพาะ path ที่เรามั่นใจว่า id คือ roomId
    const pathExpectingRoomId = ['/mainPage', '/dashboard']
    const shouldUseRouteId = pathExpectingRoomId.some(p => path.startsWith(p))

    // fallback: ใช้จาก store
    return shouldUseRouteId ? id : playerStore.currentRoomId
})

const confirmExit = async () => {
    const result = await Swal.fire({
        title: 'คุณแน่ใจหรือไม่?',
        text: 'คุณต้องการออกจากห้องสุ่มหรือไม่',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ใช่, ออกจากห้อง',
        cancelButtonText: 'ยกเลิก'
    })

    if (result.isConfirmed) {
        await navigateTo('/')
    }
}
</script>

<template>
    <div class="flex flex-col h-screen justify-between">
        <div>
            <div class="navbar fixed z-10 px-4">
                <!-- Logo -->
                <NuxtLink v-if="resolvedRoomId" :to="`/mainPage/${resolvedRoomId}`" class="btn btn-accent h-full"
                    style="border-radius: 69% 31% 66% 34% / 36% 38% 62% 64%;">
                    <img :src="logo" alt="Lucky Draw Logo" class="w-25 h-20" />
                </NuxtLink>

                <!-- Burger menu -->
                <div class="ml-auto">
                    <label class="event-wrapper pastel-menu">
                        <input type="checkbox" checked="false" class="event-wrapper-inp" />
                        <div class="bar">
                            <span class="top bar-list"></span>
                            <span class="middle bar-list"></span>
                            <span class="bottom bar-list"></span>
                        </div>
                        <section class="menu-container pastel-dropdown shadow-lg">
                            <div class="menu-list cursor-pointer hover:bg-yellow-100"
                                @click="$router.push(`/dashboard/${resolvedRoomId}`)">
                                สรุปผลรางวัล
                            </div>
                            <div class="menu-list cursor-pointer hover:bg-pink-100" @click="confirmExit">
                                ออกจากห้องสุ่ม
                            </div>
                        </section>
                    </label>
                </div>
            </div>

            <!-- ✅ slot สำหรับเนื้อหา -->
            <main class="flex-grow relative">
                <slot />
            </main>
        </div>

        <!-- ✅ Footer -->
        <footer class="footer sm:footer-horizontal footer-center p-4">
            <aside>
                <p class="text-white text-shadow-md">
                    Copyright © {{ Year }} - All right reserved by INTERN GRIT CONSULTANT TEAM
                </p>
            </aside>
        </footer>
    </div>
</template>


<style scoped>
/* From Uiverse.io by jerome_5148 */
.event-wrapper>.event-wrapper-inp {
    display: none;
}

.event-wrapper {
    font-weight: 500;
    color: white;
    background-color: darkviolet;
    padding: 3px 15px;
    border-radius: 10px;

    display: flex;
    align-items: center;
    height: 2.5rem;
    width: fit-content;
    position: relative;
    cursor: pointer;
    justify-content: space-between;
}

.arrow {
    height: 34%;
    aspect-ratio: 1;
    margin-block: auto;
    position: relative;
    display: flex;
    justify-content: center;
    transition: all 0.3s;
}

.arrow::after,
.arrow::before {
    content: "";
    position: absolute;
    background-color: white;
    height: 100%;
    width: 2.5px;
    border-radius: 500px;
    transform-origin: bottom;
}

.arrow::after {
    transform: rotate(35deg) translateX(-0.5px);
}

.arrow::before {
    transform: rotate(-35deg) translateX(0.5px);
}

.event-wrapper>.event-wrapper-inp:checked+.arrow {
    transform: rotateX(180deg);
}

.menu-container {
    background-color: white;
    color: darkviolet;
    border-radius: 10px;
    position: absolute;
    width: 150px;
    left: -100px;
    top: 130%;
    overflow: hidden;
    clip-path: inset(0% 0% 0% 0% round 10px);
    transition: all 0.4s;
}

.menu-list {
    --delay: 0.4s;
    --trdelay: 0.15s;
    padding: 8px 10px;
    border-radius: inherit;
    transition: background-color 0.2s 0s;
    position: relative;
    transform: translateY(30px);
    opacity: 0;
}

.menu-list::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    height: 1px;
    background-color: rgba(0, 0, 0, 0.3);
    width: 95%;
}

.menu-list:hover {
    background-color: rgb(223, 223, 223);
}

.event-wrapper-inp:checked~.menu-container {
    clip-path: inset(10% 50% 90% 50% round 10px);
}

.event-wrapper-inp:not(:checked)~.menu-container .menu-list {
    transform: translateY(0);
    opacity: 1;
}

.event-wrapper-inp:not(:checked)~.menu-container .menu-list:nth-child(1) {
    transition:
        transform 0.4s var(--delay),
        opacity 0.4s var(--delay);
}

.event-wrapper-inp:not(:checked)~.menu-container .menu-list:nth-child(2) {
    transition:
        transform 0.4s calc(var(--delay) + (var(--trdelay) * 1)),
        opacity 0.4s calc(var(--delay) + (var(--trdelay) * 1));
}

.event-wrapper-inp:not(:checked)~.menu-container .menu-list:nth-child(3) {
    transition:
        transform 0.4s calc(var(--delay) + (var(--trdelay) * 2)),
        opacity 0.4s calc(var(--delay) + (var(--trdelay) * 2));
}

.event-wrapper-inp:not(:checked)~.menu-container .menu-list:nth-child(4) {
    transition:
        transform 0.4s calc(var(--delay) + (var(--trdelay) * 3)),
        opacity 0.4s calc(var(--delay) + (var(--trdelay) * 3));
}

.bar-event-wrapper-inp {
    appearance: none;
    -webkit-appearance: none;
    display: none;
    visibility: hidden;
}

.bar {
    display: flex;
    height: 50%;
    width: 20px;
    flex-direction: column;
    gap: 3px;
}

.bar-list {
    --transform: -25%;
    display: block;
    width: 100%;
    height: 3px;
    border-radius: 50px;
    background-color: white;
    transition: all 0.4s;
    position: relative;
}

.event-wrapper-inp:not(:checked)~.bar>.top {
    transform-origin: top right;
    transform: translateY(var(--transform)) rotate(-45deg);
}

.event-wrapper-inp:not(:checked)~.bar>.middle {
    transform: translateX(-50%);
    opacity: 0;
}

.event-wrapper-inp:not(:checked)~.bar>.bottom {
    transform-origin: bottom right;
    transform: translateY(calc(var(--transform) * -1)) rotate(45deg);
}

.pastel-menu {
    background: linear-gradient(135deg, #f9f871, #ffd871, #ffca80, #ffb896);
    box-shadow: 0 4px 12px rgba(255, 183, 144, 0.6);
    border: 2px solid #fff3d2;
    transition: all 0.3s ease;
}

.pastel-menu:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(255, 183, 144, 0.75);
}

.pastel-dropdown {
    background: #fff8ef;
    border: 1px solid #ffe8c8;
    color: #6a4c33;
}
</style>
