
export interface IProductCard {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
    button: HTMLButtonElement;    
}

export interface IModelForms {    
    payment: string;
    address: string;
    email: string;
    phone: string;
}

export interface IOrder extends IModelForms {
    items: string[];
    total: number;
    payment: string;
    address: string;
    email: string;
    phone: string;

}

export interface IProductCardsData {
    catalog: IProductCard[];
    basket: string[];
    order: IOrder | null;
}
export interface IOrderResult {
    id: string; 
    total: number;
}

export type IBasketItem = Pick<IProductCard, 'id' | 'title' | 'price'>;

export type FormErrors = Partial<Record<keyof IOrder, string>>;
