<script setup lang="ts">
const route = useRoute()
const drawStore = useDrawStore()
const playerStore = usePlayerStore()
const prizeStore = usePrizeStore()
const drawConditionStore = useDrawConditionStore() // สมมุติใช้ตัวนี้เป็นคน fetch ผู้เล่นตาม filter

const { rooms } = storeToRefs(playerStore)
const { prize } = storeToRefs(prizeStore)
const { drawConditions, isLoading } = storeToRefs(drawConditionStore) // ✅ เพิ่มมาใช้กับ template

const roomName = computed(() => rooms.value?.name || 'ไม่พบชื่อห้อง')
const prizeData = computed(() => prize.value) // ✅ เปลี่ยนชื่อให้ตรง template

const filteredPlayers = computed(() => drawConditions.value || []) // ✅ ตรงกับ template

const drawConditionID = route.params.id as string

onMounted(async () => {
    await drawStore.fetchDrawData(drawConditionID)

    const {
        room_id,
        prize_id,
        filter_status,
        filter_position,
        filter_is_active
    } = drawStore.drawConditions

    if (room_id) {
        await playerStore.fetchRoom(room_id)
    }

    if (prize_id) {
        await prizeStore.getPrize(prize_id)
    }

    if (filter_status?.length && filter_position?.length) {
        await drawConditionStore.fetchDrawConditions(
            room_id,
            filter_status,
            filter_position,
            filter_is_active
        )
    } else {
        drawConditionStore.drawConditions = []
    }
})

</script>

<template>
    <div class="text-center space-y-4">
        <h2 class="text-2xl font-bold">ห้อง: {{ roomName }}</h2>

        <div v-if="prizeData">
            <h3 class="text-xl">🎁 {{ prizeData.name }}</h3>
            <p>จำนวนรางวัลทั้งหมด: {{ prizeData.quantity }}</p>
            <img :src="prizeData.image_url" :alt="prizeData.name" class="mx-auto w-48 h-48 object-cover rounded" />
        </div>

        <!-- เพิ่มส่วนแสดงผู้เล่นที่ผ่านการฟิลเตอร์ -->
        <div v-if="filteredPlayers.length > 0" class="mt-6">
            <h3 class="text-xl mb-4">ผู้เล่นที่มีสิทธิ์ลุ้นรางวัล ({{ filteredPlayers.length }} คน)</h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div v-for="player in filteredPlayers" :key="player.member_id" class="card bg-base-200 shadow-sm">
                    <div class="card-body p-3 text-center">
                        <div class="avatar mx-auto mb-2">
                            <div class="w-14 h-14 rounded-full">
                                <img :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(player.first_name)}&background=random`"
                                    alt="รูปผู้เข้าร่วม" />
                            </div>
                        </div>
                        <div class="text-lg font-bold">{{ player.prefix }} {{ player.first_name }} {{ player.last_name
                        }}</div>
                        <div class="text-sm text-gray-500">{{ player.position }}</div>
                        <!-- สถานะการเข้าร่วม -->
                        <div class="flex justify-center mt-2">
                            <div class="w-3 h-3 rounded-full" :class="player.is_active ? 'bg-green-500' : 'bg-red-500'"
                                :title="player.is_active ? 'เข้าร่วม' : 'ไม่เข้าร่วม'">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else-if="!isLoading" class="text-center text-gray-500 mt-6">
            ไม่พบผู้เล่นที่ตรงตามเงื่อนไข
        </div>
    </div>
</template>