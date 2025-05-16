<script setup lang="ts">
import { ref, watch } from 'vue'
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

// ตัวอย่าง function แปลงสถานะ
const statusLabel = (status: string) => {
  switch (status) {
    case 'not_received': return 'ยังไม่ได้รับ'
    case 'received': return 'ได้รับแล้ว'
    case 'waive': return 'สละสิทธิ์'
    default: return status
  }
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative overflow-y-auto max-h-[80vh]">
      <h2 class="text-xl font-bold mb-4">รายละเอียดผู้ชนะ</h2>

      <div v-if="data">
        <div class="mb-3">
          <span class="font-semibold">ชื่อ: </span>{{ data.name || '-' }}
        </div>
        <div class="mb-3">
          <span class="font-semibold">สถานะ: </span>{{ statusLabel(data.status) }}
        </div>
        <div class="mb-3">
          <span class="font-semibold">ตำแหน่ง: </span>{{ data.position || '-' }}
        </div>
        <div class="mb-3">
          <span class="font-semibold">หมายเลขสมาชิก: </span>{{ data.member_id || '-' }}
        </div>
        <div class="mb-3">
          <span class="font-semibold">รายละเอียดเพิ่มเติม: </span>{{ data.details || '-' }}
        </div>
      </div>

      <div v-else class="text-gray-500 text-center py-10">กำลังโหลดข้อมูล...</div>

      <button @click="isOpen = false" class="absolute top-3 right-3 btn btn-sm btn-error text-white"
        aria-label="Close modal">
        ปิด
      </button>
    </div>
  </div>
</template>

<style scoped>
/* เพิ่ม style ตามต้องการ */
</style>
