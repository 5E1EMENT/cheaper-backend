export const getCurrentUrl = (searchProduct, origin) => {
    const shop = origin.split('.')[0]

    switch(shop) {
        case origin.includes('ozon'):  
            return `${origin}/search/?text=${encodeURIComponent(searchProduct)}&from_global=true`
        case origin.includes('satu'):
            return `${origin}/search?search_term=${encodeURIComponent(searchProduct)}`
        case origin.includes('wildberries'):
            return `${origin}/catalog/0/search.aspx?search=${encodeURIComponent(searchProduct)}`
    }
}