import { GetServerSideProps } from 'next'
import Wrapper from '../wrapper'
import { User, getCurrentUser, createUser } from '../../fetcher'
import { useState, useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import UserForm from '../../components/UserForm'
import { Typography } from '@material-ui/core'

const useStyles = makeStyles({
	title: {
		display: 'grid',
		gridTemplateColumns: 'repeat(3, max-content)',
		gridColumnGap: '10px',
		alignItems: 'center',
		marginBottom: '30px',
		'& > h6': {
			fontWeight: 'bold',
			color: '#677181',
			'&:first-child': {
				fontWeight: 'normal',
			},
			'&:last-child': {
				color: '#4B4D5B',
			}
		},
	},
})
/**
 * Cadastro de usuário.
 * @param props Atributos.
 */
const UserCreation: React.FC<Users.Props> = props => {
	const styles = useStyles()
	const currentUser = props.currentUser

	const [userFields, setUserFields] = useState<UserForm.Fields>({
		email: '',
		external_code: '',
		name: '',
		role: User.Role.LOCAL,
		tags: ''
	})

	const [isSaving, setIsSaving] = useState(false)

	const handleFormChange = useCallback((fields: UserForm.Fields) => {
		setUserFields(fields)
	}, [setUserFields])

	const handleFormSubmit = useCallback(async () => {
		setIsSaving(true)

		try {
			const newUser = {
				...userFields,
				tags: userFields.tags.split(' '),
			}

			await createUser(newUser)
			// Tentei usar `router.push`, mas parece não estar executando `getServerSideProps` ao navegar via cliente (erro acusando propriedades indefinidas durante a renderização quando as mesmas são estabelecidas em `getServerSideProps`). Então, tive que efetuar uma navegação nativa.
			location.href = '/users' + location.search
			
		}
		catch (error) {
			console.log(error)
			alert(error.message)
		}
		finally {
			setIsSaving(false)
		}
	}, [userFields, setIsSaving])

	return <Wrapper
		top={{
			user: {
				avatar: currentUser.avatar,
				email: currentUser.email,
				options: [],
			},
			searchTerm: null,
		}}
	>
		<main>
			<div className={styles.title}>
				<Typography variant="h6">Usuários</Typography>
				<Typography variant="h6">/</Typography>
				<Typography variant="h6">Cadastrar</Typography>
			</div>
			<UserForm
				fields={userFields}
				submitText="Cadastrar"
				isSaving={isSaving}
				onChange={handleFormChange}
				onSubmit={handleFormSubmit}
			/>
		</main>
	</Wrapper>
}
declare namespace Users {
	/**
	 * Atributos.
	 */
	export interface Props {
		/**
		 * Usuário atualmente logado.
		 */
		currentUser: User
	}
}
export default UserCreation
/**
 * Estabelece o usuário atualmente logado.
 */
export const getServerSideProps: GetServerSideProps<Users.Props> = async () => {
	return {
		props: {
			currentUser: await getCurrentUser(),
		}
	}
}