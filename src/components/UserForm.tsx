import { TextField, Button, MenuItem } from '@material-ui/core'
import { useCallback } from 'react'
import { User } from '../fetcher'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
	root: {
		display: 'grid',
		gridTemplateRows: 'repeat(6, 1fr)',
		gridGap: '20px',
		'& > label': {
			display: 'flex',
			flexDirection: 'column',
			'& > span': {
				fontWeight: 'bold',
				marginBottom: '10px',
			},
			'& > div': {
				'& input': {
					height: '1em',
				}
			},
		},
	},
	save: {
		width: 'max-content',
		height: 'max-content',
		padding: '10px 20px',
		backgroundColor: '#4B4D5B',
		border: 'solid 1px #363842',
		borderRadius: '2px',
		textTransform: 'none',
		color: 'white',
		'&:hover': {
			color: '#363842',
		},
		'&:disabled': {
			backgroundColor: 'white'
		},
	},
})

const fields = [
	{ id: 'email', label: 'E-mail' },
	{ id: 'name', label: 'Nome' },
	{ id: 'role', label: 'Função' },
	{ id: 'external_code', label: 'Código externo' },
	{ id: 'tags', label: 'Tags' },
]

const UserForm: React.FC<UserForm.Props> = props => {
	const styles = useStyles()

	const handleChange = useCallback((event: React.ChangeEvent<{ id: string, value: string}>) => {
		props.onChange({
			...props.fields,
			[event.target.id || 'role']: event.target.value
		})
	}, [props.fields, props.onChange])

	const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		props.onSubmit()
	}, [props.onSubmit])

	return <form className={styles.root} onSubmit={handleSubmit}>
		{fields.map(field => <label key={field.id}>
			<span>{field.label}</span>
			<TextField
				id={field.id}
				value={props.fields[field.id as keyof UserForm.Fields]}
				onChange={handleChange}
				variant="outlined"
				select={field.id === 'role'}
			>
				<MenuItem value={User.Role.MANAGER}>Administrador</MenuItem>
				<MenuItem value={User.Role.AGENT}>Agente</MenuItem>
				<MenuItem value={User.Role.LOCAL}>Local</MenuItem>
			</TextField>
		</label>)}
		<Button className={styles.save} type="submit" disabled={props.isSaving}>{props.submitText}</Button>
	</form>
}
namespace UserForm {
	export interface Props {
		fields: Fields
		submitText: string
		isSaving: boolean
		onChange(fields: Fields): void
		onSubmit(): void
	}

	export interface Fields {
		email: string
		name: string
		role: User.Role
		external_code: string
		tags: string
	}
}

export default UserForm