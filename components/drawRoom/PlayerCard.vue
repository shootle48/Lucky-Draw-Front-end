    <script lang="ts" setup>
    defineProps(['player', 'index', 'glowingIndexes', 'glowingTempIndex', 'isDrawing'])
    // ✅ สร้าง hash จาก string
    const hashString = (str: string): number => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
            hash |= 0; // แปลงเป็น 32bit int
        }
        return Math.abs(hash);
    };
    const imageCache = new Map<string, string>();
    const getProfileImage = (memberId: string): string => {
        if (imageCache.has(memberId)) return imageCache.get(memberId)!;

        const hash = hashString(memberId);
        const imageIndex = (hash % 10) + 1;
        const imagePath = new URL(`/assets/Image_profile/default_${imageIndex}.png`, import.meta.url).href;

        imageCache.set(memberId, imagePath);
        return imagePath;
    };

    const bgColors = [
        '#F44336', // red
        '#E91E63', // pink
        '#9C27B0', // purple
        '#3F51B5', // indigo
        '#2196F3', // blue
        '#009688', // teal
        '#4CAF50', // green
        '#FF9800', // orange
        '#795548', // brown
        '#607D8B'  // blue gray
    ]

    const getRandomBgColor = (index: number): string => {
        return bgColors[index % bgColors.length]
    }
</script>

<template>
    <div class="card bg-base-200 shadow-sm" :class="{
        'glow': glowingIndexes.includes(player.id),
        'glow-temp': isDrawing && index === glowingTempIndex
    }">
        <div class="absolute top-2 right-2 w-3 h-3 rounded-full shadow"
            :class="player.is_active ? 'bg-green-500' : 'bg-red-500'" title="สถานะการเข้าร่วม"></div>

        <div class="card-body p-3 text-center text-black">
            <div class="avatar mx-auto mb-2">
                <div class="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center text-white text-xl font-bold"
                    :style="{ backgroundColor: getRandomBgColor(index) }">
                    <img :src="getProfileImage(player.member_id ?? '')" class="w-full h-full object-cover"
                        alt="profile" />

                </div>

            </div>
            <div class="text-lg font-bold">{{ player.full_name }}</div>
            <div class="text-sm text-gray-500">{{ player.position }}</div>
        </div>
    </div>
</template>

