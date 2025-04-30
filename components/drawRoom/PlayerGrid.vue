<template>
    <div class="mt-6">
        <h3 class="text-xl mb-4">ผู้เล่นที่มีสิทธิ์ลุ้นรางวัล ({{ players.length }} คน)</h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <PlayerCard v-for="(player, index) in players" :key="player.member_id" :player="player" :index="index"
                :glowingIndexes="glowingIndexes" :glowingTempIndex="glowingTempIndex" :isDrawing="isDrawing" />
        </div>
    </div>
</template>

<script setup>
import PlayerCard from './PlayerCard.vue'

defineProps(['players', 'glowingIndexes', 'glowingTempIndex', 'isDrawing'])
</script>