<script setup lang="ts">
import { computed, ref } from 'vue'

type Favorite = {
  id: string
  tmdbId: number
  type: 'movie' | 'tv'
  title: string
  rating?: number
}

const favorites = ref<Favorite[]>([])

const favoriteCount = computed(() => favorites.value.length)

const typeLabel: Record<'movie' | 'tv', string> = {
  movie: 'Film',
  tv: 'Série',
}

// TODO (8.7 / 9.8) : charger, trier et filtrer les favoris depuis le store
// TODO (8.7) : supprimer un favori (DELETE /me/favorites/:id)
function removeFavorite(_id: string) {}
</script>

<template>
  <section class="favorites-page">
    <header class="page-header">
      <p class="eyebrow">Ma liste</p>
      <h1>Mes favoris</h1>
      <p class="subtitle">
        <template v-if="favoriteCount > 0">
          {{ favoriteCount }} œuvre{{ favoriteCount > 1 ? 's' : '' }} dans votre liste.
        </template>
        <template v-else>Les films et séries que vous ajoutez apparaîtront ici.</template>
      </p>
    </header>

    <div v-if="favoriteCount === 0" class="state-card">
      <p>Vous n'avez encore aucun favori.</p>
      <RouterLink to="/search" class="cta-link">Rechercher un film ou une série</RouterLink>
    </div>

    <ul v-else class="favorite-list">
      <li v-for="favorite in favorites" :key="favorite.id" class="favorite-card">
        <div class="favorite-info">
          <span class="type-badge">{{ typeLabel[favorite.type] }}</span>
          <RouterLink :to="`/${favorite.type}/${favorite.tmdbId}`" class="favorite-title">
            {{ favorite.title }}
          </RouterLink>
          <span v-if="favorite.rating !== undefined" class="rating">
            ★ {{ favorite.rating }}/5
          </span>
        </div>

        <button type="button" class="remove-btn" @click="removeFavorite(favorite.id)">
          Retirer
        </button>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.favorites-page {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.page-header h1 {
  margin: 0 0 0.25rem;
  font-size: 2rem;
  line-height: 1.2;
}

.eyebrow {
  margin: 0 0 0.25rem;
  font-size: 0.85rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #4338ca;
  font-weight: 600;
}

.subtitle {
  margin: 0;
  opacity: 0.75;
}

.state-card,
.favorite-card {
  border: 1px solid #8884;
  border-radius: 16px;
  background: Canvas;
  box-shadow: 0 6px 18px #0001;
  box-sizing: border-box;
}

.state-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2.5rem 2rem;
  text-align: center;
}

.state-card p {
  margin: 0;
  opacity: 0.8;
}

.cta-link {
  padding: 0.7rem 1.2rem;
  border-radius: 10px;
  background: #4338ca;
  color: #fff;
  font-weight: 600;
  text-decoration: none;
}

.cta-link:hover {
  background: #3730a3;
}

.favorite-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
  gap: 1rem;
}

.favorite-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease;
}

.favorite-card:hover {
  transform: translateY(-2px);
  border-color: #4338ca;
}

.favorite-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.type-badge {
  align-self: flex-start;
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
  background: #4338ca22;
  color: #4338ca;
  font-size: 0.8rem;
  font-weight: 600;
}

.favorite-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: inherit;
  text-decoration: none;
}

.favorite-title:hover {
  color: #4338ca;
  text-decoration: underline;
}

.rating {
  font-size: 0.9rem;
  opacity: 0.8;
}

.remove-btn {
  padding: 0.6rem 0.9rem;
  border: 1px solid #b91c1c;
  border-radius: 8px;
  background: transparent;
  color: #b91c1c;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.remove-btn:hover {
  background: #b91c1c;
  color: #fff;
}

@media (max-width: 719px) {
  .page-header h1 {
    font-size: 1.6rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .favorite-card {
    transition: none;
  }
}
</style>
