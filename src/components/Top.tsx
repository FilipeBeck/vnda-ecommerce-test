import { AppBar, Toolbar, IconButton, InputBase, Typography, Avatar, MenuItemProps, Menu, MenuItem, Button } from '@material-ui/core'
import * as Icon from '@material-ui/icons'
import { useState, useCallback } from 'react'
import styles from './Top.module.scss'
import React from 'react'

const Top: React.FC<Top.Props> = props => {
	const user = props.user
	const [isMenuOpen, setIsMenuOpen] = useState(false)

	const handleMenuClick = useCallback(() => {
		setIsMenuOpen(!isMenuOpen)
	}, [isMenuOpen])

	const handleChangeSearchTerm = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		if (props.onChangeSearchTerm) {
			props.onChangeSearchTerm(event.target.value)
		}
	}, [props.onChangeSearchTerm])

	return <AppBar className={styles.root} position="static">
		<Toolbar>
			<IconButton edge="start" onClick={props.onMenuClick}>
				<Icon.Menu className={styles.menuButton} color="secondary"/>
			</IconButton>
			{props.searchTerm !== null && <div className={styles.search}>
				<Icon.Search className={styles.icon} color="primary"/>
				<InputBase
					className={styles.input}
					placeholder="Pesquisar"
					value={props.searchTerm}
					onChange={handleChangeSearchTerm}
				/>
			</div>}
			<Typography variant="h4" className={styles.title}>Vnda</Typography>
			<div className={styles.user}>
				<Avatar src={user.avatar}/>
				<Button className={styles.menu} onClick={handleMenuClick}>
					<Typography color="secondary">{user.email}</Typography>
					{React.createElement(isMenuOpen && Icon.ArrowDropUp || Icon.ArrowDropDown, { color: 'secondary' })}
					{/* {isMenuOpen && <Icon.ArrowDropUp color="action" /> || <Icon.ArrowDropDown color="action"/>} */}
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