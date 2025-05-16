<template>
    <div class="flex flex-col mt-2 gap-2">
        <h3 class="text-lg font-semibold">เงื่อนไขสุ่ม</h3>

        <div class="text-lg">
            จำนวนรางวัลที่สุ่ม: {{ drawQuantity }}
        </div>

        <div class="flex flex-wrap justify-center gap-1">
            <div v-for="(pos, index) in (showAllPositions ? filterPositions : filterPositions.slice(0, 3))" :key="pos">
                <div
                    class="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full border border-purple-300">
                    {{ pos }}
                </div>
            </div>

            <button v-if="filterPositions.length > 3" @click="showAllPositions = !showAllPositions"
                class="text-sm text-blue-500 cursor-pointer focus:outline-none">
                <div v-if="!showAllPositions">+ {{ filterPositions.length - 3 }} More</div>
                <div v-else>- Show Less</div>
            </button>
        </div>

        <div>
            <span class="badge badge-info">{{ isActiveLabel }}</span>
            <span v-for="status in filterStatuses" :key="status"
                :class="['badge', statusMap[status]?.color || 'badge-secondary']">
                {{ statusMap[status]?.label || status }}
            </span>
        </div>
    </div>
</template>

<script setup>
defineProps(['isActiveLabel', 'filterPositions', 'filterStatuses', 'statusMap', 'drawQuantity'])
const showAllPositions = ref(false)
</script>