import { describe, it, expect } from 'vitest'

import { mount, flushPromises } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import App from '../App.vue'
import { routes } from '../router'

describe('App', () => {
  it('renders the navigation header', async () => {
    const router = createRouter({ history: createMemoryHistory(), routes })
    router.push('/')
    await router.isReady()

    const wrapper = mount(App, { global: { plugins: [router] } })
    await flushPromises()

    expect(wrapper.text()).toContain('SeenFlix')
    expect(wrapper.text()).toContain('Bienvenue sur SeenFlix')
  })
})
