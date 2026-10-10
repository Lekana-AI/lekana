type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
    private formatMessage(level: LogLevel, message: string, data?: any): string {
        const timestamp = new Date().toISOString();
        const logData = data ? ` | ${JSON.stringify(data)}` : '';
        return `[${timestamp}] [${level.toUpperCase()}] ${message}${logData}`;
    }

    public info(message: string, data?: any): void {
        console.log(this.formatMessage('info', message, data));
    }

    public warn(message: string, data?: any): void {
        console.warn(this.formatMessage('warn', message, data));
    }

    public error(message: string, error?: any): void {
        const errorData = error instanceof Error
            ? { message: error.message, stack: error.stack }
            : error;
        console.error(this.formatMessage('error', message, errorData));
    }

    public debug(message: string, data?: any): void {
        if (process.env.NODE_ENV === 'development') {
            console.debug(this.formatMessage('debug', message, data));
        }
    }
}

export const logger = new Logger();
