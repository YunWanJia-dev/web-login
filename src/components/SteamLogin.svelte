<script>
    let props = $props();
</script>

<img {...props} src="https://community.fastly.steamstatic.com/public/images/signinthroughsteam/sits_01.png" width="180" height="36" alt="">

<style>
    @reference "tailwindcss";

    img {
        cursor: pointer;
        @apply h-9 w-45;
    }
</style>