<script setup lang="ts">
import logo from '@/assets/7.png';
const Year = new Date().getFullYear();
</script>
<template>
    <div class="flex flex-col h-screen justify-between">
        <div>
            <div class="navbar shadow-lg ">
                <NuxtLink to="/" class="btn btn-accent h-full"
                    style="border-radius: 69% 31% 66% 34% / 36% 38% 62% 64%  ;"><img :src="logo" alt="Lucky Draw Logo"
                        class="w-25 h-20" /></NuxtLink>
            </div>
            <main class="flex-grow">
                <slot />
            </main>
        </div>
        <footer class="footer sm:footer-horizontal footer-center p-4">
            <aside>
                <p class="text-white text-shadow-md ">Copyright © {{ Year }} - All right reserved by
                    INTERN GRIT
                    CONSULTANT TEAM</p>
            </aside>
        </footer>
    </div>
</template>