import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICard {
	title: string;
	description: string;
	category: string;
	image: string;	
	price: number;
	button: HTMLButtonElement;
	index: number;
}

export class Card extends Component<ICard> {
	protected cardTitle: HTMLElement;
	protected cardDescription?: HTMLElement;
	protected cardCategory?: HTMLElement;
	protected cardImage?: HTMLImageElement;	
	protected cardPrice: HTMLElement;	
	protected cardButton?: HTMLButtonElement;
	protected cardIndex?: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this.cardTitle = ensureElement<HTMLElement>('.card__title', container);
		this.cardDescription = container.querySelector('.card__text');
		this.cardCategory = container.querySelector('.card__category');
		this.cardImage = container.querySelector('.card__image');
		this.cardPrice = ensureElement<HTMLElement>('.card__price', container);		
		this.cardButton = container.querySelector('.button');
		this.cardIndex = container.querySelector('.basket__item-index');

		if(actions?.onClick) {
			if (this.cardButton) {
				this.cardButton.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	set title(value: string) {
		this.setText(this.cardTitle, value);
	}

	get title(): string {
		return this.cardTitle.textContent || '';
	}

	set description(value: string) {
		this.setText(this.cardDescription, value);
	}

	set category(value: string) {
		this.setText(this.cardCategory, value);

		const baseClass = 'card__category';

		this.cardCategory.className = baseClass;

		if (value === 'софт-скил') {
			this.cardCategory.classList.add('card__category_soft');
		} else if (value === 'другое') {
			this.cardCategory.classList.add('card__category_other');
		}
		else if (value === 'дополнительное') {
			this.cardCategory.classList.add('card__category_additional');
		}
		else if (value === 'кнопка') {
			this.cardCategory.classList.add('card__category_button');
		}
		else if (value === 'хард-скил') {
			this.cardCategory.classList.add('card__category_hard');
		}
	}

	set image(value: string) {
        this.setImage(this.cardImage, value, this.title)
    }

	set price(value: number | null) {
		value === null ? this.setText(this.cardPrice, 'Бесценно') : this.setText(this.cardPrice, `${value.toString()} синапсов`);
	}

	disabledButton(items: string[], id: string, price: number | null) {
		if(items.includes(id) || price === null) {
			this.setDisabled(this.cardButton, true);
		} else {
			this.setDisabled(this.cardButton, false);
		}
	}

	set index(value: number) {
		this.setText(this.cardIndex, value);
	}
}

							