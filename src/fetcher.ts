import axiosFetch from 'axios'
/**
 * Representa um usuário do sistema.
 */
export interface User {
	/**
	 * Token de acesso.
	 */
	access_token: string | null
	/**
	 * Determina se o usuário é administrador do sistema.
	 */
	admin: boolean
	/**
	 * Data de criação do usuário.
	 */
	created_at: string
	/**
	 * Email do usuário.
	 */
	email: string
	/**
	 * Código externo do usuário.
	 */
	external_code: string
	/**
	 * Identificador do usuário.
	 */
	id: number
	/**
	 * Nome do usuário.
	 */
	name: string
	/**
	 * Telefone do usuário.
	 */
	phone: string | null
	/**
	 * Código de área do telefone do usuário.
	 */
	phone_area: string | null
	/**
	 * Determina se a senha do usuário deve ser renovada.
	 */
	renew_password: boolean
	/**
	 * Função do usuário.
	 */
	role: User.Role
	/**
	 * Tags relacionadas com o usuário.
	 */
	tags: string[]
	/**
	 * Data da última vez que os dados do usuário foram atualizados.
	 */
	updated_at: string
	/**
	 * Imagem do usuário. Não existe na API, mas mantenho devido ao layout especificado.
	 */
	avatar?: string
}
export namespace User {
	/**
	 * Função do usuário. Relacionei com a propriedade `role` dos retornos da API (https://i.imgur.com/EDlQRIc.png) e segui a ordem de prioridade de acordo com a especificação do teste (https://i.imgur.com/KcpAojM.png)
	 */
	export enum Role {
		/**
		 * Gestor.
		 */
		MANAGER = 0,
		/**
		 * Agente.
		 */
		AGENT = 1,
		/**
		 * Local.
		 */
		LOCAL = 2
	}
	/**
	 * Dados de cadastro de usuário.
	 */
	export type CreationData = Pick<User, 'email' | 'external_code' | 'name' | 'role' | 'tags'>
}
/**
 * Retorna o usuário logado. Utilizo um mock (e pego o token do ambiente).
 */
export async function getCurrentUser(): Promise<User> {
	return {
		access_token: process.env.NEXT_PUBLIC_DEV_TOKEN as string,
		admin: false,
		created_at: new Date().toISOString(),
		email: 'filipe.beck@gmail.com',
		external_code: 'POA',
		id: 84,
		name: 'Filipe Roberto Beck',
		phone: '996228186',
		phone_area: '51',
		renew_password: false,
		role: User.Role.LOCAL,
		tags: ['dev'],
		updated_at: new Date().toISOString(),
		avatar: 'https://scontent.fpoa4-1.fna.fbcdn.net/v/t1.0-9/91825183_2791610260922470_1056639766738501632_o.jpg?_nc_cat=103&_nc_sid=09cbfe&_nc_ohc=MhWEj7wYP1AAX9Gmrao&_nc_ht=scontent.fpoa4-1.fna&oh=1897223fee6b9b6deeec7c3e5027dd2b&oe=5F7893D5'
	}
}
/**
 * Retorna os dados do usuário especificado.
 * @param id Identificador do usuário.
 */
export function getUser(id: number): Promise<User> {
	return fetch('GET', endPoint('users', id))
}
/**
 * Retorna todos os usuários cadastrados.
 */
export function getUsers(): Promise<User[]> {
	return fetch('GET', endPoint('users'))
}
/**
 * Cadastra um novo usuário.
 * @param data Dados cadastrais.
 */
export function createUser(data: User.CreationData): Promise<void> {
	return fetch('POST', endPoint('users'), data)
}
/**
 * Atualiza o usuário especificado.
 * @param id Identificador dos usuários.
 * @param data Dados de atualização do cadastro.
 */
export function updateUser(id: number, data: User): Promise<void> {
	return fetch('PATCH', endPoint('users', id), data)
}
/**
 * Exclui o usuário especificado.
 * @param id Identificador do usuário.
 */
export function deleteUser(id: number): Promise<void> {
	return fetch('DELETE', endPoint('users', id))
}
/**
 * Requisita um recurso à API. É retornado o valor resolvido da requisição porque a mesma retorna uma `AxiosPromise`. Uma `Promise` nativa é preferível caso troque o framework.
 * @param method Método da requisição.
 * @param url URL da requisição.
 * @param body Corpo da requisição.
 */
async function fetch(method: fetch.Method, url: string, body?: any): Promise<any> {
	const currentUser = await getCurrentUser()
	const response = await axiosFetch(url, {
		method,
		headers: {
			'Authorization': `Token token="${currentUser.access_token}"`
		},
		data: body
	})

	return response.data
}
namespace fetch {
	/**
	 * Método de requisição.
	 */
	export type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE'
}
/**
 * Monta uma URL para API anexando `components` no final.
 * @param components Partes que formam o final da URL.
 */
function endPoint(...components: any[]): string {
	const apiOrigin = process.env.NEXT_PUBLIC_API_ORIGIN
	const apiBasePath = process.env.NEXT_PUBLIC_API_BASE_PATH

	if (!apiOrigin || !apiBasePath) {
		throw new Error()
	}

	return new URL(components.join('/'), apiOrigin + apiBasePath).href
}