import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import App from '../src/App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { createI18n } from 'vue-i18n';
import { createPinia } from 'pinia';
import en from '@/locales/en.json'
import Home from '@/views/Home.vue'

const router = createRouter({
    history:createWebHistory(import.meta.env.BASE_URL),
    routes: [
      {
        path: '/:query?',
        name: 'home',
        component: Home,
        props: (route) => ({ query: route.params.query || '' })
      },
    ],
})

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {en}
});

vi.mock('chart.js', () => ({
    Chart: {
      register: vi.fn(),
    },
    registerables: [],
  }));

describe('App.vue', () => {
  it('renders without crashing', () => {
    const pinia = createPinia();
    const wrapper = mount(App, {
      global: {
        plugins: [router, i18n, pinia],
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.html()).toContain("EHRI DASHBOARD");
    expect(wrapper.html()).toContain("EHRI Consortium")
  });
});