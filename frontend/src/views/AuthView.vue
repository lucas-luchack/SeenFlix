<script setup lang="ts">
import { computed, ref } from 'vue'

// ref function is used for creating reactive references to form input values
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
// Props allows to determine whether the view is in login or register mode
const props = defineProps<{
  mode: 'login' | 'register'
}>()

// computed function is used for creating reactive derived values based on other reactive references
const isRegister = computed(() => props.mode === 'register')
const title = computed(() => (isRegister.value ? 'Créer un compte' : 'Se connecter'))
const submitLabel = computed(() => (isRegister.value ? "S'inscrire" : 'Connexion'))

// Panneau d'information : bienvenue en connexion, présentation du site en inscription
const info = computed(() =>
  isRegister.value
    ? {
        title: 'SeenFlix',
        text: "Suivez les films et séries que vous avez vus, gérez vos favoris et explorez le catalogue en un seul endroit.",
        to: '/login',
        label: 'Déjà un compte ? Se connecter',
      }
    : {
        title: 'Bienvenue sur SeenFlix',
        text: 'Retrouvez vos favoris, recherchez vos prochaines séries et gardez une trace de tout ce que vous avez vu.',
        to: '/register',
        label: 'Pas de compte ? Créer un compte',
      },
)

// TODO (8.3 / 9.2 / 9.3) : appeler le store d'authentification
function handleSubmit() {
  // 1. Check and alert if password !== password confirm
  if (isRegister.value && password.value !== passwordConfirm.value && props.mode === 'register') {
    alert('Les mots de passe ne correspondent pas.')
    return
  }

  // 2. Check and alert if email is empty
  if (!email.value) {
    alert('Veuillez entrer une adresse email.')
    return
  }

  // 3. Check and alert if password is empty
  if (!password.value) {
    alert('Veuillez entrer un mot de passe.')
    return
  }

  // TODO: appeler le store d'authentification pour login ou register
  console.log('Submitting form with:', { email: email.value, password: password.value, passwordConfirm: passwordConfirm.value })
}

</script>

<template>
  <section class="auth">
    <div class="auth-card" :class="{ 'is-register': isRegister }">
      <div class="auth-panel auth-form-panel">
        <Transition name="fade" mode="out-in">
          <div :key="mode" class="panel-content">
            <h1>{{ title }}</h1>

            <form class="auth-form" @submit.prevent="handleSubmit">
              <label>
                Email
                <input v-model="email" type="email" autocomplete="email" required />
              </label>

              <label>
                Mot de passe
                <input
                  v-model="password"
                  type="password"
                  :autocomplete="isRegister ? 'new-password' : 'current-password'"
                  required
                />
              </label>
              <label v-if="isRegister" class="info-text">
                Confirmer le mot de passe
                <input
                  v-model="passwordConfirm"
                  type="password"
                  :autocomplete="isRegister ? 'new-password' : 'current-password'"
                  required
                />
              </label>  
              <button type="submit" class="submit-btn">{{ submitLabel }}</button>
            </form>
          </div>
        </Transition>
      </div>

      <div class="auth-panel auth-info-panel">
        <Transition name="fade" mode="out-in">
          <div :key="mode" class="panel-content">
            <h2>{{ info.title }}</h2>
            <p>{{ info.text }}</p>
            <RouterLink class="switch-btn" :to="info.to">{{ info.label }}</RouterLink>
          </div>
        </Transition>
      </div>
    </div>
  </section>
</template>

<style scoped>
.auth-card {
  position: relative;
  min-height: 32rem;
  overflow: hidden;
  border: 1px solid #8884;
  border-radius: 16px;
  background: Canvas;
  box-shadow: 0 10px 30px #0002;
}

.auth-panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2.5rem;
  box-sizing: border-box;
}

/* Desktop : les deux panneaux se partagent la largeur et échangent leur place */
@media (min-width: 720px) {
  .auth-panel {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 50%;
    transition: left 0.7s cubic-bezier(0.65, 0, 0.35, 1);
  }

  .auth-form-panel {
    left: 0;
  }

  .auth-info-panel {
    left: 50%;
    color: #fff;
    background: linear-gradient(135deg, #1e1b4b, #4338ca);
  }

  .auth-card.is-register .auth-form-panel {
    left: 50%;
  }

  .auth-card.is-register .auth-info-panel {
    left: 0;
  }
}

/* Mobile : panneaux empilés, le texte d'information passe sous le formulaire (ou au-dessus en inscription) */
@media (max-width: 719px) {
  .auth-card {
    min-height: 0;
    display: flex;
    flex-direction: column;
  }

  .auth-panel {
    padding: 2rem 1.25rem;
  }

  .auth-form-panel {
    order: 1;
  }

  .auth-info-panel {
    order: 2;
    color: #fff;
    background: linear-gradient(135deg, #1e1b4b, #4338ca);
  }

  .auth-card.is-register .auth-info-panel {
    order: 1;
  }

  .auth-card.is-register .auth-form-panel {
    order: 2;
  }
}

.panel-content {
  max-width: 24rem;
  width: 100%;
  margin: 0 auto;
}

.panel-content h1,
.panel-content h2 {
  margin-top: 0;
}

.auth-info-panel p {
  line-height: 1.6;
  opacity: 0.9;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.auth-form label {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.auth-form input {
  padding: 0.6rem 0.75rem;
  border: 1px solid #8886;
  border-radius: 8px;
  background: transparent;
  color: inherit;
  font: inherit;
}

.submit-btn {
  padding: 0.7rem;
  border: none;
  border-radius: 8px;
  background: #4338ca;
  color: #fff;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.submit-btn:hover {
  background: #3730a3;
}

.switch-btn {
  display: inline-block;
  margin-top: 1.5rem;
  padding: 0.6rem 1.1rem;
  border: 1px solid #fffa;
  border-radius: 8px;
  color: #fff;
  text-decoration: none;
  font-weight: 600;
}

.switch-btn:hover {
  background: #fff2;
}

/* Transition du contenu (titre, formulaire, texte d'information) */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .auth-panel,
  .fade-enter-active,
  .fade-leave-active {
    transition: none;
  }
}
</style>
