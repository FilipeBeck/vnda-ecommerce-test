import { GetServerSideProps } from 'next'
import Wrapper from '../wrapper'
import { User, getUsers, getCurrentUser, deleteUser } from '../../fetcher'
import { IconButton, Link, Dialog, DialogTitle, Typography, Button } from '@material-ui/core'
import * as Icon from '@material-ui/icons'
import { useState, useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
/**
 * Estilos.
 */
const useStyles = makeStyles({
	dialog: {
		padding: '30px 50px',
		'& > h2': {
			textAlign: 'center',
		},
		'& > div:last-child': {
			display: 'flex',
			justifyContent: 'space-around',
			marginTop: '20px',
		},
	},
	topHeader: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: '10px',
	},
	topTitle: {
		color: '#4B4D5B',
	},
	topNewUserButton: {
		padding: '10px',
		color: 'black',
		border: 'solid 1px #CDD1D7',
		borderRadius: '2px',
	},
	gridContainer: {
		display: 'grid',
		gridTemplateColumns: '50px auto',
		alignItems: 'center',
		padding: '10px',
		backgroundColor: 'white',
	},
	gridContained: {
		display: 'grid',
		gridTemplateColumns: 'repeat(3, 1fr)',
		alignItems: 'center',
		gridColumnGap: '10px',
		'& > span': {
			color: '#4B4D5B',
		}
	},
	contentHeader: {
		fontWeight: 'bold',
		'& > span': {
			color: 'black',
		}
	},
	gridLineItem: {
		borderTop: 'solid 1px #E6E7EB',
	},
	deleteUserButton: {
		margin: '5px',
		height: '10px',
	}
})
/**
 * Verifica se `term` está contido em algun dos elementos de `texts`.
 * @param term Termo a ser pesquisado.
 * @param texts Textos onde pesquisar o termo.
 */
function matchSearchTerm(term: string, ...texts: string[]): boolean {
	term = term.toLocaleLowerCase()
	return texts.some(text => text && text.toLocaleLowerCase().includes(term))
}
/**
 * Listagem de usuários.
 * @param props Atributos.
 */
const Users: React.FC<Users.Props> = props => {
	const styles = useStyles()
	const { currentUser } = props
	const [searchTerm, setSearchTerm] = useState('')
	const [deletingUser, setDeletingUser] = useState<number | null>(null)
	const [allUsers, setAllUsers] = useState(props.allUsers)

	const handleChangeSearchTerm = useCallback((text: string) => {
		setSearchTerm(text)
	}, [setSearchTerm])

	const handleDeleteUser = useCallback((event: React.SyntheticEvent<HTMLButtonElement>) => {
		const id = parseInt(event.currentTarget.id)
		setDeletingUser(id)
	}, [])

	const handleCancelDeleteUser = useCallback(() => {
		setDeletingUser(null)
	}, [setDeletingUser])

	const handleConfirmDeleteUser = useCallback(async () => {
		if (deletingUser === null) {
			throw new Error()
		}

		try {
			await deleteUser(deletingUser)
			setAllUsers(await getUsers())
		}
		catch (error) {
			alert(error.message || 'Houve um erro na exclusão.')
		}
		finally {
			setDeletingUser(null)
		}
	}, [deletingUser, setDeletingUser])

	return <Wrapper
		top={{
			user: {
				avatar: currentUser.avatar,
				email: currentUser.email,
				options: [],
			},
			searchTerm,
			onChangeSearchTerm: handleChangeSearchTerm,
		}}
	>
		<main>
			<Dialog classes={{ paper: styles.dialog}} open={deletingUser !== null}>
				<DialogTitle>Confirmar exclusão</DialogTitle>
				<Typography variant="subtitle2">Essa operação não pode ser desfeita. Deseja continuar?</Typography>
				<div>
					<Button color="primary" startIcon={<Icon.Undo/>} onClick={handleCancelDeleteUser}>Não</Button>
					<Button color="secondary" startIcon={<Icon.Delete/>} onClick={handleConfirmDeleteUser}>Sim</Button>
				</div>
			</Dialog>
			<div className={styles.topHeader}>
				<Typography variant="h6" className={styles.topTitle}>Usuários</Typography>
				<Link className={styles.topNewUserButton} href="users/new">Novo Usuário</Link>
			</div>
			<div>
				<div className={styles.gridContainer}>
					<span></span>
					<div className={`${styles.gridContained} ${styles.contentHeader}`}>
						<span>E-mail</span>
						<span>Nome</span>
						<span>Código externo</span>
					</div>
				</div>
				<div className="body">
					{allUsers.map(user => matchSearchTerm(searchTerm, user.email, user.name, user.external_code) && (
						<div key={user.id} className={`${styles.gridContainer} ${styles.gridLineItem}`}>
							<IconButton className={styles.deleteUserButton} id={String(user.id)} onClick={handleDeleteUser}>
								<Icon.Close/>
							</IconButton>
							<Link
								key={user.id}
								className={styles.gridContained}
								href={`users/edit/${user.id}`}
							>
								<span className="email">{user.email}</span>
								<span className="name">{user.name}</span>
								<span className="externalCode">{user.external_code}</span>
							</Link>
						</div>)
					)}
				</div>
			</div>
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
		/**
		 * Lista de todos os usuários.
		 */
		allUsers: User[]
	}
}
export default Users
/**
 * Estabelece o usuário atualmente logado e a lista de todos os usuários.
 */
export const getServerSideProps: GetServerSideProps<Users.Props> = async () => {
	return {
		props: {
			currentUser: await getCurrentUser(),
			allUsers: await getUsers(),
		}
	}
}