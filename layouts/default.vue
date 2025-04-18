<template>
    <div class="navbar bg-base-100 shadow-sm">
        <NuxtLink to="/"><a class="btn btn-ghost text-xl">GRIT</a></NuxtLink>
    </div>
    <slot />
    <footer class="footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-4">
        <aside>
            <p>Copyright © {new Date().getFullYear()} - All right reserved by ACME Industries Ltd</p>
        </aside>
    </footer>
</template>