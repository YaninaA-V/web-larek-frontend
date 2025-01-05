import './scss/styles.scss';

interface IProductCard {
    _id: string;
    title: string;
    category: string;
    description: string;
    price: number;
    image: string;
}

interface IModalForms {
    payment: string;
    address: string;
    email: string;
    phone: string;
    total: number;
    setBuyInfo(cards: IProductCard[]): void;
    getTotalPriceInfo(total: string): IModalForms;
    setBuyerInfo(email: string, phone: string): IModalForms;
    setCartPayInfo(payment: string, address: string): IModalForms;
    checkValidation(data: Record<keyof TPaymentDelivery, string>): boolean;
}

interface IProductCardsData {
    cards: IProductCard[];
    addProduct(card: IProductCard): void;
    deleteProduct(cardId: string): void;
    getProduct(cardId: string): IProductCard;
    checkStatus(data: Record<keyof TCart, string>): boolean;
}

export type TPublicInfo = Pick<IProductCard, 'title' | 'category' | 'image' | 'price'>;

export type TCardInfo = Pick<IProductCard, 'title' | 'category' | 'description' | 'image' | 'price'>;

export type TCart = Pick<IProductCard, 'title' | 'price'> & Pick<IModalForms, 'total'>;

export type TPaymentDelivery = Pick<IModalForms, 'payment' | 'address'>;

export type TBuyerDetails = Pick<IModalForms, 'email' | 'phone'>;

export type TSuccessBuy = Pick<IModalForms, 'total'>;

