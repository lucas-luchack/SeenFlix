<script setup lang="ts">
import { computed, ref } from 'vue'

const query = ref('')
const submittedQuery = ref('')
const hasSearched = ref(false)
const results = ref<Array<{ tmdbId: number; type: 'movie' | 'tv'; title: string }>>([])

const resultCount = computed(() => results.value.length)

// TODO (8.2 / 5.2) : appeler GET /movies/search?q=… et remplir `results`
function handleSearch() {
  const trimmed = query.value.trim()
  if (!trimmed) return

  submittedQuery.value = trimmed
  hasSearched.value = true
}

// TODO (8.7) : ajouter aux favoris, visible uniquement si l'utilisateur est connecté
function addToFavorites(_tmdbId: number, _type: 'movie' | 'tv') {}

const typeLabel: Record<'movie' | 'tv', string> = {
  movie: 'Film',
  tv: 'Série',
}
</script>

<template>
  <section class="search">
    <header class="search-header">
      <p class="eyebrow">Catalogue</p>
      <h1>Rechercher</h1>
      <p class="subtitle">Trouvez un film ou une série par son titre.</p>
    </header>

    <form class="search-bar" role="search" @submit.prevent="handleSearch">
      <input
        v-model="query"
        type="search"
        placeholder="Titre d'un film ou d'une série"
        aria-label="Titre d'un film ou d'une série"
      />
      <button type="submit" class="search-btn" :disabled="!query.trim()">Rechercher</button>
    </form>

    <div v-if="!hasSearched" class="state-card">
      <p>Saisissez un titre pour commencer la recherche.</p>
    </div>

    <div v-else-if="resultCount === 0" class="state-card">
      <p>Aucun résultat pour « {{ submittedQuery }} ».</p>
    </div>

    <template v-else>
      <p class="result-count">
        {{ resultCount }} résultat{{ resultCount > 1 ? 's' : '' }} pour « {{ submittedQuery }} »
      </p>

      <ul class="results">
        <li v-for="item in results" :key="`${item.type}-${item.tmdbId}`" class="result-card">
          <div class="result-info">
            <span class="type-badge">{{ typeLabel[item.type] }}</span>
            <RouterLink :to="`/${item.type}/${item.tmdbId}`" class="result-title">
              {{ item.title }}
            </RouterLink>
          </div>

          <button
            type="button"
            class="fav-btn"
            @click="addToFavorites(item.tmdbId, item.type)"
          >
            Ajouter aux favoris
          </button>
        </li>
      </ul>
    </template>
  </section>
</template>

<style scoped>
.search {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.search-header h1 {
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

/* Barre de recherche : même esthétique que les cartes de l'accueil */
.search-bar {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #8884;
  border-radius: 16px;
  background: Canvas;
  box-shadow: 0 6px 18px #0001;
  box-sizing: border-box;
}

.search-bar input {
  flex: 1;
  min-width: 0;
  padding: 0.7rem 0.9rem;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: inherit;
  font: inherit;
}

.search-bar input:focus {
  outline: none;
  box-shadow: inset 0 0 0 2px #4338ca;
}

.search-btn {
  padding: 0.7rem 1.2rem;
  border: none;
  border-radius: 10px;
  background: #4338ca;
  color: #fff;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

.search-btn:hover:not(:disabled) {
  background: #3730a3;
}

.search-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.state-card,
.result-card {
  border: 1px solid #8884;
  border-radius: 16px;
  background: Canvas;
  box-shadow: 0 6px 18px #0001;
  box-sizing: border-box;
}

.state-card {
  padding: 2rem;
  text-align: center;
  opacity: 0.8;
}

.state-card p {
  margin: 0;
}

.result-count {
  margin: 0;
  font-size: 0.95rem;
  opacity: 0.75;
}

.results {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
  gap: 1rem;
}

.result-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease;
}

.result-card:hover {
  transform: translateY(-2px);
  border-color: #4338ca;
}

.result-info {
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

.result-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: inherit;
  text-decoration: none;
}

.result-title:hover {
  color: #4338ca;
  text-decoration: underline;
}

.fav-btn {
  padding: 0.6rem 0.9rem;
  border: 1px solid #4338ca;
  border-radius: 8px;
  background: transparent;
  color: #4338ca;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.fav-btn:hover {
  background: #4338ca;
  color: #fff;
}

@media (max-width: 719px) {
  .search-header h1 {
    font-size: 1.6rem;
  }

  .search-bar {
    flex-direction: column;
  }
}

@media (prefers-reduced-motion: reduce) {
  .result-card {
    transition: none;
  }
}
</style>
