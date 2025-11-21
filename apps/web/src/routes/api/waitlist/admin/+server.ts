import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
const auth_username = env.AUTH_USERNAME;
const auth_password = env.AUTH_PASSWORD;
const admin_username = env.ADMIN_USERNAME;
const admin_password = env.ADMIN_PASSWORD;


const BASE_URL = 'https://lekana-ai-waitlist-api-PROJECT_NUMBER.asia-south1.run.app';

async function getToken() {
	const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			username: auth_username,
			password: auth_password
		})
	});

	if (!loginRes.ok) {
		throw new Error('Failed to authenticate');
	}

	const data = await loginRes.json();
	return data.token;
}

export async function POST({ request }) {
	try {
		// 1. Get username & password from POST body
		const { username, password } = await request.json();

		// 2. Validate credentials
		if (username !== admin_username || password !== admin_password) {
			return json(
				{ error: 'Unauthorized: Invalid credentials. u-' + admin_password + ' p-' + password },
				{ status: 401 }
			);
		}

		// 3. Get backend token
		const token = await getToken();

		// 4. Fetch the waitlist data
		const res = await fetch(`${BASE_URL}/api/waitlist`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`
			}
		});

		const data = await res.json();

		if (!res.ok) {
			return json(
				{ error: data?.message || 'Failed to fetch waitlist' },
				{ status: res.status }
			);
		}

		return json(data);
	} catch (err) {
		console.error('Admin waitlist POST error:', err);
		return json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
