import { json } from '@sveltejs/kit';
import { AUTH_USERNAME, AUTH_PASSWORD } from '$env/static/private';

const BASE_URL = 'https://lekana-ai-waitlist-api-PROJECT_NUMBER.asia-south1.run.app/api';

async function getToken() {
	const loginRes = await fetch(BASE_URL + '/auth/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			username: AUTH_USERNAME,
			password: AUTH_PASSWORD
		})
	});

	if (!loginRes.ok) {
		console.error('Login failed', await loginRes.text());
		throw new Error('Failed to authenticate with waitlist API');
	}

	const loginData = await loginRes.json();
	const token = loginData.token || loginData.accessToken || loginData?.data?.token;

	if (!token) {
		throw new Error('No token returned from login API');
	}

	return token;
}

export async function POST({ request }) {
	try {
		const payload = await request.json();

		const token = await getToken();

		const res = await fetch(BASE_URL + '/waitlist', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify(payload)
		});

		const data = await res.json();

		if (!res.ok) {
			console.error('Waitlist API error:', data);
			return json({ error: data?.error || 'Failed to submit to waitlist' }, { status: res.status });
		}

		return json(data); // success
	} catch (err: any) {
		console.error('Server error submitting waitlist:', err);
		return json({ error: 'Internal server error while submitting to waitlist' }, { status: 500 });
	}
}