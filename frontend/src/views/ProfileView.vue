<script setup lang="ts">
import { computed, ref } from 'vue'

const email = ref('')
const favoritesCount = ref(0)

const initial = computed(() => email.value.charAt(0).toUpperCase() || '?')

// TODO (9.9 / 3.9) : charger le profil et le résumé d'activité depuis l'API
// TODO (8.3) : bouton de déconnexion
</script>

<template>
  <section class="profile-page">
    <header class="page-header">
      <p class="eyebrow">Compte</p>
      <h1>Mon profil</h1>
      <p class="subtitle">Vos informations et un résumé de votre activité.</p>
    </header>

    <div class="profile-card">
      <div class="avatar" aria-hidden="true">{{ initial }}</div>
      <div class="profile-identity">
        <span class="label">Adresse email</span>
        <span class="value">{{ email || '—' }}</span>
      </div>
    </div>

    <div class="stat-cards">
      <div class="stat-card">
        <span class="label">Nombre de favoris</span>
        <span class="stat-value">{{ favoritesCount }}</span>
        <RouterLink to="/favorites" class="stat-link">Voir mes favoris →</RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.profile-page {
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

.profile-card,
.stat-card {
  border: 1px solid #8884;
  border-radius: 16px;
  background: Canvas;
  box-shadow: 0 6px 18px #0001;
  box-sizing: border-box;
}

/* Carte d'identité : même dégradé que la présentation de l'accueil */
.profile-card {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.75rem;
  color: #fff;
  background: linear-gradient(135deg, #1e1b4b, #4338ca);
  border-color: transparent;
}

.avatar {
  flex-shrink: 0;
  width: 4rem;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #fff3;
  font-size: 1.6rem;
  font-weight: 700;
}

.profile-identity {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
  overflow-wrap: anywhere;
}

.label {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.75;
}

.value {
  font-size: 1.15rem;
  font-weight: 600;
}

.stat-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
  gap: 1rem;
}

.stat-card {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 1.5rem;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  border-color: #4338ca;
}

.stat-card .label {
  color: inherit;
}

.stat-value {
  font-size: 2.25rem;
  font-weight: 700;
  line-height: 1.1;
  color: #4338ca;
}

.stat-link {
  margin-top: 0.25rem;
  color: #4338ca;
  font-weight: 600;
  text-decoration: none;
}

.stat-link:hover {
  text-decoration: underline;
}

@media (max-width: 719px) {
  .page-header h1 {
    font-size: 1.6rem;
  }

  .profile-card {
    padding: 1.25rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .stat-card {
    transition: none;
  }
}
</style>
