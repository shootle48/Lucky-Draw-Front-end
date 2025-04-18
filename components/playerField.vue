<template>
    <div class="card bg-base-100 shadow-xl mb-8">
        <div class="card-body">
            <h2 class="card-title mb-4">รายชื่อผู้เข้าร่วม ({{ players.length }} คน)</h2>

            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div v-for="(player, index) in players" :key="index" class="card bg-base-200 shadow-sm">
                    <div class="card-body p-3 text-center relative">
                        <!-- รูปภาพผู้เข้าร่วม (ใช้รูปแทน) -->
                        <div class="avatar mx-auto mb-2">
                            <div class="w-14 h-14 rounded-full">
                                <img :src="player.image || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(player.firstName)"
                                    alt="รูปผู้เข้าร่วม" />
                            </div>
                        </div>

                        <p class="text-sm font-medium truncate">{{ player.firstName }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { playerType } from "@/types/player";

const props = defineProps<{
    players: playerType[];
}>();
</script>