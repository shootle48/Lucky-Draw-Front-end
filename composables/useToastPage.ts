// composables/useToastPage.ts
let toastInstance: ReturnType<typeof createToast> | null = null;

function createToast() {
  const showToast = (
    message: string,
    type: "alert-success" | "alert-error" | "alert-warning"
  ) => {
    const iconKey = type.replace("alert-", "");
    const iconMap: Record<string, string> = {
      success: `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>`,
      error: `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>`,
      warning: `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>`,
    };
    const icon = iconMap[iconKey];

    const toast = document.createElement("div");
    toast.setAttribute("role", "alert");
    toast.className = `alert ${type} shadow-lg mb-2 p-4 min-w-65`;

    toast.innerHTML = `
        ${icon}
        <span>${message}</span>
    `;

    document.querySelector(".toast")?.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  };

  return { showToast };
}

export const getToast = () => {
  if (!toastInstance) toastInstance = createToast();
  return toastInstance;
};
