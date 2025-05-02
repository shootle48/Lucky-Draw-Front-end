<script setup lang="ts">
import type { playerType } from '@/types/player'

const route = useRoute()
const isShowing = ref<boolean>(false)
const isModalOpen = ref(false)

const togglePlayer = () => isShowing.value = !isShowing.value

const props = defineProps<{
    players: playerType[]
}>()

const emit = defineEmits(['add'])

const isMainPage = computed(() => route.path.startsWith('/mainPage'))

const playerListWithFullName = computed(() =>
    props.players.map((player) => ({
        ...player,
        full_name: `${player.prefix} ${player.first_name} ${player.last_name}`.trim()
    }))
)

const handleAddPlayer = (newPlayer: playerType) => {
    emit('add', newPlayer)
    isModalOpen.value = false
}
</script>

<template>
    <div class="card bg-base-100 w-full shadow-xl mb-8">
        <div class="card-body">
            <div class="flex items-center justify-between mb-4">
                <h2 class="card-title">รายชื่อผู้เข้าร่วม ({{ players.length }} คน)</h2>
                <input type="checkbox" @click="togglePlayer" class="toggle toggle-accent" checked />
            </div>
            <!-- แสดง player ตามหน้า -->
            <div v-if="isMainPage" class="flex flex-col gap-4" v-show="!isShowing">
                <div class="flex justify-end">
                    <button @click="isModalOpen = true" class="btn btn-sm btn-primary shadow">
                        ➕ เพิ่มผู้เล่น
                    </button>
                </div>
                <div 
                    class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <div v-for="(player, index) in playerListWithFullName" :key="index"
                        class="card bg-base-200 shadow-sm">
                        <div class="card-body p-3 text-center">
                            <div class="avatar mx-auto mb-2">
                                <div class="w-14 h-14 rounded-full">
                                    <img
                                        :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(player.first_name)}&background=random`" />
                                </div>
                            </div>
                            <div class="text-lg font-bold">{{ player.full_name }}</div>
                            <div class="text-sm text-gray-500">{{ player.position }}</div>
                            <div class="flex justify-center mt-2">
                                <div class="w-3 h-3 rounded-full"
                                    :class="player.is_active ? 'bg-green-500' : 'bg-red-500'" title="สถานะการเข้าร่วม">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else v-show="!isShowing" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div v-for="(player, index) in players" :key="index" class="card bg-base-200 shadow-sm">
                    <div class="card-body p-3 text-center">
                        <div class="avatar mx-auto mb-2">
                            <div class="w-14 h-14 rounded-full">
                                <img
                                    :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(player.first_name)}&background=random`" />
                            </div>
                        </div>
                        <div class="text-lg font-bold">{{ player.full_name }}</div>
                        <div class="text-sm text-gray-500">{{ player.position }}</div>
                        <div class="flex justify-center mt-2">
                            <div class="w-3 h-3 rounded-full" :class="player.is_active ? 'bg-green-500' : 'bg-red-500'"
                                title="สถานะการเข้าร่วม"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal -->
        <AddPlayerModal v-if="isModalOpen" @close="isModalOpen = false" @submit="handleAddPlayer" />
    </div>
</template>
