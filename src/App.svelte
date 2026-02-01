<script lang="ts">
	import './app.css';
	import BackgroundVideo from "./components/BackgroundVideo.svelte";
	import {Avatar, AvatarImage} from "./components/ui/avatar";
	import {Button, buttonVariants} from "./components/ui/button";
    import * as DropdownMenu from "./components/ui/dropdown-menu/";
    import SteamLogin from "./components/SteamLogin.svelte";
    import MoreVertical from "@lucide/svelte/icons/more-vertical";

    const API_SERVER  = import.meta.env.VITE_API_SERVER

    let isLoggedIn = $state(true);

    let nickname = $derived(isLoggedIn ? '用户123456' : '未登录')
    let steamId64 = $derived(isLoggedIn ? '1234567890' : '')

    const login = () => {
        const windowKey = 'LoginWindow'
        const loginWindow = window.open(`${API_SERVER}/auth/steam/redirect_to_steam`, windowKey, 'popup=true');
        if (!loginWindow) {
            return alert('登录弹窗被阻拦，请检查你的浏览器...')
        }
    }

    const logout = () => {
        isLoggedIn = false;
    }
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
            <AvatarImage
                    src="https://avatars.cdn.steamchina.queniuam.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg"/>
        </Avatar>

        <div class="space-y-1 flex-1">
            <p class="text-base font-sans font-semibold text-slate-900 tracking-tight dark:text-white/90">
                {nickname}
            </p>
            <p class="text-sm font-mono font-medium text-slate-600/80 tracking-tighter dark:text-white/50">
                {steamId64}
            </p>
        </div>

        {#if isLoggedIn}
            <DropdownMenu.Root>
                <DropdownMenu.Trigger
                        class={buttonVariants({ variant: "ghost", size: "icon", class: 'rounded-full' })}
                >
                    <MoreVertical />
                </DropdownMenu.Trigger>
                <DropdownMenu.Content class="w-40  bg-white/30  backdrop-blur-md" align="end">
                    <DropdownMenu.Label>操作</DropdownMenu.Label>
                    <DropdownMenu.Group>
                        <DropdownMenu.Item class="hover:bg-white/50 transition-all" onclick={logout}>
                            退出登录
                        </DropdownMenu.Item>
                    </DropdownMenu.Group>
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        {/if}
    </div>

    {#if isLoggedIn}
        <Button variant="outline">进入平台</Button>
    {:else}
        <SteamLogin onclick={login}/>
    {/if}
</main>


<style>
	@reference "tailwindcss";

    main :global(> *:not(img)) {
        @apply rounded-md w-full border border-white/30 bg-white/30 hover:bg-white/50 transition-all;
    }
</style>
