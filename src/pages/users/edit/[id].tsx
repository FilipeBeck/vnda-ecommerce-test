import { GetServerSideProps } from 'next'
import Wrapper from '../../wrapper'
import { User, getCurrentUser, getUser, updateUser } from '../../../fetcher'
import { useState, useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import UserForm from '../../../components/UserForm'
import { Typography } from '@material-ui/core'
/**
 * Estilos.
 */
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
 * Edição de usuário.
 * @param props Atributos.
 */
const UserEdit: React.FC<Users.Props> = props => {
	const styles = useStyles()
	const { currentUser, editUser } = props

	const [userFields, setUserFields] = useState<Omit<User, 'tags'> & { tags: string }>({ ...editUser, tags: editUser.tags.join(' ')})
	const [saving, setSaving] = useState(false)

	const handleFormChange = useCallback((fields: UserForm.Fields) => {
		setUserFields({ ...userFields, ...fields })
	}, [setUserFields])

	const handleFormSubmit = useCallback(async () => {
		setSaving(true)

		try {
			await updateUser(editUser.id, { ...userFields, tags: userFields.tags.split(' ') })
			alert('Usuário atualizado')
		}
		catch (error) {
			console.log(error)
			alert(error.message)
		}
		finally {
			setSaving(false)
		}
	}, [userFields, setSaving])

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
				<Typography variant="h6">{editUser.email}</Typography>
			</div>
			<UserForm
				fields={userFields}
				submitText="Salvar"
				isSaving={saving}
				onChange={handleFormChange}
				onSubmit={handleFormSubmit}
			/>
		</main>
	</Wrapper>
}
declare namespace Users {
	export interface Props {
		currentUser: User
		editUser: User
	}
}
export default UserEdit
/**
 * Estabelece o usuário atualmente logado e o usuário em edição.
 * @param context Contexto.
 */
export const getServerSideProps: GetServerSideProps<Users.Props> = async context => {
	const userID = parseInt(context.query.id as string)

	return {
		props: {
			currentUser: await getCurrentUser(),
			editUser: await getUser(userID)
		}
	}
}