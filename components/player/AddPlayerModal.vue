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


const submitForm = () => {
  console.log("🧪 newPlayer submitting:", newPlayer.value)
  emit('submit', { ...newPlayer.value })
  resetForm()
}
</script>

<template>
  <dialog open class="modal modal-open">
    <div class="modal-box">
      <h3 class="font-bold text-lg mb-4">เพิ่มผู้เล่นใหม่</h3>

      <div class="form-control mb-2">
        <label class="label">คำนำหน้า</label>
        <input v-model="newPlayer.prefix" class="input input-bordered" placeholder="นาย / นางสาว ..." />
      </div>

      <div class="form-control mb-2">
        <label class="label">ชื่อ</label>
        <input v-model="newPlayer.first_name" class="input input-bordered" />
      </div>

      <div class="form-control mb-2">
        <label class="label">นามสกุล</label>
        <input v-model="newPlayer.last_name" class="input input-bordered" />
      </div>

      <div class="form-control mb-2">
        <label class="label">รหัสสมาชิก/รหัสประชาชน</label>
        <input v-model="newPlayer.member_id" class="input input-bordered" />
      </div>

      <div class="form-control mb-2">
        <label class="label">ตำแหน่ง</label>
        <input v-model="newPlayer.position" class="input input-bordered" />
      </div>

      <div class="modal-action flex justify-between">
        <button @click="emit('close')" class="btn">ยกเลิก</button>
        <button @click="submitForm" class="btn btn-primary">บันทึก</button>
      </div>
    </div>
  </dialog>
</template>
