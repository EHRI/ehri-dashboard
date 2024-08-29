import { mount } from '@vue/test-utils'
import SearchComponent from '@/components/SearchBox.vue'
import { createI18n } from 'vue-i18n';
import en from '@/locales/en.json'
import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue'

const i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages: {en}
});

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

vi.mock('chart.js', () => ({
    Chart: {
      register: vi.fn(),
    },
    registerables: [],
}));

describe('SearchBox.vue', () => {
    const wrapper = mount(SearchComponent, {
    global: {
        plugins: [ router, i18n],
    },
    });
    it('renders search input', () => {
        expect(wrapper.find('input[type="text"]').exists()).toBe(true)
    })
    it('updates model on user input', async () => {
        const input = wrapper.find('input[type="text"]')
        await input.setValue('query')
        expect(wrapper.vm.query).toBe('query')
    })
})

