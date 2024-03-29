export const getCurrentUrl = (searchProduct, origin) => {
    switch(!!origin) {
        case origin.includes('ozon'):  
            return `https://${origin}/search/?text=${encodeURIComponent(searchProduct)}&from_global=true`
        case origin.includes('satu'):
            return `https://${origin}/search?search_term=${encodeURIComponent(searchProduct)}`
        case origin.includes('wildberries'):
            return `https://global.${origin}/catalog?search=${encodeURIComponent(searchProduct)}&curr=kzt`
    }
}