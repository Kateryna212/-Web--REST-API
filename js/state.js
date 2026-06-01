const state = {
    currentPage: '/',
    formData: { name: '', email: '', message: '' },
    isSubmitted: false,
    
    
    apiProducts: [],    // Тут зберігатимемо завантажені товари
    isLoading: false,   // Індикатор завантаження (Loading state)
    apiError: null      // Повідомлення про помилку
};

const listeners = [];

export const Store = {
    getState() {
        return { ...state };
    },
    setState(newState) {
        if (newState.currentPage !== undefined) state.currentPage = newState.currentPage;
        if (newState.formData !== undefined) state.formData = { ...state.formData, ...newState.formData };
        if (newState.isSubmitted !== undefined) state.isSubmitted = newState.isSubmitted;
        
        // Оновлення нових полів
        if (newState.apiProducts !== undefined) state.apiProducts = newState.apiProducts;
        if (newState.isLoading !== undefined) state.isLoading = newState.isLoading;
        if (newState.apiError !== undefined) state.apiError = newState.apiError;

        listeners.forEach(listener => listener(state));
    },
    subscribe(listener) {
        listeners.push(listener);
    }
};
