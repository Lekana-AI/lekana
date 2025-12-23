
class ToastManager {
    toasts = $state([]);

    add(message, type = 'info', duration = 3000) {
        const toastId = Math.random().toString(36).substring(2, 9);
        const toast = { id: toastId, message, type };
        this.toasts.push(toast);

        if (duration > 0) {
            setTimeout(() => {
                this.remove(toastId);
            }, duration);
        }

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
        this.toasts = this.toasts.filter(t => t.id !== id);
    }
}

export const toast = new ToastManager();
