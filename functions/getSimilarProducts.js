export const getSimilarProducts = (stringsArr, productsArr) => {
    return productsArr.filter(obj => stringsArr.some(str => str === obj.name)).sort((a,b) => a.price - b.price);
}