// src/stores/CarouselStore.ts
import { defineStore } from 'pinia';
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue';
import { usePrizeStore } from './PrizeStore';

export const useCarouselStore = defineStore('carousel', () => {
  const prizeStore = usePrizeStore();
  
  // ตัวแปรสำหรับ Carousel
  const currentSlide = ref(0);
  const windowWidth = ref(0);
  const autoSlideInterval = ref<number | null>(null);
  const autoSlideEnabled = ref(true);

  // จำนวนไอเท็มต่อหน้าจอตามขนาดหน้าจอ
  const itemsPerPage = computed(() => {
    if (windowWidth.value < 768) return 1;
    if (windowWidth.value < 1024) return 2;
    return 4;
  });

  // คำนวณจำนวน slide สูงสุด
  const maxSlide = computed(() => {
    return Math.max(0, Math.ceil(prizeStore.prizes.length / itemsPerPage.value) - 1);
  });

  // ฟังก์ชันเลื่อน carousel
  const moveCarousel = (direction: 'left' | 'right') => {
    if (direction === 'left' && currentSlide.value > 0) {
      currentSlide.value--;
    } else if (direction === 'right' && currentSlide.value < maxSlide.value) {
      currentSlide.value++;
    }

    // รีเซ็ต timer การเลื่อนอัตโนมัติเมื่อมีการเลื่อนด้วยตนเอง
    resetAutoSlide();
  };

  // เลื่อน slide อัตโนมัติ
  const startAutoSlide = () => {
    if (autoSlideEnabled.value && prizeStore.prizes.length > itemsPerPage.value) {
      stopAutoSlide(); // ทำการ clear interval เดิมก่อน

      autoSlideInterval.value = window.setInterval(() => {
        if (currentSlide.value < maxSlide.value) {
          currentSlide.value++;
        } else {
          currentSlide.value = 0; // กลับไปยังสไลด์แรกเมื่อถึงสไลด์สุดท้าย
        }
      }, 5000); // เลื่อนทุก 5 วินาที
    }
  };

  // หยุดการเลื่อน slide อัตโนมัติ
  const stopAutoSlide = () => {
    if (autoSlideInterval.value !== null) {
      clearInterval(autoSlideInterval.value);
      autoSlideInterval.value = null;
    }
  };

  // รีเซ็ตการเลื่อนอัตโนมัติ
  const resetAutoSlide = () => {
    stopAutoSlide();
    startAutoSlide();
  };

  // สลับการเปิด/ปิดการเลื่อนอัตโนมัติ
  const toggleAutoSlide = () => {
    autoSlideEnabled.value = !autoSlideEnabled.value;
    if (autoSlideEnabled.value) {
      startAutoSlide();
    } else {
      stopAutoSlide();
    }
  };

  // ติดตามการเปลี่ยนแปลงขนาดหน้าจอ
  const handleResize = () => {
    windowWidth.value = window.innerWidth;
  };

  // จัดการการเปลี่ยนแปลงของ carousel
  const setupCarousel = () => {
    // กำหนดค่าเริ่มต้นของขนาดหน้าจอ
    if (typeof window !== 'undefined') {
      windowWidth.value = window.innerWidth;
      window.addEventListener('resize', handleResize);
    } else {
      // ค่าเริ่มต้นสำหรับ SSR (Server-Side Rendering)
      windowWidth.value = 1024; // ค่า default สำหรับ desktop
    }

    // เริ่มการเลื่อนอัตโนมัติถ้ามีรางวัลมากกว่าที่แสดงในหน้าจอ
    startAutoSlide();
    
    // ทำความสะอาดเมื่อ component ถูกทำลาย
    onBeforeUnmount(() => {
      stopAutoSlide();
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    });
    
    // เมื่อขนาดหน้าจอเปลี่ยน
    watch(itemsPerPage, () => {
      if (currentSlide.value > maxSlide.value) {
        currentSlide.value = maxSlide.value;
      }
      resetAutoSlide();
    });
    
    // เมื่อจำนวนรางวัลเปลี่ยน
    watch(() => prizeStore.prizes.length, (newLength) => {
      if (currentSlide.value > maxSlide.value) {
        currentSlide.value = Math.max(0, maxSlide.value);
      }
      
      if (newLength > itemsPerPage.value) {
        startAutoSlide();
      } else {
        stopAutoSlide();
      }
    });
  };

  return {
    currentSlide,
    itemsPerPage,
    maxSlide,
    autoSlideEnabled,
    moveCarousel,
    toggleAutoSlide,
    setupCarousel,
    resetAutoSlide
  };
});