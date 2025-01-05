# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Данные и типы данных, используемые в проекте

Карточка товара

```
interface IProductCard {
    _id: string;
    title: string;
    category: string;
    description: string;
    price: number;
    image: string;
}
```

Формы заказа 

```
interface IModalForms {
    payment: string;
    address: string;
    email: string;
    phone: string;
    total: number;
}
```

Интерфейс для коллекции карточек товара

```
interface IProductCardsData {
    cards: IProductCard[];
}
```

Данные карточки товара для отображения на главной странице

```
type TPublicInfo = Pick<IProductCard, 'title' | 'category' | 'image' | 'price'>;
```

Данные карточки товара для отображения в модальном окне 

```
type TCardInfo = Pick<IProductCard, 'title' | 'category' | 'description' | 'image' | 'price'>;
```

Данные списка товаров в корзине и их общей стоимости  

```
type TCart = Pick<IProductCard, 'title' | 'price'> & Pick<IModalForms, 'total'>;
```

Данные заказа, способа оплаты и адрес доставки


```
type TPaymentDelivery = Pick<IModalForms, 'payment' | 'address'>;
```

Данные покупателя


```
type TBuyerDetails = Pick<IModalForms, 'email' | 'phone'>;
```

Форма успешного оформления заказа

```
type TSuccessBuy = Pick<IModalForms, 'total'>;
```

## Архитектура проекта

Код проекта основан на MVP - паттерне и разделен на слои: 
- слой данных (Model) — отвечает за хранение и изменения данных;
- слой отображения (View) — отвечает за отображение данных на странице;
- слой управления (Presenter) — отвечает за связь отображения и данных.


### Базовый код 

#### Класс Api 
Реализует базовый набор сетевых операций с серверным Api (получение и отправка данных).
Используемые методы: 
- `get` - для получения данных с севрера. Выполняет GET запрос;
- `post`- для отправки данных на сервер. По умолчанию выполняет POST запрос. 

#### Класс EventEmitter
Обеспечивает работу событий. Его функции: возможность установить и снять слушателей событий, вызвать слушателей при возникновении события.
Основные методы, реализуемые классом `IEvents`: 
- `on` - подписка на событие;
- `emit`- инициализация события;
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в праметрах событие. 

### Слой данных (Modal)

#### Класс CardData
Класс отвечает за отображение карточек товаров на странице, за добавление карточек товаров в корзину и удаление товаров из корзины.\
Конструктор класса принимает инстант брокера событий.\
В полях класса хранятся следующие данные:
- _cards: IProductCard[] - массив объектов карточек;
- _preview: string | null - id карточки, выбранной для просмотра в модальном окне;
- events: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Так же класс представляет собой набор методов для взаимодействия с этими данными. 
- addProduct(card: IProductCard): void - добавляет товар в корзину;
- deleteProduct(cardId: string): void - удаляет товар из корзины;
- getProduct(cardId: string): IProductCard - открывает кврточку по ее id;
- checkStatus(data: Record<keyof TCart, string>): boolean - проверяет объект карточки на добавление в корзину; 
- сеттеры и геттеры для сохранения и получения данных из полей класса.

#### Класс ModalForms
Класс отвечает за хранение и логику работы с данными при оформлении покупки товаров.\
Конструктор класса принимает инстант брокера событий.\
В полях класса хранятся следующие данные:
- payment: string - способ оплаты;
- address: string - адрес доставки;
- email: string - email покупателя;
- phone: string - номер телефона покупателя;
- total: number - общая сумма покупки;
- events: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Так же класс представляет собой набор методов для взаимодействия с этими данными. 
- setBuyInfo(cards: IProductCard[]): void - сохраняет данные о покупке(выбранные товары);
- getTotalPriceInfo(total: string): IModalForms - возвращает общую стоимость товаров в корзине;
- setBuyerInfo(email: string, phone: string): IModalForms - сохраняет данные покупателя;
- setCartPayInfo(payment: string, address: string): IModalForms - сохраняет данные о способе оплаты и доставки;
- checkValidation(data: Record<keyof TPaymentDelivery, string>): boolean - проверяет объект на валидность (адрес доставки);
- сеттеры и геттеры для сохранения и получения данных из полей класса.

### Слой отображения (View)
Классы, отвечающие за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### Класс Modal
Реализует модальное окно. Предоставляет методы `open` и `close` для управления отображением модального окна. Устанавливает слушателя на клавиатуру, для закрытия окна по ESC, на клик в оверлей и на кнопку-крестик для закрытия попапа. 
- constructor(selector: string, events: IEvents) - конструктор принимает селектор, по которому в разметке страницы будет идентифицировано модальное окно и экземпляр класса `EventEmitter` для возможности инициации событий.

Поля класса:
- modal: HTMLElement - элемент модального окна;
- events: IEvents - брокер событий. 

#### Класс ModalWichConfirm 
Дополняет класс Modal. Предназначен для реализации модальных окон подтверждения. При открытии модального окна сохраняет полученный в параметр обработчик, который передается для выполнения при подтверждении формы. 

Поля класса:
- submitButton: HTMLButtonElement - кнопка подтверждения;
- _form: HTMLFormElement - элемент формы;
- formName: string - значение атрибута name формы;
- handleSubmit: Function - функция, на выполнение которой запрашивается подтверждение

Методы:
- setValid(isValid: boolean): void - изменяет активность кнопки подтверждения;
- open(handleSubmit: Function): void - принимает обработчика, передается при инициации события подтверждения, дополнительно расширяя родительский метод;
- get form: HTMLElement - геттер для получения элементов формы. 

#### Класс ModalWithForm
Дополняет класс Modal. Предназначен для реализации модальных окон с формой содержащей поля ввода. При сабмите инициирует событие передавая в него объект с данными из полей ввода формы. При изменении данных инициируется событие изменения данных.\
Предоставляет методы для отображения ошибок и управления активностью кнопки сохранения.

Поля класса:
- submitButton: HTMLButtonElement - кнопка подтверждения;
- _form: HTMLFormElement - элемент формы;
- formName: string - значение атрибута name формы;
- inputs: NodeListOf<HTMLInputElement> - коллекция всех полей ввода формы.

Методы:
- setValid(isValid: boolean): void - изменяет активность кнопки подтверждения;
- getInputValues(): Record<string, string> - возвращает объект с данными из полей формы (ключ - name инпута, значение - введенные данные пользователя);
- setInputValues(data: Record<string, string>): void - принимает объект с данными для заполнения полей формы;
- close(): void - очищает поля формы и деактивирует кнопку, дополнительно расширяя родительский метод;
- get form: HTMLElement - геттер для получения элементов формы. 

#### Класс Сard
Отвечает за отображение карточки. задавая в карточке данные категория, название, описание, стоимость и изображение товара. Класс используется для отображения карточек товара на странице сайта. В конструкторе класса передается DOM-элемент темплейта, что позволяет формировать карточки разных вариантов верстки. В классе устанавливаются слушатели на кнопки, в результате чего при взаимодействии пользователя с этими кнопками генерируется соотвествующее событие.\
Поля класса содержат элементы разметки карточки товара. Конструктор, кроме темплейта. принимает экземпляр класса `EventEmitter` для возможности инициации событий.

Методы:
- setData - заполняет атрибуты элементов карточки данными, а так же отображением иконки удаления. Иконка удаления будет появляться в случае добавления товара в корзину;
- deleteCard - удаляет товара из корзины;
- render - возвращает полностью заполненную карточку с установленным слушателем события;
- геттер id возвращает уникальный id карточки.

#### Класс CardsContainer
Отвечает за отображение блока с карточками товара на главной странице.\
Метод `getCard(cardElement: HTMLElement)` для отображения карточек на страницу.
Сеттер `container` для актуализации содержимого. В конструктор принимается контейнер, где размещены карточки. 

### Слой управления (Presenter) 

#### Класс AppApi
Принимает в конструктор экземпляр класса Api и предоставляет методы, которые реализуют взаимодействие с бэкендом сервиса. 

## Взаимодействие компонентов
Код, описывающий взаимодействие отображения и данных между собой находится в файле `index.ts`, выполняющий роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчика этих событий, описанных в `index.ts`.\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий. 
