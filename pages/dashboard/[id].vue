<script setup>
import { ref, onMounted } from 'vue'

const dashboard = ref({ winners: [], prizes: [] })
const loading = ref(true)

const route = useRoute()
const roomID = route.params.id

const statusLabel = (status) => {
    return {
        received: 'ได้รับรางวัลแล้ว',
        waive: 'สละสิทธิ์',
        no_show: 'ไม่แสดงตน'
    }[status] || 'ยังไม่ได้รับรางวัล'
}

const activeLabel = (val) => val ? 'ใช้งานอยู่' : 'ไม่ใช้งาน'

onMounted(async () => {
    try {
        const { data } = await apiClient.get(`/winners/room/${roomID}`)
        dashboard.value = data
    } catch (error) {
        console.error('Error fetching dashboard:', error)
    } finally {
        loading.value = false
    }
})

const formatDate = (timestamp) => {
    if (!timestamp) return '-'
    const date = new Date(timestamp * 1000) // แปลงจาก seconds → milliseconds
    return date.toLocaleString('th-TH', {
        dateStyle: 'medium',
        timeStyle: 'short',
    })
}

</script>

<template>
    <div class="p-6 space-y-6">
        <h1 class="text-3xl font-bold justify-center text-center text-black">Summary of the Dashboard</h1>

        <div v-if="loading" class="flex justify-center items-center py-20">
            <span class="loading loading-spinner text-primary"></span>
        </div>

        <div v-else>
            <!-- Winners Section -->
            <div>
                <h2 class="text-2xl font-semibold mb-5 justify-center text-center text-black">🏆 ผู้ที่ได้รางวัล</h2>
                <div v-if="dashboard.winners.length === 0" class="text-gray-500 mb-6">No winners yet.</div>
                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="winner in dashboard.winners" :key="winner.id"
                        class="card bg-[#ffffff98] fill-gray-500 drop-shadow-lg drop-shadow-gray-500/50 hover:bg-white/50">
                        <figure class="aspect-video overflow-hidden mt-5">
                            <img :src="winner.image_url" alt="Prize Image" class="rounded-xl object-contain h-full"
                                @error="(e) => { e.target.src = '/default-image.png' }" />
                        </figure>
                        <div class="card-body flex items-center lg:p-0 max-w-[400px] mx-auto">
                            <h3 class="card-title text-lg font-bold text-black">
                                {{ winner.prefix }}{{ winner.first_name }} {{ winner.last_name }}
                            </h3>
                            <p class="text-sm text-gray-500">{{ winner.position }} | {{ winner.member_id }}</p>
                            <div>
                                <div class="badge badge-success gap-2">
                                    🏅 {{ winner.prize_name }}
                                </div>
                            </div>

                            <!-- Status -->
                            <div class="p">
                                <h1 class="font-bold text-black">เงื่อนไขการสุ่ม</h1>
                                <div class="flex flex-col items-start p-1">
                                    <span class="font-medium text-black">สถานะ </span>
                                    <span class="h-full px-4 text-left text-black">
                                        {{
                                            (Array.isArray(winner.filter_status) ? winner.filter_status :
                                                JSON.parse(winner.filter_status || '[]'))
                                                .map(status => statusLabel(status))
                                                .join(', ')
                                        }}
                                    </span>
                                </div>

                                <!-- Condition -->
                                <div class="flex flex-col items-start p-1">
                                    <span class="font-medium text-black">ตำแหน่ง </span>
                                    <span class="h-full px-4 text-left text-black">
                                        {{
                                            (Array.isArray(winner.filter_position) ? winner.filter_position :
                                                JSON.parse(winner.filter_position || '[]'))
                                                .map(position => position)
                                                .join(', ')
                                        }}
                                    </span>
                                </div>

                                <!-- Active -->
                                <div class="flex flex-col items-start p-1">
                                    <span class="font-medium text-black">ผู้เข้าร่วม </span>
                                    <span :class="winner.filter_is_active ? 'badge badge-info' : 'badge badge-neutral'">
                                        {{ winner.filter_is_active ? 'เฉพาะผู้เข้าร่วม' : 'ผู้เล่นทั้งหมด' }}
                                    </span>
                                </div>

                                <!-- Qty & Time -->
                                <div class="flex flex-col items-start p-1">
                                    <span class="font-medium text-black">จำนวนรอบที่สุ่ม</span>
                                    <span class="h-full px-4 text-left text-black">
                                        {{ winner.quantity }}
                                    </span>
                                </div>

                            </div>
                            <p class="text-xs text-gray-400 mb-4">สุ่มวันที่: {{ formatDate(winner.created_at) }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Prizes Section -->
            <div>
                <h2 class="text-2xl font-semibold mb-5 mt-10 justify-center text-center text-black">🎁 รางวัลที่เหลือ
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="prize in dashboard.prizes" :key="prize.id"
                        class="card bg-[#ffffff98] fill-gray-500 drop-shadow-lg drop-shadow-gray-500/50 hover:bg-white/50">
                        <figure class="aspect-video overflow-hidden mt-5">
                            <img :src="prize.image_url" alt="Prize Image" class="rounded-xl object-contain w-80"
                                @error="(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=No+Image' }" />
                        </figure>
                        <div class="card-body flex items-center justify-center text-center">
                            <h3 class="card-title truncate text-lg text-black">{{ prize.name }}</h3>
                            <p class="text-sm text-gray-600">🎁 รางวัลที่เหลือ: {{ prize.quantity }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>



<style scoped></style>