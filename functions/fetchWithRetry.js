export const fetchDataWithRetry = async (apiFunction, ...args) => {
    const maxRetries = 15; // Максимальное количество попыток
    let currentAttempt = 1;

    while (currentAttempt <= maxRetries) {
        const timeoutPromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(new Error('Время запроса истекло'));
            }, 30000); // Новый timeoutPromise для каждой попытки
        });
        try {
            // Ваш запрос API, предположим, это функция, возвращающая Promise

            const data = await Promise.race([apiFunction(...args), timeoutPromise]);
            console.log(`Attempt ${currentAttempt} `)
            return data;
        } catch (error) {
            console.log(`Attempt ${currentAttempt} failed. Error: ${error.message}`);

            // В случае ошибки, увеличиваем счетчик попыток и продолжаем цикл
            currentAttempt++;
        }
    }

    // Если все попытки завершились неудачно, можно выбросить ошибку или вернуть значение по умолчанию
    throw new Error(`Failed after ${maxRetries} attempts`);
}