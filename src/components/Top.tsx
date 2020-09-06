import { AppBar, Toolbar, IconButton, InputBase, Typography, Avatar, MenuItemProps, Menu, MenuItem, Button } from '@material-ui/core'
import * as Icon from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import { useState, useCallback } from 'react'

const useStyles = makeStyles({
	appBar: {
		position: 'static',
		backgroundColor: '#1A2734',
	},
	menuButton: {
		color: "white",
		fontSize: '1cm',
	},
	search: {
		position: 'relative',
		marginLeft: '20px',
		height: '40px',
		backgroundColor: '#404C56',
		borderRadius: '20px',
	},
	searchIcon: {
		position: 'absolute',
		width: '30px',
		height: '100%',
		marginLeft: '10px',
		color: '#2F3944'
	},
	searchInput: {
		height: '100%',
		paddingLeft: '40px',
		color: '#ddd',
	},
	title: {
		flexGrow: 1,
		textAlign: 'center',
	},
	user: {
		display: 'flex',
		alignItems: 'center',
	},
	menu: {
		color: '#BBBBBB',
		textTransform: 'none',
	},
})

const Top: React.FC<Top.Props> = props => {
	const user = props.user
	const styles = useStyles()
	const [isMenuOpen, setIsMenuOpen] = useState(false)

	const handleMenuClick = useCallback(() => {
		setIsMenuOpen(!isMenuOpen)
	}, [isMenuOpen])

	const handleChangeSearchTerm = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		if (props.onChangeSearchTerm) {
			props.onChangeSearchTerm(event.target.value)
		}
	}, [props.onChangeSearchTerm])

	return <AppBar className={styles.appBar}>
		<Toolbar>
			<IconButton edge="start" onClick={props.onMenuClick}>
				<Icon.Menu className={styles.menuButton}/>
			</IconButton>
			{props.searchTerm !== null && <div className={styles.search}>
				<Icon.Search className={styles.searchIcon} />
				<InputBase
					className={styles.searchInput}
					placeholder="Pesquisar"
					value={props.searchTerm}
					onChange={handleChangeSearchTerm}
				/>
			</div>}
			<Typography variant="h4" className={styles.title}>Vnda</Typography>
			<div className={styles.user}>
				<Avatar src={user.avatar}/>
				<Button className={styles.menu} onClick={handleMenuClick}>
					<span>{user.email}</span>
					{isMenuOpen && <Icon.ArrowDropUp/> || <Icon.ArrowDropDown/>}
					<Menu open={isMenuOpen}>
						{user.options.map(option => <MenuItem {...option as any}/>)}
					</Menu>
				</Button>
			</div>
		</Toolbar>
	</AppBar>
}
namespace Top {
	export interface Props {
		user: User
		searchTerm: string | null
		onChangeSearchTerm?(text: string): void
		onMenuClick(): void
	}

	export interface User {
		avatar?: string
		email: string
		options: MenuItemProps[] // Como o layout não é especificado, achei melhor usar props de `MenuItem` ao invés de deduzir propriedades específicas
	}
}

export default Top