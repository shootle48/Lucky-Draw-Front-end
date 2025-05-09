<script setup lang="ts">
import type { playerType } from '@/types/player'

const emit = defineEmits(['close', 'submit'])

const props = defineProps<{
    roomId: string
    playerToEdit?: playerType | null
}>()

const formPlayer = ref<playerType>({
    prefix: 'test',
    first_name: '',
    last_name: '',
    position: '',
    room_id: props.roomId,
    is_active: true,
    status: 'not_received'
})

watch(
    () => props.playerToEdit,
    (newVal: any) => {
        if (newVal) {
            formPlayer.value = { ...newVal }
        } else {
            resetForm()
        }
    },
    { immediate: true }
)

const resetForm = () => {
    formPlayer.value = {
        prefix: '',
        first_name: '',
        last_name: '',
        position: '',
        room_id: props.roomId,
        is_active: true,
        status: 'not_received'
    }
}

const submitForm = () => {
    if (props.playerToEdit?.member_id) {
        formPlayer.value.member_id = props.playerToEdit.member_id
    }


    emit('submit', { ...formPlayer.value })
    resetForm()
}

</script>

<template>
    <dialog open class="modal modal-open">
        <div class="modal-box">
            <h3 class="font-bold text-lg mb-4 text-center">แก้ไขผู้เเล่น</h3>

            <div class="form-control mb-2">
                <label class="label-text mb-1">คำนำหน้า</label>
                <input v-model="formPlayer.prefix" class="input input-bordered w-full" placeholder="นาย / นางสาว ..." />
            </div>

            <div class="form-control mb-2">
                <label class="label-text mb-1">ชื่อ</label>
                <input v-model="formPlayer.first_name" class="input input-bordered  w-full" />
            </div>

            <div class="form-control mb-2">
                <label class="label-text mb-1">นามสกุล</label>
                <input v-model="formPlayer.last_name" class="input input-bordered w-full" />
            </div>

            <!-- เพิ่ม field สำหรับ member_id ที่ไม่ให้ user แก้ไข -->
            <div class="form-control mb-2">
                <label class="label-text mb-1">รหัสสมาชิก (member ID)</label>
                <input v-model="formPlayer.member_id" class="input input-bordered w-full" readonly disabled />
            </div>


            <div class="form-control mb-2">
                <label class="label-text mb-1">ตำแหน่ง</label>
                <input v-model="formPlayer.position" class="input input-bordered w-full" />
            </div>

            <div class="form-control mb-2">
                <label class="label-text mb-1">เข้าร่วม</label>
                <input type="checkbox" v-model="formPlayer.is_active"
                    class="checkbox border-red-600 bg-red-500 checked:border-green-500 checked:bg-green-400 checked:text-orange-800 ml-2" />
            </div>

            <div class="form-control mb-2">
                <label class="label-text mb-1">สถานะ</label>
                <input v-model="formPlayer.status" class="input input-bordered w-full" />
            </div>

            <div class="modal-action flex justify-between">
                <button @click="emit('close')" class="btn">ยกเลิก</button>
                <button @click="submitForm" class="btn btn-primary">บันทึก</button>
            </div>
        </div>
    </dialog>
</template>