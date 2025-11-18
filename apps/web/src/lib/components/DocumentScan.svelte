<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	// @ts-ignore
	let document: HTMLDivElement;

	let x = 0,
		y = 0,
		width = 0,
		height = 0;

	let pctX = 0,
		pctY = 0;

	// Active region (driven by the autoplay, not the mouse)
	type Region = {
		title: string;
		text: string;
		x: [number, number]; // percentages
		y: [number, number]; // percentages
		highlightWord?: string;
	};

	const REGIONS: Region[] = [
		{
			title: 'Form Number',
			text: 'Form Number: CA 530082',
			highlightWord: '530082',
			x: [56, 99],
			y: [2, 6]
		},
		{
			title: 'Plan Year Dates',
			text: 'Plan year beginning 01/01/2023 and ending 01/02/2023.',
			highlightWord: '01/01/2023',
			x: [61, 100],
			y: [16, 19]
		},
		{
			title: 'Name of Plan',
			text: 'Name of plan: Annual Return Plan',
			highlightWord: 'Annual',
			x: [9, 46],
			y: [32, 37]
		},
		{
			title: 'Plan Number',
			text: 'Three-digit plan number: 586',
			highlightWord: '586',
			x: [69, 94],
			y: [31, 35]
		},
		{
			title: 'Date Plan Became Effective',
			text: 'Date plan first became effective: 02/05/2022',
			highlightWord: '02/05/2022',
			x: [69, 91],
			y: [35, 40]
		},
		{
			title: 'Employer’s Name',
			text: 'Employer’s name: Acme Corp Software',
			highlightWord: 'Acme',
			x: [10, 55],
			y: [39, 43]
		},
		{
			title: 'Employer EIN',
			text: 'Employer Identification Number: 753268329',
			highlightWord: '753268329',
			x: [69, 95],
			y: [40, 44]
		},
		{
			title: 'Employer Telephone',
			text: 'Employer’s telephone number: 011536259',
			highlightWord: '011536259',
			x: [69, 91],
			y: [44, 47]
		},
		{
			title: 'Employer Address',
			text: 'Employer address: 235 Park Street Avenue FL, FL 63052',
			highlightWord: '63052',
			x: [10, 54],
			y: [49, 56]
		},
		{
			title: 'Administrator EIN',
			text: 'Administrator’s EIN: 532678',
			highlightWord: '532678',
			x: [69, 96],
			y: [55, 58]
		},
		{
			title: 'Administrator Name',
			text: 'Plan administrator: Same as employer (Not provided)',
			highlightWord: 'Same',
			x: [10, 53],
			y: [55, 58]
		},
		{
			title: 'Prior EIN',
			text: 'Prior EIN: 5732900',
			highlightWord: '5732900',
			x: [76, 96],
			y: [72, 75]
		},
		{
			title: 'Terminated Participants',
			text: 'Participants who terminated during the year with vested benefits: 2',
			highlightWord: '2',
			x: [73, 87],
			y: [85, 88]
		},
		{
			title: 'Plan Assets Beginning',
			text: 'Total plan assets at beginning of year: 50000',
			highlightWord: '50000',
			x: [65, 80],
			y: [91, 93]
		},
		{
			title: 'Plan Assets End',
			text: 'Total plan assets at end of year: 60000',
			highlightWord: '60000',
			x: [81, 92],
			y: [91, 93]
		},
		{
			title: 'Plan Liabilities Beginning',
			text: 'Total plan liabilities at beginning of year: 4000',
			highlightWord: '4000',
			x: [66, 77],
			y: [93, 85]
		},
		{
			title: 'Plan Liabilities End',
			text: 'Total plan liabilities at end of year: 5000',
			highlightWord: '5000',
			x: [83, 92],
			y: [93, 94]
		}
	];

	let activeRegion: Region | null = null;

	// Mask geometry (in px)
	let maskWidth = 0,
		maskHeight = 0,
		maskX = 0,
		maskY = 0;

	// Animation progress 0 → 1 (controls width)
	let maskProgress = 0;
	$: animatedMaskWidth = maskWidth * maskProgress;

	// Typewriter text
	let displayedText = '';

	let rect: DOMRect;
	function initRect() {
		if (!document) return;
		rect = document.getBoundingClientRect();
		width = rect.width;
		height = rect.height;
	}

	function updateMask() {
		if (!activeRegion || !width || !height) return;
		maskWidth = ((activeRegion.x[1] - activeRegion.x[0]) / 100) * width;
		maskHeight = ((activeRegion.y[1] - activeRegion.y[0]) / 100) * height;
		maskX = (activeRegion.x[0] / 100) * width;
		maskY = (activeRegion.y[0] / 100) * height;
	}

	function setActiveRegion(region: Region | null) {
		if (width === 0 || height === 0) {
			initRect();
		}
		activeRegion = region;
		updateMask();
	}

	// ===== Autoplay loop =====

	let running = true;

	function wait(ms: number) {
		return new Promise<void>((resolve) => setTimeout(resolve, ms));
	}

	function animateMask(duration = 700) {
		return new Promise<void>((resolve) => {
			const start = performance.now();
			function frame(now: number) {
				if (!running) return resolve();
				const elapsed = now - start;
				maskProgress = Math.min(1, elapsed / duration);
				if (elapsed < duration) {
					requestAnimationFrame(frame);
				} else {
					maskProgress = 1;
					resolve();
				}
			}
			requestAnimationFrame(frame);
		});
	}

	function typeText(text: string, delay = 25) {
		return new Promise<void>((resolve) => {
			displayedText = '';
			if (!text.length) return resolve();

			let i = 0;
			function step() {
				if (!running) return resolve();
				displayedText += text[i];
				i += 1;
				if (i < text.length) {
					setTimeout(step, delay);
				} else {
					resolve();
				}
			}
			step();
		});
	}

	async function runTour() {
		let index = 0;
		while (running && REGIONS.length) {
			const region = REGIONS[index];
			setActiveRegion(region);
			maskProgress = 0;

			// 1) Reveal green highlight
			await animateMask(1400);

			// 2) Type text for this region
			await typeText(region.text, 20);

			// 3) Pause while fully shown
			await wait(1500);

			// 4) Clear and move on
			displayedText = '';
			maskProgress = 0;
			await wait(400);

			index = (index + 1) % REGIONS.length;
		}
	}

	onMount(() => {
		initRect();
		runTour();

		// update size on resize (optional but nice)
		const onResize = () => {
			initRect();
			updateMask();
		};
		window.addEventListener('resize', onResize);

		return () => {
			window.removeEventListener('resize', onResize);
		};
	});

	onDestroy(() => {
		running = false;
	});
</script>

<section
	class="flex h-full w-full flex-col items-center justify-center gap-4 md:gap-8 py-10 md:max-w-6xl md:flex-row"
>
	<!-- Image + green highlight -->
	<div class=" rounded-xl bg-black p-3 py-6 shadow-lg md:p-6 md:py-12">
		<div
			role="main"
			class="relative inline-block w-full max-w-xl overflow-hidden rounded-lg shadow-md"
			bind:this={document}
		>
			<!-- Base image -->
			<img
				src="/mock-document1.png"
				alt="Document"
				class="block h-full w-full object-contain"
				draggable="false"
			/>

			<!-- Green highlight overlay using SVG mask -->
			<svg
				class="pointer-events-none absolute inset-0 z-20"
				width="100%"
				height="100%"
				viewBox={`0 0 ${width || 1} ${height || 1}`}
				preserveAspectRatio="none"
				aria-hidden="true"
			>
				<defs>
					<filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
						<feGaussianBlur stdDeviation="12" result="blur" />
						<feMerge>
							<feMergeNode in="blur" />
							<feMergeNode in="SourceGraphic" />
						</feMerge>
					</filter>
					<mask id="greenMask" maskUnits="userSpaceOnUse" x="0" y="0" {width} {height}>
						<!-- Everything hidden by default -->
						<rect x="0" y="0" {width} {height} fill="black" />
						<!-- Highlight area revealed; width is animatedMaskWidth -->
						{#if activeRegion}
							<rect
								transform={`translate(${maskX}, ${maskY})`}
								width={animatedMaskWidth}
								height={maskHeight}
								rx="6"
								ry="6"
								fill="white"
								opacity={maskProgress > 0 ? 1 : 0}
								filter="url(#softGlow)"
							/>
						{/if}
					</mask>
				</defs>

				<!-- Green rectangle; mask cuts it to just the active region -->
				<rect x="0" y="0" {width} {height} fill="rgba(34,197,94,0.45)" mask="url(#greenMask)" />
			</svg>
		</div>
	</div>
	<!-- Result Box -->
	<div
		class="font- mt-1 flex w-full max-w-xl items-start justify-start gap-5 rounded-xl bg-neutral-950 p-6 px-12 shadow-lg md:mt-4"
	>
		<div class="min-w-0 {!displayedText ? 'animate-pulse' : ''}">
			<h3 class="mb-2 text-left text-sm font-semibold md:text-lg">
				{activeRegion ? activeRegion.title : 'Reading document…'}
			</h3>

			<p class="text-left text-xs text-gray-300 md:py-4 md:text-sm">
				{#if displayedText && activeRegion}
					{#each displayedText.split(' ') as word, i (i)}
						<span
							class:text-emerald-600={activeRegion.highlightWord &&
								word.replace(/[.,;:!?]/g, '') === activeRegion.highlightWord}
						>
							{word}{i < displayedText.split(' ').length - 1 ? ' ' : ''}
						</span>
					{/each}
				{:else}
					<span class="text-gray-400">Scanning next field…</span>
				{/if}
			</p>
		</div>
	</div>
</section>
