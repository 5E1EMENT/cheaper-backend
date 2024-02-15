export class ChatController {
    model = null

    constructor(model) {
        this.model = model
    }

    async getUnifiedProductName(searchProduct) {
        return this.model.getUnifiedProductName(searchProduct)
    }
    async getSimilarProductStrings(productsData, productName) {
        return this.model.getSimilarProductStrings(productsData, productName)
    }
}