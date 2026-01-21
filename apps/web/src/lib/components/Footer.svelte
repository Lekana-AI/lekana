<script lang="ts">
	import { SignedIn, SignedOut } from 'svelte-clerk';
	import { navState } from '$lib/nav.svelte.js';
</script>

<!-- FOOTER -->
<footer class="mt-14 w-full border-t border-green-950/60 bg-black/95">
	<div class="mx-auto max-w-6xl px-4 py-10 text-sm text-gray-400 md:px-8 md:py-12">
		<div class="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
			<!-- Brand -->
			<div class="max-w-sm space-y-4">
				<p class="text-base font-semibold text-white">Lekana</p>
				<p class="text-xs leading-relaxed text-gray-500 md:text-sm">
					An OCR-powered document intake service for businesses. We read your documents, understand
					them, and route them into your workflow — fully managed, end-to-end.
				</p>
				<!-- Social Links -->
				<div class="flex items-center gap-4 text-gray-500">
					<a
						href="https://instagram.com/lekana.dev"
						target="_blank"
						rel="noopener noreferrer"
						class="transition-colors hover:text-green-500"
						aria-label="Instagram"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
							<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
							<line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
						</svg>
					</a>
					<a
						href="https://tiktok.com/@lekana.dev"
						target="_blank"
						rel="noopener noreferrer"
						class="transition-colors hover:text-green-500"
						aria-label="TikTok"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
						</svg>
					</a>
					<a
						href="https://facebook.com/lekana.dev"
						target="_blank"
						rel="noopener noreferrer"
						class="transition-colors hover:text-green-500"
						aria-label="Facebook"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
						</svg>
					</a>
					<a
						href="https://x.com/lekana.dev"
						target="_blank"
						rel="noopener noreferrer"
						class="transition-colors hover:text-green-500"
						aria-label="X (Twitter)"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M4 4l11.733 16h4.267l-11.733-16z"></path>
							<path d="M4 20l6.768-6.768m2.464-2.464l6.768-6.768"></path>
						</svg>
					</a>
					<a
						href="https://linkedin.com/company/lekana.dev"
						target="_blank"
						rel="noopener noreferrer"
						class="transition-colors hover:text-green-500"
						aria-label="LinkedIn"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path
								d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
							></path>
							<rect width="4" height="12" x="2" y="9"></rect>
							<circle cx="4" cy="4" r="2"></circle>
						</svg>
					</a>
				</div>
			</div>

			<!-- Navigation -->
			<div class="flex flex-1 flex-wrap gap-10 md:justify-end">
				<div class="space-y-3">
					<p class="text-xs font-semibold tracking-wide text-gray-500 uppercase">Product</p>
					<ul class="space-y-2 text-xs md:text-sm">
						<li><a href="#about" class="hover:text-green-500">About</a></li>
						<li><a href="#pricing" class="hover:text-green-500">Pricing</a></li>
						<li><a href="#faq" class="hover:text-green-500">FAQ</a></li>
					</ul>
				</div>
				<div class="space-y-3">
					<p class="text-xs font-semibold tracking-wide text-gray-500 uppercase">Resources</p>
					<ul class="space-y-2 text-xs md:text-sm">
						<li>
							<SignedOut>
								<button
									onclick={() => (navState.showSignInModal = true)}
									class="hover:text-green-500">Try Beta</button
								>
							</SignedOut>
							<SignedIn>
								<a href="/dashboard" class="hover:text-green-500">Dashboard</a>
							</SignedIn>
						</li>
						<li><a href="/docs" class="hover:text-green-500">Documentation</a></li>
					</ul>
				</div>
				<div class="space-y-3">
					<p class="text-xs font-semibold tracking-wide text-gray-500 uppercase">Legal</p>
					<ul class="space-y-2 text-xs md:text-sm">
						<li><a href="/privacy" class="hover:text-green-500">Privacy</a></li>
						<li><a href="/terms" class="hover:text-green-500">Terms</a></li>
					</ul>
				</div>
				<div class="space-y-3">
					<p class="text-xs font-semibold tracking-wide text-gray-500 uppercase">Contact</p>
					<ul class="space-y-2 text-xs md:text-sm">
						<li>
							<a href="mailto:support@lekana.dev" class="hover:text-green-500"> support@lekana.dev </a>
						</li>
					</ul>
				</div>
			</div>
		</div>

		<hr class="mt-8 border-neutral-800" />

		<div
			class="mt-4 flex flex-col items-center justify-between gap-3 text-[11px] text-gray-500 md:flex-row md:text-xs"
		>
			<p>Lekana © {new Date().getFullYear()}. All rights reserved.</p>
			<p class="text-center md:text-right">
				Built for businesses that are done with the chaos of documents.
			</p>
		</div>
	</div>
</footer>
