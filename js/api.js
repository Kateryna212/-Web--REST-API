const BASE_URL = 'https://dummyjson.com';

export const ApiService = {
    /**
     * Отримує список товарів з REST API
     * @returns {Promise<Array>} Масив товарів
     */
    async getProducts() {
        try {
            // Виконуємо асинхронний GET-запит
            const response = await fetch(`${BASE_URL}/products?limit=6&select=title,description,price,category`);
            
            // Базова обробка помилок сервера (наприклад, 404 або 500)
            if (!response.ok) {
                throw new Error(`Помилка сервера: Статус ${response.status}`);
            }
            
            // Десеріалізація JSON-відповіді
            const data = await response.json();
            return data.products; // Повертаємо масив з 6 елементів
        } catch (error) {
            console.error("Помилка при отриманні даних з API:", error);
            // Прокидаємо помилку далі, щоб її обробив UI-компонент
            throw error; 
        }
    }
};
