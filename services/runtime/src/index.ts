import 'dotenv/config';
import app from './app';

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    console.log(`Runtime service running on port ${PORT}`);
    console.log(`Clerk Domain: ${process.env.CLERK_DOMAIN || 'not configured'}`);
});
