import { Component } from "../base/Component";
import { EventEmitter } from "../base/events";
import { createElement, ensureElement } from "../../utils/utils";

interface IBasketView {
    items: HTMLElement[];
    total: number;
    selected: string[];
}

export class Basket extends Component<IBasketView> {
	protected basketList: HTMLElement;
    protected basketTotal: HTMLElement;
    protected basketButton: HTMLElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this.basketList = ensureElement<HTMLElement>('.basket__list', this.container);
        this.basketTotal = this.container.querySelector('.basket__price');
        this.basketButton = this.container.querySelector('.basket__button');

		if (this.basketButton) {
			this.basketButton.addEventListener('click', () => {
				events.emit('basket:open');
			});
		}

		this.items = [];
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this.basketList.replaceChildren(...items);
		} else {
			this.basketList.replaceChildren(createElement<HTMLParagraphElement>('p', {
				textContent: 'Корзина пуста'
			}));
		}
	}

	set selected(items: string[]) {
		if (items.length) {
			this.setDisabled(this.basketButton, false);
		} else {
			this.setDisabled(this.basketButton, true);
		}
	}

	set total(total: number) {
		this.setText(this.basketTotal, `${total} синапсов`);
	}
}