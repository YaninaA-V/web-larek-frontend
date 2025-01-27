import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface ISuccess {
	total: number;
}

interface ISuccessActions {
	onClick: () => void;
}

export class Success extends Component<ISuccess> {
	protected successClose: HTMLElement;
	protected successTotal: HTMLParagraphElement;

	constructor(container: HTMLElement, actions: ISuccessActions) {
		super(container);

		this.successClose = ensureElement<HTMLElement>('.order-success__close', this.container);
		this.successTotal = ensureElement<HTMLParagraphElement>('.order-success__description', this.container);

		if (actions?.onClick) {
			this.successClose.addEventListener('click', actions.onClick);
		}
	}

	set total(total: number) {
		this.setText(this.successTotal, `${total.toString()} синапсов`);
	}
}