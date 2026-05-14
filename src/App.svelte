<script lang="ts">
	import './app.css';
	import {onMount} from "svelte";
	import BackgroundVideo from "./components/BackgroundVideo.svelte";
	import {Avatar, AvatarFallback, AvatarImage} from "./components/ui/avatar";
	import {Button, buttonVariants} from "./components/ui/button";
	import * as DropdownMenu from "./components/ui/dropdown-menu/";
    import SteamLogin from "./components/SteamLogin.svelte";
    import MoreVertical from "@lucide/svelte/icons/more-vertical";
    import {authState, clearAuthState} from "./lib/store/token";
    import {profileState, setProfileState} from "./lib/store/profile";

    const API_SERVER = import.meta.env.VITE_API_SERVER;

    const DEFAULT_AVATAR = "https://avatars.cdn.steamchina.queniuam.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg";

    let isLoadingProfile = $state(true);

    window.addEventListener("message", function (event) {
        const token = event.data.token;
        isLoadingProfile = true;
        if (token) {
            authState.set(token);
            void setProfileState(token).then(profile => {

            }).finally(() => {
                isLoadingProfile = false;
            });
        }
    });

    const login = () => {
        const windowKey = 'LoginWindow'
        const loginWindow = window.open(`${API_SERVER}/auth/steam/redirect_to_steam`, windowKey, 'popup=true');
        if (!loginWindow) {
            return alert('登录弹窗被阻拦，请检查你的浏览器...')
        }
    }

    const logout = () => {
        isLoadingProfile = true;

        const removeStates = async ()  => {
            clearAuthState();
            void setProfileState(null);
        };

        removeStates().finally(() => {
            isLoadingProfile = false;
        });
    };

    onMount(() => {
        const init = async () => {
            const token = $authState;
            const profile = await setProfileState(token);
        };

        void init().finally(() => {
            isLoadingProfile = false;
        });
    });
</script>


<BackgroundVideo/>

<main class="
	w-100
  	flex flex-col items-center p-4 space-y-4
  	backdrop-blur-md border rounded-xl shadow-lg
  	bg-white/20 border-white/20
  	dark:bg-black/40 dark:border-white/10 dark:shadow-2xl
">
    <div class="flex items-center gap-4 p-4 justify-around">

        <Avatar class="size-13 rounded-full ring-2 ring-white/50">
            {#if isLoadingProfile}
                <AvatarFallback class="profile-skeleton"/>
            {:else}
                <AvatarImage src={$profileState?.avatarLink ?? DEFAULT_AVATAR} alt={$profileState?.name}/>
            {/if}
        </Avatar>

        <div class="space-y-1 flex-1">
            {#if isLoadingProfile}
                <div class="profile-skeleton h-5 w-28 rounded"></div>
                <div class="profile-skeleton h-4 w-36 rounded"></div>
            {:else if $profileState}
                <p class="text-base font-sans font-semibold text-slate-900 tracking-tight dark:text-white/90">
                    {$profileState.name}
                </p>
                <p class="text-sm font-mono font-medium text-slate-600/80 tracking-tighter dark:text-white/50">
                    {$profileState.steamID64}
                </p>
            {:else}
                <p class="text-base font-sans font-semibold text-slate-900 tracking-tight dark:text-white/90">
                    未登录
                </p>
                <p class="text-sm font-mono font-medium text-slate-600/80 tracking-tighter dark:text-white/50">
                    请使用 Steam 登录
                </p>
            {/if}
        </div>

        {#if $profileState && !isLoadingProfile}
            <DropdownMenu.Root>
                <DropdownMenu.Trigger
                        class={buttonVariants({ variant: "ghost", size: "icon", class: 'rounded-full' })}
                >
                    <MoreVertical />
                </DropdownMenu.Trigger>
                <DropdownMenu.Content class="w-40 bg-white/30 backdrop-blur-md" align="end">
                    <DropdownMenu.Label>操作</DropdownMenu.Label>
                    <DropdownMenu.Group>
                        <DropdownMenu.Item class="hover:bg-white/50 transition-all" onclick={() => logout()}>
                            退出登录
                        </DropdownMenu.Item>
                    </DropdownMenu.Group>
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        {/if}
    </div>

    {#if isLoadingProfile}
        <Button variant="outline" disabled>
            <span class="loading-dot"></span>
            加载中
        </Button>
    {:else if $profileState}
        <Button variant="outline">进入平台</Button>
    {:else}
        <SteamLogin onclick={login}/>
    {/if}
</main>


<style>
	@reference "tailwindcss";

    main {
        @apply w-100;
    }

    .profile-skeleton {
        @apply animate-pulse bg-white/50 dark:bg-white/20;
    }

    .loading-dot {
        @apply size-4 animate-spin rounded-full border-2 border-slate-500/40 border-t-slate-900 dark:border-white/30 dark:border-t-white;
    }

    main :global(> *:not(img)) {
        @apply rounded-md w-full border transition-all;
        /* 浅色模式颜色 */
        @apply border-white/30 bg-white/30 hover:bg-white/50;
    }
</style>
