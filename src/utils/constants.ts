export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {
    headers: {
		authorization: `${process.env.API_TOKEN}`,
		'Content-Type': 'application/json',
	},
};

export const constraintsCard = {
	name: {
		presence: { message: '^Поле не может быть пустым', allowEmpty: false },
		length: {
			minimum: 2,
			maximum: 30,
      tooShort: "^Слишком короткое имя, необходимо %{count} буквы или больше",
      tooLong: "^Слишком длинное имя, необходимо %{count} букв или меньше",
		},
		format: {
			pattern: /^[a-zA-Zа-яА-ЯёЁ\- ]+$/,
			message:
				'^Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы',
		},
	},
  link: {
		presence: { message: '^Поле не может быть пустым', allowEmpty: false },
		url: {message: '^Некорректный адрес'},
  }
};