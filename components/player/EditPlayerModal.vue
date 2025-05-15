<script setup lang="ts">
import type { playerType } from '@/types/player'

const emit = defineEmits(['close', 'submit'])

const props = defineProps<{
    roomId: string
    playerToEdit?: playerType | null
}>()

const formPlayer = ref<playerType>({
    prefix: '',
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
        <div class="modal-box bg-white text-black/70 shadow-xl">
            <h3 class="font-bold text-lg mb-4 text-center">แก้ไขผู้เเล่น</h3>

            <div class="form-control mb-2">
                <label class="label-text mb-1">คำนำหน้า</label>
                <input v-model="formPlayer.prefix"
                    class="input input-bordered w-full bg-gray-100 text-gray-700 opacity-80 pointer-events-none"
                    readonly disabled />
            </div>

            <div class="form-control mb-2">
                <label class="label-text mb-1">ชื่อ</label>
                <input v-model="formPlayer.first_name"
                    class="input input-bordered w-full bg-gray-100 text-gray-700 opacity-80 pointer-events-none"
                    readonly disabled />
            </div>

            <div class="form-control mb-2">
                <label class="label-text mb-1">นามสกุล</label>
                <input v-model="formPlayer.last_name"
                    class="input input-bordered w-full bg-gray-100 text-gray-700 opacity-80 pointer-events-none"
                    readonly disabled />
            </div>

            <div class="form-control mb-2">
                <label class="label-text mb-1">รหัสสมาชิก (member ID)</label>
                <input v-model="formPlayer.member_id"
                    class="input input-bordered w-full bg-gray-100 text-gray-700 opacity-80 pointer-events-none"
                    readonly disabled />
            </div>

            <div class="form-control mb-2">
                <label class="label-text mb-1">ตำแหน่ง</label>
                <input v-model="formPlayer.position"
                    class="input input-bordered w-full bg-gray-100 text-gray-700 opacity-80 pointer-events-none"
                    readonly disabled />
            </div>

            <div class="form-control mb-2 flex flex-col">
                <label class="label-text mb-1">เข้าร่วม</label>
                <label class="inline-flex items-center ml-2 space-x-2 cursor-pointer">
                    <input type="checkbox" v-model="formPlayer.is_active" class="peer hidden" />
                    <div
                        class="w-5 h-5 rounded border border-gray-400 bg-red-400 peer-checked:bg-green-400 transition-colors duration-300">
                    </div>
                    <span class="text-sm text-gray-700">สถานะ</span>
                </label>
            </div>


            <div class="modal-action flex justify-center gap-4">
                <button @click="emit('close')"
                    class="btn px-6 py-2 rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 transition duration-150">
                    ยกเลิก
                </button>
                <button @click="submitForm"
                    class="relative px-6 py-2 rounded-full bg-gradient-to-t from-[#ff8f00] to-[#ffd902] text-white font-semibold shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg active:scale-95">
                    บันทึก
                </button>
            </div>
        </div>
    </dialog>
</template>
