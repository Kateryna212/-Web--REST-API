import { Store } from './state.js';
import { ApiService } from './api.js';

export const Pages = {
    // 1. Головна сторінка — тепер завантажує дані з REST API
    home() {
        const state = Store.getState();

        // А) Якщо триває завантаження даних — показуємо індикатор завантаження
        if (state.isLoading) {
            return `
                <div class="shop-header">
                    <h1>Каталог товарів Easy click</h1>
                </div>
                <div class="loading-container">
                    <div class="spinner"></div>
                    <p>Завантаження нових гаджетів з сервера...</p>
                </div>
            `;
        }

        // Б) Якщо сталася помилка при запиті — показуємо повідомлення користувачу
        if (state.apiError) {
            return `
                <div class="shop-header">
                    <h1>Каталог товарів Easy click</h1>
                </div>
                <div class="error-container">
                    <h3>⚠️ Не вдалося завантажити товари</h3>
                    <p>${state.apiError}</p>
                    <button id="retry-btn" class="buy-btn" style="max-width: 200px; margin: 0 auto;">Спробувати знову</button>
                </div>
            `;
        }

        // В) Основне успішне відображення карток з API
        const cardsHTML = state.apiProducts.map(product => `
            <div class="product-card">
                <div class="product-badge">${product.category}</div>
                <h3>${product.title}</h3>
                <p class="product-desc">${product.description}</p>
                <div class="product-price">$${product.price}</div>
                <button class="buy-btn">Купити</button>
            </div>
        `).join('');

        return `
            <div class="shop-header">
                <h1>Каталог товарів Easy click (REST API)</h1>
                <p>Ці товари асинхронно завантажені з dummyjson.com/products</p>
            </div>
            <div class="products-grid">
                ${cardsHTML}
            </div>
        `;
    },

    // 2. Сторінка "Про нас" (Залишається з ПР5)
    about() {
        return `
            <h1>Про магазин Easy click</h1>
            <p><strong>Easy click</strong> — це сучасний омніканальний ритейлер найяскравішої техніки та гаджетів. Ми робимо процес покупки максимально простим, швидким та технологічним.</p>
            <h3>Наші переваги:</h3>
            <ul>
                <li><strong>Асинхронний Fetch:</strong> Дані завантажуються у фоновому режимі без блокування інтерфейсу.</li>
                <li><strong>REST API інтеграція:</strong> Каталог завжди синхронізований із глобальною базою даних.</li>
            </ul>
        `;
    },

    // 3. Контактна форма (Залишається з ПР5)
    contact() {
        const state = Store.getState();
        if (state.isSubmitted) {
            return `
                <h1>Зворотній зв'язок</h1>
                <p class="success-msg">Дякуємо, ${state.formData.name}! Ваше звернення зафіксовано.</p>
                <button id="reset-form-btn">Написати ще раз</button>
            `;
        }
        return `
            <h1>Зв'язатися з Easy click</h1>
            <form id="contact-form">
                <label>Ваше ім'я:</label>
                <input type="text" id="form-name" value="${state.formData.name}" required>
                <label>Ваш Email:</label>
                <input type="email" id="form-email" value="${state.formData.email}" required>
                <label>Що вас цікавить:</label>
                <textarea id="form-message" rows="4" required>${state.formData.message}</textarea>
                <button type="submit">Надіслати запит</button>
            </form>
        `;
    },

    // Навішування івентів
    initEventListeners(path) {
        // Івенти для кнопки "Спробувати знову" при помилці на Головній сторінці
        if (path === '/') {
            const retryBtn = document.getElementById('retry-btn');
            if (retryBtn) {
                retryBtn.addEventListener('click', () => {
                    // Викликаємо функцію завантаження (вона описана в router.js або app.js)
                    window.loadApiData(); 
                });
            }
        }

        // Івенти форми на сторінці контактів
        if (path === '/contact') {
            const form = document.getElementById('contact-form');
            const resetBtn = document.getElementById('reset-form-btn');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    Store.setState({
                        formData: {
                            name: document.getElementById('form-name').value,
                            email: document.getElementById('form-email').value,
                            message: document.getElementById('form-message').value
                        },
                        isSubmitted: true
                    });
                });
            }
            if (resetBtn) {
                resetBtn.addEventListener('click', () => {
                    Store.setState({ formData: { name: '', email: '', message: '' }, isSubmitted: false });
                });
            }
        }
    }
};
