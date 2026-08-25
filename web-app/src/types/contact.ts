export interface Contact {
    contactId: string
	surname: string
	name: string
	phone: string
	vkId: string
	telegramId: string
	whatsAppPhone: string
	github: string
	comment: string
	tags: string[]
}

export const newEmptyContact = () : Contact => {
	const emptyContact : Contact = {
		contactId: "",
		surname: "",
		name: "",
		phone: "",
		vkId: "",
		telegramId: "",
		whatsAppPhone: "",
		github: "",
		comment: "",
		tags: [],
	}

	return emptyContact
}

export const newEmptyContactForGraph = () : Contact => {
	const emptyContact : Contact = {
		contactId: "TEST",
		surname: "TEST",
		name: "TEST",
		phone: "",
		vkId: "",
		telegramId: "",
		whatsAppPhone: "",
		github: "",
		comment: "",
		tags: [],
	}

	return emptyContact
}
