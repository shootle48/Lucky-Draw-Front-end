<template>
    <div class="card bg-base-200 shadow-sm" :class="{
        glow: glowingIndexes.includes(player.member_id),
        'glow-temp': isDrawing && index === glowingTempIndex
    }">
        <div class="card-body p-3 text-center">
            <div class="avatar mx-auto mb-2">
                <div class="w-14 h-14 rounded-full">
                    <img :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(player.first_name)}&background=random`"
                        alt="รูปผู้เข้าร่วม" />
                </div>
            </div>
            <div class="text-lg font-bold">{{ player.prefix }} {{ player.first_name }} {{ player.last_name }}</div>
            <div class="text-sm text-gray-500">{{ player.position }}</div>
            <div class="flex justify-center mt-2">
                <div class="w-3 h-3 rounded-full" :class="player.is_active ? 'bg-green-500' : 'bg-red-500'"
                    :title="player.is_active ? 'เข้าร่วม' : 'ไม่เข้าร่วม'">
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps(['player', 'index', 'glowingIndexes', 'glowingTempIndex', 'isDrawing'])
</script>
