
class ToastManager {
    toasts = $state([]);

    add(message, type = 'info', duration = 3000) {
        const existingToast = this.toasts.find(t => t.message === message && t.type === type);

        if (existingToast) {
            existingToast.count = (existingToast.count || 1) + 1;

            // Allow reactivity to trigger update if needed (shallow mutation might be fine in Svelte 5 proxies, 
            // but just in case we can re-assign or let fine-grained reactivity handle it)
            // Svelte 5 $state proxies should handle deep mutation of objects in arrays fine.

            if (existingToast.timeoutId) {
                clearTimeout(existingToast.timeoutId);
            }

            if (duration > 0) {
                existingToast.timeoutId = setTimeout(() => {
                    this.remove(existingToast.id);
                }, duration);
            }
            return existingToast.id;
        }

        const toastId = Math.random().toString(36).substring(2, 9);
        const toast = { id: toastId, message, type, count: 1 };

        if (duration > 0) {
            toast.timeoutId = setTimeout(() => {
                this.remove(toastId);
            }, duration);
        }

        this.toasts.push(toast);

        return toastId;
    }

    success(message, duration) {
        return this.add(message, 'success', duration);
    }

    error(message, duration) {
        return this.add(message, 'error', duration);
    }

    info(message, duration) {
        return this.add(message, 'info', duration);
    }

    remove(id) {
        const toastToRemove = this.toasts.find(t => t.id === id);
        if (toastToRemove && toastToRemove.timeoutId) {
            clearTimeout(toastToRemove.timeoutId);
        }
        this.toasts = this.toasts.filter(t => t.id !== id);
    }
}

export const toast = new ToastManager();
