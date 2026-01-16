<script lang="ts">
	import { X, Users, Shield, Plus, Trash2, UserPlus, ChevronDown, Loader2 } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { toast } from '$lib/toast.svelte';

	let { workflow, onClose } = $props();

	// Role data
	let roles = $state<any[]>([]);
	let loading = $state(true);
	let selectedRole = $state<any>(null);
	let assignments = $state<any[]>([]);

	// Permission data - loaded dynamically from backend
	let availablePermissions = $state<string[]>([]);
	let permissionDescriptions = $state<Record<string, string>>({});
	let permissionsLoading = $state(true);
	let permissionsError = $state(false);

	// New role form
	let showNewRoleForm = $state(false);
	let newRoleName = $state('');
	let newRoleDescription = $state('');
	let newRolePermissions = $state<string[]>([]);

	// New assignment form
	let showAssignForm = $state(false);
	let assignUserEmail = $state('');

	// Loading states for actions
	let creatingRole = $state(false);
	let deletingRoleId = $state<string | null>(null);
	let assigningUser = $state(false);
	let revokingAssignmentId = $state<string | null>(null);

	onMount(async () => {
		await Promise.all([loadRoles(), loadPermissions()]);
	});

	async function loadPermissions() {
		permissionsLoading = true;
		permissionsError = false;
		try {
			const res = await fetch('/api/permissions/available');
			if (res.ok) {
				const data = await res.json();
				availablePermissions = data.permissions || [];
				permissionDescriptions = data.descriptions || {};
			} else {
				console.error('Failed to load permissions:', res.status);
				permissionsError = true;
				availablePermissions = [];
				permissionDescriptions = {};
			}
		} catch (error) {
			console.error('Error loading permissions:', error);
			toast.error('Failed to load permissions. Please try again in a moment.');
			permissionsError = true;
			availablePermissions = [];
			permissionDescriptions = {};
		}
		permissionsLoading = false;
	}

	async function loadRoles() {
		loading = true;
		try {
			const res = await fetch(`/api/workflows/${workflow.id}/roles`);
			if (res.ok) {
				roles = await res.json();
			}
		} catch (error) {
			console.error('Error loading roles:', error);
			toast.error('Failed to load roles');
		}
		loading = false;
	}

	async function loadAssignments(roleId: string) {
		try {
			const res = await fetch(`/api/workflows/${workflow.id}/roles/${roleId}/assignments`);
			if (res.ok) {
				assignments = await res.json();
			}
		} catch (error) {
			console.error('Error loading assignments:', error);
			toast.error('Failed to load assignments. Please try again in a moment.');
		}
	}

	async function createRole() {
		if (!newRoleName.trim() || creatingRole) return;

		creatingRole = true;
		try {
			const res = await fetch(`/api/workflows/${workflow.id}/roles`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: newRoleName,
					description: newRoleDescription,
					permissions: newRolePermissions
				})
			});

			if (res.ok) {
				toast.success('Role created');
				newRoleName = '';
				newRoleDescription = '';
				newRolePermissions = [];
				showNewRoleForm = false;
				await loadRoles();
			} else {
				const data = await res.json();
				toast.error(data.error || 'Failed to create role');
			}
		} catch (error) {
			console.error('Error creating role:', error);
			toast.error('Failed to create role');
		} finally {
			creatingRole = false;
		}
	}

	async function deleteRole(roleId: string) {
		if (deletingRoleId) return;

		deletingRoleId = roleId;
		try {
			const res = await fetch(`/api/workflows/${workflow.id}/roles/${roleId}`, {
				method: 'DELETE'
			});

			if (res.ok) {
				toast.success('Role deleted');
				if (selectedRole?.id === roleId) {
					selectedRole = null;
					assignments = [];
				}
				await loadRoles();
			} else {
				const data = await res.json();
				toast.error(data.error || 'Failed to delete role');
			}
		} catch (error) {
			console.error('Error deleting role:', error);
			toast.error('Failed to delete role');
		} finally {
			deletingRoleId = null;
		}
	}

	async function assignUser() {
		if (!selectedRole || !assignUserEmail.trim() || assigningUser) return;

		// Basic email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(assignUserEmail)) {
			toast.error('Please enter a valid email address');
			return;
		}

		assigningUser = true;
		try {
			const res = await fetch(
				`/api/workflows/${workflow.id}/roles/${selectedRole.id}/assignments`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ userEmail: assignUserEmail })
				}
			);

			if (res.ok) {
				const data = await res.json();
				if (data.isPending) {
					toast.success('Invitation sent - user will receive access when they sign up');
				} else {
					toast.success('User assigned successfully');
				}
				assignUserEmail = '';
				showAssignForm = false;
				await loadAssignments(selectedRole.id);
			} else {
				const data = await res.json();
				toast.error(data.error || 'Failed to assign user');
			}
		} catch (error) {
			console.error('Error assigning user:', error);
			toast.error('Failed to assign user');
		} finally {
			assigningUser = false;
		}
	}

	async function revokeAssignment(assignmentId: string) {
		if (!selectedRole || revokingAssignmentId) return;

		revokingAssignmentId = assignmentId;
		try {
			const res = await fetch(
				`/api/workflows/${workflow.id}/roles/${selectedRole.id}/assignments/${assignmentId}`,
				{ method: 'DELETE' }
			);

			if (res.ok) {
				toast.success('Assignment revoked');
				await loadAssignments(selectedRole.id);
			} else {
				toast.error('Failed to revoke assignment');
			}
		} catch (error) {
			console.error('Error revoking assignment:', error);
			toast.error('Failed to revoke assignment');
		} finally {
			revokingAssignmentId = null;
		}
	}

	function selectRole(role: any) {
		selectedRole = role;
		loadAssignments(role.id);
	}

	function togglePermission(perm: string) {
		if (newRolePermissions.includes(perm)) {
			newRolePermissions = newRolePermissions.filter((p) => p !== perm);
		} else {
			newRolePermissions = [...newRolePermissions, perm];
		}
	}
</script>

<main
	class="absolute inset-0 z-100 flex min-h-screen w-screen items-center justify-center overflow-clip bg-black/40 px-4 py-10 backdrop-blur-sm"
>
	<div class="z-10 flex h-full max-h-[80vh] w-full max-w-4xl flex-col justify-start gap-4">
		<div class="flex w-full flex-col rounded-2xl border border-white/5 bg-zinc-900 shadow-2xl">
			<!-- Header -->
			<div class="flex items-center justify-between border-b border-white/5 p-6">
				<div class="flex items-center gap-3">
					<Shield class="h-6 w-6 text-green-400" />
					<div>
						<h1 class="text-xl font-semibold text-white">Role Management</h1>
						<p class="text-xs text-zinc-400">Manage roles and user assignments for this workflow</p>
					</div>
				</div>
				<button
					onclick={onClose}
					class="rounded-full p-2 text-zinc-500 transition-colors hover:bg-white/5 hover:text-white"
				>
					<X class="h-4 w-4" />
				</button>
			</div>

			<div class="flex flex-1 overflow-hidden">
				<!-- Roles List -->
				<div class="w-1/3 border-r border-white/5 p-4">
					<div class="mb-4 flex items-center justify-between">
						<span class="text-xs font-bold tracking-wider text-zinc-500 uppercase">Roles</span>
						<button
							onclick={() => (showNewRoleForm = !showNewRoleForm)}
							class="rounded-lg p-1.5 text-green-400 transition-colors hover:bg-green-500/20"
						>
							<Plus class="h-4 w-4" />
						</button>
					</div>

					{#if loading}
						<div class="py-4 text-center text-sm text-zinc-500">Loading...</div>
					{:else}
						<div class="space-y-2">
							{#each roles as role}
								<button
									onclick={() => selectRole(role)}
									class="flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors
									{selectedRole?.id === role.id
										? 'border border-green-500/50 bg-green-500/10'
										: 'border border-white/5 bg-white/5 hover:bg-white/10'}"
								>
									<div>
										<span class="block text-sm font-medium text-white">{role.name}</span>
										<span class="block text-xs text-zinc-400"
											>{role._count?.assignments || 0} users</span
										>
									</div>
									{#if role.isSystem}
										<span class="rounded bg-zinc-700 px-2 py-0.5 text-[10px] text-zinc-300"
											>SYSTEM</span
										>
									{:else}
										<button
											onclick={(e) => {
												e.stopPropagation();
												deleteRole(role.id);
											}}
											disabled={deletingRoleId === role.id}
											class="rounded p-1 text-red-400 hover:bg-red-500/20 disabled:opacity-50"
										>
											{#if deletingRoleId === role.id}
												<Loader2 class="h-3.5 w-3.5 animate-spin" />
											{:else}
												<Trash2 class="h-3.5 w-3.5" />
											{/if}
										</button>
									{/if}
								</button>
							{/each}
						</div>
					{/if}

					<!-- New Role Form -->
					{#if showNewRoleForm}
						<div class="mt-4 space-y-3 rounded-xl border border-white/10 bg-zinc-950 p-4">
							<input
								type="text"
								bind:value={newRoleName}
								placeholder="Role name"
								class="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-green-500/50 focus:outline-none"
							/>
							<input
								type="text"
								bind:value={newRoleDescription}
								placeholder="Description (optional)"
								class="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-green-500/50 focus:outline-none"
							/>
							<div class="space-y-1">
								<span class="text-[10px] font-bold tracking-wider text-zinc-500 uppercase"
									>Permissions</span
								>
								{#if permissionsLoading}
									<div class="flex items-center gap-2 py-2 text-xs text-zinc-500">
										<Loader2 class="h-3 w-3 animate-spin" />
										Loading permissions...
									</div>
								{:else if permissionsError}
									<div class="py-2 text-xs text-red-400">
										Failed to load permissions. <button onclick={loadPermissions} class="underline"
											>Retry</button
										>
									</div>
								{:else if availablePermissions.length === 0}
									<div class="py-2 text-xs text-zinc-500">No permissions available</div>
								{:else}
									<div class="grid grid-cols-2 gap-1">
										{#each availablePermissions as perm}
											<label
												class="flex cursor-pointer items-center gap-2 rounded-md p-1.5 hover:bg-white/5"
											>
												<input
													type="checkbox"
													checked={newRolePermissions.includes(perm)}
													onchange={() => togglePermission(perm)}
													class="h-3 w-3 accent-green-500"
												/>
												<span class="text-[10px] text-zinc-300">{permissionDescriptions[perm]}</span
												>
											</label>
										{/each}
									</div>
								{/if}
							</div>
							<div class="flex gap-2">
								<button
									onclick={() => (showNewRoleForm = false)}
									class="flex-1 rounded-lg border border-white/10 py-2 text-xs text-zinc-400 hover:bg-white/5"
								>
									Cancel
								</button>
								<button
									onclick={createRole}
									disabled={creatingRole}
									class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 py-2 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
								>
									{#if creatingRole}
										<Loader2 class="h-3.5 w-3.5 animate-spin" />
										Creating...
									{:else}
										Create
									{/if}
								</button>
							</div>
						</div>
					{/if}
				</div>

				<!-- Role Details / Assignments -->
				<div class="flex-1 overflow-y-auto p-4">
					{#if selectedRole}
						<div class="space-y-6">
							<!-- Role Info -->
							<div>
								<h3 class="text-lg font-semibold text-white">{selectedRole.name}</h3>
								<p class="text-sm text-zinc-400">{selectedRole.description || 'No description'}</p>
							</div>

							<!-- Permissions -->
							<div>
								<span class="text-xs font-bold tracking-wider text-zinc-500 uppercase"
									>Permissions</span
								>
								<div class="mt-2 flex flex-wrap gap-2">
									{#each selectedRole.permissions as perm}
										<span class="rounded-md bg-green-500/20 px-2 py-1 text-xs text-green-300">
											{permissionDescriptions[perm] || perm}
										</span>
									{/each}
								</div>
							</div>

							<!-- Assignments -->
							<div>
								<div class="mb-3 flex items-center justify-between">
									<span class="text-xs font-bold tracking-wider text-zinc-500 uppercase"
										>Assigned Users</span
									>
									<button
										onclick={() => (showAssignForm = !showAssignForm)}
										class="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
									>
										<UserPlus class="h-3.5 w-3.5" />
										Assign User
									</button>
								</div>

								{#if showAssignForm}
									<div class="mb-4 space-y-3 rounded-xl border border-white/10 bg-zinc-950 p-4">
										<div>
											<label class="text-xs text-zinc-400">Email Address</label>
											<input
												type="email"
												bind:value={assignUserEmail}
												placeholder="user@example.com"
												class="mt-1 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-green-500/50 focus:outline-none"
											/>
											<p class="mt-1 text-[10px] text-zinc-500">
												User will receive access when they sign up with this email
											</p>
										</div>
										<div class="flex gap-2">
											<button
												onclick={() => (showAssignForm = false)}
												class="flex-1 rounded-lg border border-white/10 py-2 text-xs text-zinc-400 hover:bg-white/5"
											>
												Cancel
											</button>
											<button
												onclick={assignUser}
												disabled={assigningUser}
												class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 py-2 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
											>
												{#if assigningUser}
													<Loader2 class="h-3.5 w-3.5 animate-spin" />
													Assigning...
												{:else}
													Assign
												{/if}
											</button>
										</div>
									</div>
								{/if}

								<div class="space-y-2">
									{#each assignments as assignment}
										<div
											class="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 p-3"
										>
											<div class="flex items-center gap-2">
												<div>
													<span class="block text-sm text-white">{assignment.userEmail}</span>
													{#if assignment.userId.startsWith('pending_')}
														<span class="text-[10px] text-yellow-400">Pending signup</span>
													{:else}
														<span class="text-[10px] text-green-400">Active</span>
													{/if}
												</div>
											</div>
											<button
												onclick={() => revokeAssignment(assignment.id)}
												disabled={revokingAssignmentId === assignment.id}
												class="rounded p-1.5 text-red-400 hover:bg-red-500/20 disabled:opacity-50"
											>
												{#if revokingAssignmentId === assignment.id}
													<Loader2 class="h-3.5 w-3.5 animate-spin" />
												{:else}
													<Trash2 class="h-3.5 w-3.5" />
												{/if}
											</button>
										</div>
									{:else}
										<p class="text-center text-sm text-zinc-500">No users assigned</p>
									{/each}
								</div>
							</div>
						</div>
					{:else}
						<div class="flex h-full items-center justify-center">
							<p class="text-sm text-zinc-500">Select a role to view details</p>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</main>
