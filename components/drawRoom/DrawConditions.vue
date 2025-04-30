<template>
    <div class="flex flex-col mt-6 space-y-2">
        <h3 class="text-lg font-semibold">🔎 เงื่อนไขที่ใช้ในการสุ่ม:</h3>

        <div>
            <span class="badge badge-info">{{ isActiveLabel }}</span>
        </div>

        <div>
            <span v-for="pos in filterPositions" :key="pos" class="badge badge-outline badge-primary">
                ตำแหน่ง: {{ pos }}
            </span>
        </div>

        <div>
            <span v-for="status in filterStatuses" :key="status"
                :class="['badge', statusMap[status]?.color || 'badge-secondary']">
                สถานะ: {{ statusMap[status]?.label || status }}
            </span>
        </div>

        <label for="">จำนวนรางวัลที่สุ่ม</label>
        <span>{{ drawQuantity }}</span>
    </div>
</template>

<script setup>
defineProps(['isActiveLabel', 'filterPositions', 'filterStatuses', 'statusMap', 'drawQuantity'])
</script>