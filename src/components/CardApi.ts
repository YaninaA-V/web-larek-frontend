import { IOrder, IOrderResult, IProductCard } from '../types';
import { Api, ApiListResponse } from './base/api';

export interface ICardsAPI {
	getCardList: () => Promise<IProductCard[]>;
	orderCards: (order: IOrder) => Promise<IOrderResult>;
}

export class CardsApi extends Api implements ICardsAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

	getCardList(): Promise<IProductCard[]> {
		return this.get(`/product`).then((data: ApiListResponse<IProductCard>) => 
		data.items.map((item) => ({
			...item,
			image: this.cdn + item.image
		}))
	);
	}
	
	orderCards(order: IOrder): Promise<IOrderResult> {
		return this.post('/order', order).then(
			(data: IOrderResult) => data
		);
	}
}



