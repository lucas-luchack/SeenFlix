<script setup lang="ts"></script>

<template>
  <header class="site-header">
    <RouterLink to="/" class="brand">SeenFlix</RouterLink>

    <nav class="site-nav">
      <RouterLink to="/search">Rechercher</RouterLink>
      <RouterLink to="/favorites">Mes favoris</RouterLink>
      <RouterLink to="/profile">Profil</RouterLink>
      <RouterLink to="/login">Connexion</RouterLink>
      <RouterLink to="/register">Inscription</RouterLink>
    </nav>
  </header>

  <main class="page">
    <RouterView />
  </main>
</template>

<style scoped>
.site-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 16px;
  border-bottom: 1px solid #8884;
}

.brand {
  font-weight: 700;
  font-size: 1.25rem;
  text-decoration: none;
}

.site-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.page {
  padding: 1.5rem 16px;
  max-width: 60rem;
  margin: 0 auto;
}

.empty {
  opacity: 0.7;
}
</style>
