<script lang="ts">
    import { profile as profileId } from '$lib/stores';

    const loadProfile = async () => {
        const profile = await fetch('/api/profiles/')
    }
</script>