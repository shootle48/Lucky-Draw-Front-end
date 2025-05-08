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

// ✅ ใช้ภาพ local จาก assets
const getProfileImage = (index: number) => {
    const imageIndex = (index % 10) + 1
    return new URL(`/assets/Image_profile/default_${imageIndex}.png`, import.meta.url).href
}

const bgColors = [
    '#F44336', // red
    '#E91E63', // pink
    '#9C27B0', // purple
    '#3F51B5', // indigo
    '#2196F3', // blue
    '#009688', // teal
    '#4CAF50', // green
    '#FF9800', // orange
    '#795548', // brown
    '#607D8B'  // blue gray
]

const getRandomBgColor = (index: number): string => {
    return bgColors[index % bgColors.length]
}


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
    <div class="card bg-[#ffffff98] w-full shadow-xl mb-8">
        <div class="card-body">
            <div class="flex items-center justify-between mb-4">
                <h2 class="card-title text-black">รายชื่อผู้เข้าร่วม ({{ players.length }} คน)</h2>
                <input type="checkbox" @click="togglePlayer" class="toggle toggle-accent bg-black" checked />
            </div>

            <!-- mainPage layout -->
            <div v-if="isMainPage" class="flex flex-col gap-4" v-show="!isShowing">
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <div v-for="(player, index) in playerListWithFullName" :key="index" class="card shadow-sm relative">
                        <div class="absolute top-2 right-2 w-3 h-3 rounded-full shadow"
                            :class="player.is_active ? 'bg-green-500' : 'bg-red-500'" title="สถานะการเข้าร่วม"></div>

                        <div class="card-body p-3 text-center text-black">
                            <div class="avatar mx-auto mb-2">
                                <div class="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center text-white text-xl font-bold"
                                    :style="{ backgroundColor: getRandomBgColor(index) }">
                                    <img :src="getProfileImage(index)" class="w-full h-full object-cover"
                                        alt="profile" />
                                </div>

                            </div>
                            <div class="text-lg font-bold">{{ player.full_name }}</div>
                            <div class="text-sm text-gray-500">{{ player.position }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- other pages -->
            <div v-else v-show="!isShowing" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div v-for="(player, index) in players" :key="index" class="card shadow-sm relative">
                    <div class="absolute top-2 right-2 w-3 h-3 rounded-full shadow"
                        :class="player.is_active ? 'bg-green-500' : 'bg-red-500'" title="สถานะการเข้าร่วม"></div>

                    <div class="card-body p-3 text-center text-black">
                        <div class="avatar mx-auto mb-2">
                            <div class="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center text-white text-xl font-bold"
                                :style="{ backgroundColor: getRandomBgColor(index) }">
                                <img :src="getProfileImage(index)" class="w-full h-full object-cover" alt="profile" />
                            </div>

                        </div>
                        <div class="text-lg font-bold">{{ player.prefix }} {{ player.first_name }} {{ player.last_name
                            }}</div>
                        <div class="text-sm text-gray-500">{{ player.position }}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal -->
        <AddPlayerModal v-if="isModalOpen" @close="isModalOpen = false" @submit="handleAddPlayer" />
    </div>
</template>
