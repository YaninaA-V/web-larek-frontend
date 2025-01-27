import { Form } from "./common/Form";
import { IModelForms } from "../types";
import { IEvents } from "./base/events";

export class Order extends Form<IModelForms> {
    protected orderButtons:HTMLButtonElement[];

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this.orderButtons = Array.from(this.container.querySelectorAll('.button_alt')) as HTMLButtonElement[];
    
        this.orderButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.payment = button.name;
                events.emit('payment:change', button);
            });
            });        
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }

    set payment(name: string) {
        this.orderButtons.forEach((button) => {
            if (button.name === name) {
                button.classList.add('button_alt-active');
            } else {
                button.classList.remove('button_alt-active');
            }
        });
    }
}

export class Contacts extends Form<IModelForms> {
    protected contactsButtons:HTMLButtonElement[];

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }    
        }
    



