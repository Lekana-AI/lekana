class ConfirmManager {
    state = $state({
        isOpen: false,
        title: '',
        message: '',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        resolve: (value) => { },
        type: 'confirm' // 'confirm' or 'alert'
    });

    ask({ title, message, confirmText = 'Confirm', cancelText = 'Cancel', type = 'confirm' }) {
        this.state.isOpen = true;
        this.state.title = title;
        this.state.message = message;
        this.state.confirmText = confirmText;
        this.state.cancelText = cancelText;
        this.state.type = type;

        return new Promise((resolve) => {
            this.state.resolve = resolve;
        });
    }

    alert(message, title = 'Alert') {
        return this.ask({ title, message, type: 'alert', confirmText: 'OK' });
    }

    confirm(message, title = 'Confirm') {
        return this.ask({ title, message, type: 'confirm' });
    }

    close(result) {
        this.state.isOpen = false;
        if (this.state.resolve) {
            this.state.resolve(result);
        }
    }
}

export const confirmStore = new ConfirmManager();
