import './scss/styles.scss';

import { EventEmitter } from './components/base/events';
import { CardsApi } from './components/CardApi';
import { CardData, CatalogChangeEvent } from './components/CardData';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Page } from './components/Page';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { Contacts, Order } from './components/Order';
import { Card } from './components/Card';
import { IModelForms, IProductCard } from './types';
import { Success } from './components/common/Success';


const events = new EventEmitter();
const api = new CardsApi(CDN_URL, API_URL);
const appData = new CardData({}, events);

//для отладки, чтобы мониторить события

events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})


const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemlate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasket = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');


const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);

api.getCardList()
.then(appData.setCatalog.bind(appData))
.catch(err => {
    console.error(err);
    alert('Ошибка при получении данных. Попробуйте еще раз позже.');
});

events.on<CatalogChangeEvent>('items:changed', () => {
    page.catalog = appData.catalog.map((item) => {
        const card = new Card(cloneTemplate(cardTemplate), {
            onClick: () => events.emit('card:select', item)
        }); 
        return card.render({
            title: item.title,
            category: item.category,
            image: item.image,
            price: item.price
        });        
    }); 
})

events.on('card:select', (items: IProductCard) => {
    appData.setPreview(items);
})

events.on('preview:changed', (item: IProductCard) => { 
    const card = new Card(cloneTemplate(cardPreviewTemlate), {        
        onClick: () => events.emit('card:add', item),
    });
    card.disabledButton(appData.order.items, item.id, item.price);
    const modalContent = card.render({
            title: item.title,
            description: item.description,
            category: item.category,
            image: item.image,
            price: item.price
    });
    
    modal.render({
        content: modalContent,
    });    
})

events.on('basket:open', () => {
    basket.selected = appData.order.items;
    modal.render({
        content: basket.render({
            total: appData.getTotal()
        }),
    });
    const orderButton = document.querySelector('.basket__button') as HTMLButtonElement;
    if (orderButton) {
        orderButton.addEventListener('click', () => {
            events.emit('order:open');
        });
    }
})

events.on('basket:changed', () => {
    basket.items = appData.basket.map((item, index) => {
        const card = new Card(cloneTemplate(cardBasket), {
            onClick: () => {
                appData.deleteProductFromBasket(item);
                basket.selected = appData.order.items;
                basket.total = appData.getTotal();
            }
        });
        return card.render({
            title: item.title,
            price: item.price,
            index: index + 1 
        });
    });
    page.counter = appData.basket.length;
    basket.total = appData.getTotal();
})

events.on('card:add', (item: IProductCard) => {
    appData.addProductToBasket(item);
    modal.close();
});

events.on('card:remove', (item: IProductCard) => {
    appData.deleteProductFromBasket(item);
    events.emit('basket:open');
})

events.on('formErrorsByer:change', (errors: Partial<IModelForms>) => {
    const { email, phone } = errors;
    contacts.valid = !email && !phone;
    contacts.errors = Object.values({email, phone}).filter(i => !!i).join('; ');
});

events.on(/^contacts\..*:change/, (data: { field: keyof IModelForms, value: string}) => {
    appData.setBuyerField(data.field, data.value);
});

events.on('order:submit', () => {
    modal.render({
        content: contacts.render({
            email: '',
            phone: '',
            valid: false,
            errors: []
        }),
    });
})

events.on('formErrorsOrder:change', (errors: Partial<IModelForms>) => {
    console.log('Received errors:', errors); 
    const { address, payment } = errors;
    order.valid = !address && !payment;
    order.errors = Object.values({address, payment}).filter(i => !!i).join('; ');
});

events.on(/^order\..*:change/, (data: { field: keyof IModelForms, value: string}) => {
    appData.setOrderField(data.field, data.value);
});

events.on('order:open', () => {
    modal.render({
        content: order.render({
            address: '',
            payment: '',
            valid: false,
            errors: []
        }),
    });
})

events.on('payment:change', (data: { name: string }) => {
    appData.order.payment = data.name;
})

events.on('contacts:submit', () => {
    api.orderCards(appData.order)
    .then((result) => {
        const success = new Success(cloneTemplate(successTemplate), {
            onClick: () => {
                modal.close();
            }
        });
        modal.render({
            content: success.render({
                total: appData.getTotal()
            })
        });
        page.counter = appData.basket.length;
    })
    .catch(err => {
        console.error(err);
        alert('Ошибка при получении данных. Попробуйте еще раз позже.');
    });
})

events.on('contacts:ready', (data: IModelForms) => {
    const { email, phone } = data;
    const submitButton = document.querySelector('.modal__actions button') as HTMLButtonElement;

    const emailValid = email && email.trim() !== '';
    const phoneValid = phone && phone.trim() !== '';    
  
    submitButton.disabled = !(emailValid && phoneValid);
});

events.on('modal:open', () => {
    page.locked = true;
});

events.on('modal:close', () => {
    page.locked = false;
});

