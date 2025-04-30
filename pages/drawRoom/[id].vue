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
const drawCondition = computed(() => drawStore.drawConditions)

const filterPositions = computed(() => drawCondition.value?.filter_position || [])
const filterStatuses = computed(() => drawCondition.value?.filter_status || [])
const isActiveLabel = computed(() =>
    drawCondition.value?.filter_is_active ? 'เฉพาะผู้เข้าร่วม' : 'ผู้เล่นทั้งหมด'
)

const statusMap: Record<string, { label: string; color: string }> = {
    not_received: { label: 'ยังไม่ได้รางวัล', color: 'badge-warning' },
    received: { label: 'ได้รับรางวัลแล้ว', color: 'badge-success' },
    waive: { label: 'สละสิทธิ์', color: 'badge-error' },
    no_show: { label: 'ไม่แสดงตน', color: 'badge-neutral' },
}

const isDrawing = ref(false)
const showWinnerModal = ref(false)
const winner = ref<any>(null)
const glowingIndex = ref<number | null>(null)
const randomPlayer = async () => {
    if (filteredPlayers.value.length === 0 || isDrawing.value) return

    isDrawing.value = true
    showWinnerModal.value = false
    winner.value = null

    const total = filteredPlayers.value.length
    let speed = 80
    let count = 0
    const maxCount = 25

    const loop = () => {
        glowingIndex.value = Math.floor(Math.random() * total)
        count++

        if (count < maxCount) {
            speed += 30
            setTimeout(loop, speed)
        } else {
            const finalIndex = Math.floor(Math.random() * total)
            glowingIndex.value = finalIndex
            winner.value = filteredPlayers.value[finalIndex]

            // ✅ หน่วงเวลาแป๊บนึงก่อนโชว์ modal
            setTimeout(() => {
                showWinnerModal.value = true
                isDrawing.value = false
                glowingIndex.value = null
            }, 1200)
        }
    }

    loop()
}




const updatePlayerStatus = async (status: string) => {
    if (!winner.value) return
    try {
        // 👇 TODO: เรียก API อัปเดตสถานะ
        // await apiClient.patch(`/players/${winner.value.member_id}`, { status })

        alert(`อัปเดตสถานะเป็น ${status} แล้ว`)
        showWinnerModal.value = false
        winner.value = null
    } catch (e) {
        alert('❌ อัปเดตสถานะไม่สำเร็จ')
    }
}


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

    <div v-if="isDrawing" class="overlay">
        <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>



    <div class="text-center space-y-4">
        <h2 class="text-2xl font-bold">ห้อง: {{ roomName }}</h2>

        <div v-if="prizeData">
            <h3 class="text-xl">🎁 {{ prizeData.name }}</h3>
            <p>จำนวนรางวัลทั้งหมด: {{ prizeData.quantity }}</p>
            <img :src="prizeData.image_url" :alt="prizeData.name" class="mx-auto w-48 h-48 object-cover rounded" />
            <div>
                <button class="btn btn-primary mt-10" @click="randomPlayer" :disabled="isDrawing">
                    สุ่ม
                </button>

            </div>
        </div>
        <!-- 🏷️ เงื่อนไขที่ใช้ในการสุ่ม -->
        <div class="flex flex-col mt-6 space-y-2">
            <h3 class="text-lg font-semibold">🔎 เงื่อนไขที่ใช้ในการสุ่ม:</h3>

            <!-- ✅ filter_is_active -->
            <div>
                <span class="badge badge-info">{{ isActiveLabel }}</span>
            </div>

            <!-- ✅ filter_position -->
            <div class="">
                <span v-for="pos in filterPositions" :key="pos" class="badge badge-outline badge-primary">
                    ตำแหน่ง: {{ pos }}
                </span>
            </div>

            <!-- ✅ filter_status -->
            <div class="">
                <span v-for="status in filterStatuses" :key="status"
                    :class="['badge', statusMap[status]?.color || 'badge-secondary']">
                    สถานะ: {{ statusMap[status]?.label || status }}
                </span>
            </div>
        </div>


        <!-- เพิ่มส่วนแสดงผู้เล่นที่ผ่านการฟิลเตอร์ -->
        <div v-if="filteredPlayers.length > 0" class="mt-6">
            <h3 class="text-xl mb-4">ผู้เล่นที่มีสิทธิ์ลุ้นรางวัล ({{ filteredPlayers.length }} คน)</h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div v-for="(player, index) in filteredPlayers" :key="player.member_id"
                    class="card bg-base-200 shadow-sm" :class="{ glow: isDrawing && index === glowingIndex }">
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


    <dialog open v-if="showWinnerModal" class="modal modal-open">
        <div class="modal-box text-center space-y-4">
            <h2 class="text-2xl font-bold text-green-600">🎉 ผู้โชคดี 🎉</h2>
            <img :src="prizeData?.image_url" class="w-32 h-32 mx-auto rounded object-cover" />
            <p class="text-xl font-semibold">รางวัล: {{ prizeData?.name }}</p>
            <p class="text-lg">คุณ <strong>{{ winner?.prefix }} {{ winner?.first_name }} {{ winner?.last_name
            }}</strong></p>

            <div class="flex justify-center gap-4 mt-4">
                <button class="btn btn-success" @click="updatePlayerStatus('received')">✅ ยืนยันรับรางวัล</button>
                <button class="btn btn-warning" @click="updatePlayerStatus('waive')">⚠️ สละสิทธิ์</button>
                <button class="btn btn-error" @click="updatePlayerStatus('no_show')">❌ ไม่แสดงตน</button>
            </div>
        </div>
    </dialog>

</template>

<style scoped>
.card.glow {
    animation: glow 0.4s ease-in-out infinite alternate;
    z-index: 60;
    position: relative;
}

@keyframes glow {
    from {
        box-shadow: 0 0 10px #00ffe1;
        transform: scale(1.02);
    }

    to {
        box-shadow: 0 0 25px #ff00c8;
        transform: scale(1.07);
    }
}

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.65);
    backdrop-filter: blur(1px);
    z-index: 40;
    /* ให้ต่ำกว่าการ์ด */
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
