<script setup lang="ts">
// Présentation courte de SeenFlix (cf. ProjetWeb.md, section 1)
const features = [
  'Recherchez des films et séries',
  'Consultez leurs fiches détaillées',
  'Gérez votre liste de favoris',
]

// Liens principaux, affichés sous forme de cartes
const links = [
  {
    to: '/search',
    title: 'Rechercher',
    text: 'Trouvez un film ou une série par mot-clé.',
  },
  {
    to: '/login',
    title: 'Se connecter',
    text: 'Accédez à vos favoris et à votre profil.',
  },
  {
    to: '/register',
    title: 'Créer un compte',
    text: 'Inscrivez-vous pour commencer votre liste.',
  },
]
</script>

<template>
  <section class="home">
    <div class="home-intro">
      <p class="eyebrow">Bienvenue</p>
      <h1>SeenFlix</h1>
      <p class="lead">
        Suivez les films et séries que vous avez vus, gérez vos favoris et explorez le catalogue en
        un seul endroit.
      </p>

      <ul class="features">
        <li v-for="feature in features" :key="feature">{{ feature }}</li>
      </ul>
    </div>

    <nav class="link-cards" aria-label="Navigation principale">
      <RouterLink v-for="link in links" :key="link.to" :to="link.to" class="link-card">
        <h2>{{ link.title }}</h2>
        <p>{{ link.text }}</p>
      </RouterLink>
    </nav>
  </section>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.home-intro {
  padding: 2.5rem;
  border-radius: 16px;
  color: #fff;
  background: linear-gradient(135deg, #1e1b4b, #4338ca);
  box-shadow: 0 10px 30px #0002;
  box-sizing: border-box;
}

.eyebrow {
  margin: 0 0 0.5rem;
  font-size: 0.85rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.75;
}

.home-intro h1 {
  margin: 0 0 1rem;
  font-size: 2.5rem;
  line-height: 1.1;
}

.lead {
  margin: 0 0 1.5rem;
  max-width: none;
  font-size: 1.1rem;
  line-height: 1.6;
  opacity: 0.9;
}

.features {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.5rem;
}

.features li {
  position: relative;
  padding-left: 1.25rem;
}

.features li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.45em;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: #a5b4fc;
}

.link-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
  gap: 1rem;
}

.link-card {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 1.5rem;
  border: 1px solid #8884;
  border-radius: 16px;
  color: inherit;
  text-decoration: none;
  background: Canvas;
  box-shadow: 0 6px 18px #0001;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
  box-sizing: border-box;
}

.link-card h2 {
  margin: 0;
  font-size: 1.2rem;
  color: #4338ca;
}

.link-card p {
  margin: 0;
  line-height: 1.5;
  opacity: 0.8;
}

.link-card:hover,
.link-card:focus-visible {
  transform: translateY(-3px);
  border-color: #4338ca;
  box-shadow: 0 10px 24px #0002;
}

@media (max-width: 719px) {
  .home-intro {
    padding: 2rem 1.25rem;
  }

  .home-intro h1 {
    font-size: 2rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .link-card {
    transition: none;
  }
}
</style>
