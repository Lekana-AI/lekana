import { json } from '@sveltejs/kit';
import { ADMIN_USERNAME, ADMIN_PASSWORD, AUTH_USERNAME, AUTH_PASSWORD } from '$env/static/private';

const BASE_URL = 'https://lekana-ai-waitlist-api-PROJECT_NUMBER.asia-south1.run.app';

async function getToken() {
	const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			username: AUTH_USERNAME,
			password: AUTH_PASSWORD
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
		if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
			return json(
				{ error: 'Unauthorized: Invalid credentials. u-' + ADMIN_PASSWORD + ' p-' + password },
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
