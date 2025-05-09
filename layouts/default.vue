<script setup lang="ts">
import logo from '@/assets/7.png';
const Year = new Date().getFullYear();
const route = useRoute()
const roomId = route.params.id as string
</script>
<template>
    <div class="flex flex-col h-screen justify-between">
        <div>
            <div class="navbar shadow-lg">
                <!-- ✅ ซ้าย: โลโก้ -->
                <NuxtLink :to="`/mainPage/${roomId}`" class="btn btn-accent h-full"
                    style="border-radius: 69% 31% 66% 34% / 36% 38% 62% 64%;">
                    <img :src="logo" alt="Lucky Draw Logo" class="w-25 h-20" />
                </NuxtLink>

                <!-- ✅ ขวา: Burger Menu -->
                <div class="ml-auto bg-primary rounded-full dropdown dropdown-end">
                    <button tabindex="0" class="btn btn-circle btn-ghost">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <ul tabindex="0"
                        class="menu menu-sm dropdown-content mt-3 z-[100] p-2 shadow bg-base-200 rounded-box w-52">
                        <li>
                            <a @click="$router.push(`/dashboard/${roomId}`)">สรุปผลรางวัล</a>
                        </li>
                        <li>
                            <a @click="$router.push(`/`)">ออกจากห้องสุ่ม</a>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- ✅ slot สำหรับเนื้อหา -->
            <main class="flex-grow">
                <slot />
            </main>
        </div>

        <!-- ✅ Footer -->
        <footer class="footer sm:footer-horizontal footer-center p-4">
            <aside>
                <p class="text-white text-shadow-md">Copyright © {{ Year }} - All right reserved by
                    INTERN GRIT CONSULTANT TEAM</p>
            </aside>
        </footer>
    </div>

</template>
