import { IOrder, IProductCard, IProductCardsData, FormErrors, IModelForms} from "../types";;
import { Model } from "./base/Model";

export type CatalogChangeEvent = {
    catalog: IProductCard[]
} 

export class CardData extends Model<IProductCardsData> {
    basket: IProductCard[] = [];
    catalog: IProductCard[];
    order: IOrder = {
        payment: '',
        address: '',
        email: '',
        phone: '',
        total: 0,
        items: [] 
    };

    formErrors: FormErrors = {};

    getTotal() {
        return this.basket.reduce((total, item) => total + item.price, 0)
    }

    setCatalog(items: IProductCard[]) {
        this.catalog = items;
        this.emitChanges('items:changed', { catalog: this.catalog });
    }
    
    setPreview(item: IProductCard) {
        this.emitChanges('preview:changed', item);
    }
    addProductToBasket(item: IProductCard) {
        if(!this.checkProduct(item.id)) {
            this.basket.push(item);
            this.order.items.push(item.id);
            this.order.total += item.price;
            this.emitChanges('basket:changed');
        }
    }
    
    deleteProductFromBasket(item: IProductCard) {
        this.basket = this.basket.filter((element) => element !== item);
        this.order.items = this.order.items.filter((id: string) => item.id !== id);
        this.order.total = this.order.total - item.price;
        this.emitChanges('basket:changed');
    }

    clearBasket() {
        this.basket = [];
        this.order.items = [];
        this.emitChanges('basket:chaned');
    }
    
    clearOrder() {
        this.order.address = '';
        this.order.email = '';
        this.order.payment = '';
        this.order.phone = '';
        this.order.total = 0;
      }
      
    checkProduct(id: string) {
        return !!this.basket.find((item) => item.id === id);
    }
   
    setBuyerField(field: keyof IModelForms, value: string) {
        this.order[field] = value;

        if (this.validateContact()) {
            this.events.emit('contacts:ready', this.order);
        }
    }

    validateContact() {
        const errors: typeof this.formErrors = {};
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    setOrderField(field: keyof IModelForms, value: string) {
        this.order[field] = value;

        if (this.validateOrder()) {
            this.events.emit('order:ready', this.order);
        }
    }

    validateOrder() {
        const errors: typeof this.formErrors = {};
     
        if (!this.order.payment) {
         errors.payment= 'Необходимо выбрать способ оплаты';
       }
       if (!this.order.address) {
         errors.address = 'Необходимо указать адрес';
       }
     
         this.formErrors = errors;
         this.events.emit('formErrorsOrder:change', this.formErrors);
         return Object.keys(errors).length === 0;
       }
     }




