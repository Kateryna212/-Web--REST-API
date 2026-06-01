import { Pages } from './pages.js';
import { Store } from './state.js';
import { ApiService } from './api.js';

const routes = {
    '/': Pages.home,
    '/about': Pages.about,
    '/contact': Pages.contact
};

export const Router = {
    navigateTo(url) {
        window.history.pushState(null, null, url);
        Store.setState({ currentPage: url });
    },

    // Створюємо асинхронну функцію завантаження даних
    async fetchShopData() {
        // Якщо дані вже завантажені — не робимо повторний запит
        if (Store.getState().apiProducts.length > 0) return;

        // Вмикаємо loading state
        Store.setState({ isLoading: true, apiError: null });

        try {
            const products = await ApiService.getProducts();
            // Зберігаємо завантажені товари у глобальний стан
            Store.setState({ apiProducts: products, isLoading: false });
        } catch (error) {
            // Фіксуємо помилку у стані
            Store.setState({ apiError: error.message, isLoading: false });
        }
    },

    handleRouting() {
        const path = window.location.pathname;
        const renderFunc = routes[path] || routes['/'];

        if (path === '/') document.title = "Каталог API | Easy click";
        else if (path === '/about') document.title = "Про нас | Easy click";
        else if (path === '/contact') document.title = "Підтримка | Easy click";

        document.getElementById('app').innerHTML = renderFunc();
        Pages.initEventListeners(path);

        // Тригеримо завантаження з API тільки якщо ми на Головній сторінці
        if (path === '/') {
            this.fetchShopData();
        }
    },

    init() {
        // Робимо функцію глобальною, щоб її могла викликати кнопка "Спробувати знову"
        window.loadApiData = () => this.fetchShopData();

        document.body.addEventListener('click', e => {
            if (e.target.matches('[data-link]')) {
                e.preventDefault();
                this.navigateTo(e.target.getAttribute('href'));
            }
        });

        window.addEventListener('popstate', () => {
            Store.setState({ currentPage: window.location.pathname });
        });

        this.handleRouting();
    }
};
