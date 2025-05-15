<script setup lang="ts">
import type { playerType } from '@/types/player'

const emit = defineEmits(['submit', 'close'])

const props = defineProps<{
  roomId: string
}>()

const newPlayer = ref<playerType>({
  id: '',
  prefix: '',
  first_name: '',
  last_name: '',
  member_id: '',
  position: '',
  room_id: props.roomId,
  is_active: true,
  status: 'not_received'
})

const resetForm = () => {
  newPlayer.value = {
    id: '',
    prefix: '',
    first_name: '',
    last_name: '',
    member_id: '',
    position: '',
    room_id: '',
    is_active: true,
    status: 'not_received'
  }
}

const isAddPlayerVaild = computed(() => {
  return (
    newPlayer.value.prefix.trim() !== '' &&
    newPlayer.value.first_name.trim() !== '' &&
    newPlayer.value.last_name.trim() !== '' &&
    newPlayer.value.member_id?.trim() !== '' &&
    newPlayer.value.position.trim() !== ''
  )
})

const submitForm = () => {
  console.log("🧪 newPlayer submitting:", newPlayer.value)
  emit('submit', { ...newPlayer.value })
  resetForm()
}

</script>

<template>
  <dialog open class="modal modal-open">
    <div class="modal-box bg-[#ffffff] text-black/60 shadow-xl">
      <h3 class="font-bold text-lg mb-4 text-center">เพิ่มผู้เล่น</h3>

      <div class="form-control mb-2">
        <label class="label-text mb-1">คำนำหน้า</label>
        <input v-model="newPlayer.prefix" class="input input-bordered w-full text-black bg-black/10"
          placeholder="นาย / นางสาว ..." />
      </div>

      <div class="form-control mb-2">
        <label class="label-text mb-1">ชื่อ</label>
        <input v-model="newPlayer.first_name" class="input input-bordered w-full text-black bg-black/10" />
      </div>

      <div class="form-control mb-2">
        <label class="label-text mb-1">นามสกุล</label>
        <input v-model="newPlayer.last_name" class="input input-bordered w-full text-black bg-black/10" />
      </div>

      <div class="form-control mb-2">
        <label class="label-text mb-1">รหัสสมาชิก/รหัสประชาชน</label>
        <input v-model="newPlayer.member_id" class="input input-bordered w-full text-black bg-black/10" />
      </div>

      <div class="form-control mb-2">
        <label class="label-text mb-1">ตำแหน่ง</label>
        <input v-model="newPlayer.position" class="input input-bordered w-full text-black bg-black/10" />
      </div>

      <div class="modal-action flex justify-center gap-4">
        <button @click="emit('close')"
          class="btn px-6 py-2 rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 transition duration-150">ยกเลิก</button>
        <button @click="submitForm"
          class="relative px-6 py-2 rounded-full bg-gradient-to-t from-[#ff8f00] to-[#ffd902] text-white font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
          :disabled="!isAddPlayerVaild">บันทึก</button>
      </div>
    </div>
  </dialog>
</template>
