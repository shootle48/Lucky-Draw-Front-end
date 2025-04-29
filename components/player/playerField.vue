<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import type { playerType } from "@/types/player";

const route = useRoute();
const isShowing = ref<boolean>(false);

const togglePlayer = () => {
    isShowing.value = !isShowing.value;
};

const props = defineProps<{
    players: playerType[];
}>();

// ✅ เช็คว่ากำลังอยู่ที่ mainPage หรือไม่
const isMainPage = computed(() => route.path.startsWith('/mainPage'));

// ✅ สำหรับ mainPage เท่านั้น: เพิ่ม fullName
const playerListWithFullName = computed(() => {
    return props.players.map((player) => ({
        ...player,
        fullName: `${player.prefix} ${player.first_name} ${player.last_name}`,
    }));
});
</script>


<template>
    <div class="card bg-base-100 w-full shadow-xl mb-8">
        <div class="card-body">
            <div class="flex items-center justify-between mb-4">
                <h2 class="card-title"> 
                    รายชื่อผู้เข้าร่วม ({{ players.length }} คน)
                </h2>
                <input type="checkbox" @click="togglePlayer" class="toggle toggle-accent" checked />
            </div>

            <!-- ✅ ถ้า path = /mainPage/:id -->
            <!-- real display -->
            <div v-if="isMainPage" v-show="!isShowing"
                class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div v-for="(player, index) in playerListWithFullName" :key="index" class="card bg-base-200 shadow-sm">
                    <div class="card-body p-3 text-center relative">
                        <div class="avatar mx-auto mb-2">
                            <div class="w-14 h-14 rounded-full">
                                <img :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(player.first_name)}&background=random`"
                                    alt="รูปผู้เข้าร่วม" />
                            </div>
                        </div>

                        <div class="text-lg font-bold">{{ player.fullName }}</div>
                        <div class="text-sm text-gray-500">{{ player.position }}</div>
                        <!-- ✅ status circle -->
                        <div class="flex justify-center mt-2">
                            <div class="w-3 h-3 rounded-full"
                                :class="player.is_active === true ? 'bg-green-500' : player.is_active === false ? 'bg-red-500' : 'bg-gray-300'"
                                title="สถานะการเข้าร่วม"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ✅ ถ้า path = /room/:id -->
            <!-- preview excel -->
            <div v-else v-show="!isShowing" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div v-for="(player, index) in players" :key="index" class="card bg-base-200 shadow-sm">
                    <div class="card-body p-3 text-center relative">
                        <div class="avatar mx-auto mb-2">
                            <div class="w-14 h-14 rounded-full">
                                <img :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(player.firstName)}&background=random  `"
                                    alt="รูปผู้เข้าร่วม" />
                            </div>
                        </div>

                        <div class="text-lg font-bold">
                            {{ player.fullName }}
                        </div>
                        <div class="text-sm text-gray-500">{{ player.position }}</div>
                        <div class="flex justify-center mt-2">
                            <div class="w-3 h-3 rounded-full"
                                :class="player.is_active === true ? 'bg-green-500' : player.is_active === false ? 'bg-red-500' : 'bg-gray-300'"
                                title="สถานะการเข้าร่วม"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>