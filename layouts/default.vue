<template>
    <div class="flex flex-col h-screen justify-between">
        <div>
            <div class="navbar bg-base-100 shadow-sm">
                <NuxtLink to="/"><a class="btn btn-ghost text-xl">GRIT</a></NuxtLink>
            </div>
            <main class="flex-grow">
                <slot />
            </main>
        </div>
        <footer class="footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-4">
            <aside>
                <p>Copyright © {{ Year }} - All right reserved by INTERN GRIT CONSULTANT TEAM</p>
            </aside>
        </footer>
    </div>
</template>

<script setup lang="ts">
const Year = new Date().getFullYear();
</script>