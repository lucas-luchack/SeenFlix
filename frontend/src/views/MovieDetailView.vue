<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps<{
  type: 'movie' | 'tv'
  id: number
}>()

const typeLabel = computed(() => (props.type === 'movie' ? 'Film' : 'Série'))

// TODO (8.2 / 5.3) : charger la fiche via l'API backend
</script>

<template>
  <section class="page">
    <RouterLink to="/search">← Retour à la recherche</RouterLink>

    <h1>{{ typeLabel }} #{{ id }}</h1>

    <p class="empty">Chargement de la fiche…</p>
  </section>
</template>
