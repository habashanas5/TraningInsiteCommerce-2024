const cacheKey = "compareProducts";
const compareReturnUrlKey = "compareReturnUrl";

const setInLocalStorage = (productIds: string[]) => {
    window.localStorage.setItem(cacheKey, JSON.stringify(productIds));
};

export function getProductIds(): string[] {
    return JSON.parse(window.localStorage.getItem(cacheKey) || "[]") as string[];
}

export function addProduct(productId: string): boolean {
    const productIds = getProductIds();
    if (!productIds.includes(productId)) {
        productIds.push(productId);
        setInLocalStorage(productIds);
        return true;
    }
    return false;
}

export function removeProduct(productId: string): boolean {
    let productIds = getProductIds();
    if (productIds.includes(productId)) {
        productIds = productIds.filter(a => a !== productId);
        setInLocalStorage(productIds);
        return true;
    }
    return false;
}

export function removeAllProducts(): void {
    setInLocalStorage([]);
}

export function getReturnUrl() {
    return window.localStorage.getItem(compareReturnUrlKey) ?? undefined;
}

export function setReturnUrl(returnUrl: string) {
    window.localStorage.setItem(compareReturnUrlKey, returnUrl);
}
