<script setup lang="ts">
import type { winnerType } from '@/types/winner'

const props = defineProps({
  show: Boolean,
  data: Object as () => winnerType | null,
})

const emit = defineEmits(['update:show'])

const isOpen = ref(props.show)

watch(() => props.show, (val) => {
  isOpen.value = val
})

watch(isOpen, (val) => {
  emit('update:show', val)
})

// แปลงสถานะเป็น label ภาษาไทย
const statusLabel = (status: string) => {
  switch (status) {
    case 'not_received': return 'ยังไม่ได้รับ'
    case 'received': return 'ได้รับแล้ว'
    case 'waive': return 'สละสิทธิ์'
    default: return status
  }
}

// ชื่อเต็ม
const full_name = computed(() => {
  if (!props.data) return '-'
  return `${props.data.prefix}${props.data.first_name} ${props.data.last_name}`
})

// แปลง timestamp -> string
const formatDate = (timestamp: number) => {
  if (!timestamp) return '-'
  const date = new Date(timestamp * 1000)
  return date.toLocaleString('th-TH', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

const showAllPositions = ref(false)
computed(() => props.data?.filter_position?.split(',') || [])

</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50">
    <div class="bg-white text-black rounded-xl shadow-xl max-w-lg w-full p-8 relative overflow-y-auto max-h-[90vh]">
      <h2 class="text-2xl font-bold text-center mb-6">🎉 รายละเอียดการสุ่ม 🎉</h2>

      <div v-if="props.data" class="flex flex-col gap-5">

      <!-- Prize Info -->
        <div v-if="props.data.prize_name" class="mt-4">
          <div class="bg-yellow-100 w-fit rounded-lg p-4 flex flex-col mx-auto items-center gap-4">
            <h4 class="font-semibold text-md mb-1">รางวัล</h4>
            <img :src="props.data.image_url" alt="prize image" class="w-40 h-40 object-cover rounded-full shadow" />
            <p class="font-semibold text-2xl">{{ props.data.prize_name }}</p>
          </div>
        </div>
        <!-- Profile Display -->
        <div class="flex flex-col items-center gap-2">
          <p>ผู้โชคดี</p>
          <h3 class="text-xl font-semibold">{{ full_name }}</h3>
          <p class="text-sm text-gray-600">รหัสสมาชิก: {{ props.data.member_id || '-' }}</p>
        </div>

        <!-- Info Blocks -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-500">สถานะคนรับรางวัล</p>
            <span class="badge badge-info">{{ statusLabel(props.data.status) }}</span>
          </div>
          <div>
            <p class="text-sm text-gray-500">วันที่สุ่ม</p>
            <p>{{ formatDate(props.data.created_at) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">ตำแหน่ง</p>
            <p>{{ props.data.position || '-' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">เข้าร่วมงาน</p>
            <span :class="props.data.is_active ? 'badge badge-success' : 'badge badge-error'">
              {{ props.data.is_active ? 'เข้างาน' : 'ไม่ได้เข้างาน' }}
            </span>
          </div>
        </div>


      </div>

      <div v-else class="text-gray-500 text-center py-10"><LoadingPage /></div>

      <!-- Close Button -->
      <button @click="isOpen = false" class="absolute top-3 right-3 text-red-500 hover:text-red-700 text-lg font-bold cursor-pointer">
        ✕
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>
