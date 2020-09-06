import { makeStyles } from '@material-ui/core/styles'
import { Link, List, ListItem, ListItemIcon, ListItemText, Divider } from '@material-ui/core'
import * as Icon from '@material-ui/icons'
import { Fragment } from 'react'
import { useRouter } from 'next/router'
/**
 * Estilos.
 */
const useStyles = makeStyles({
	root: {
		backgroundColor: '#E7E7E7',
		height: '-webkit-fill-available'
	},
	open: {
		width: 'auto',
		overflow: 'hidden',
	},
	closed: {
		width: 0,
		overflow: 'hidden',
	},
	boldWeight: {
		fontWeight: 'bold'
	},
	normalWeight: {
		fontWeight: 'normal'
	},
	item: {
		display: 'flex',
		alignItems: 'center',
		padding: '10px',
		paddingRight: '75px',
		color: '#676C76',
	}
})

const icons: Record<string, any> = {
	'/orders': <Icon.Inbox/>,
	'/carts': <Icon.ShoppingCart/>,
	'/products': <Icon.ViewList/>,
	'/tags': <Icon.LocalOffer/>,
	'/users': <Icon.Group/>,
	'/promotions': <Icon.BookmarkBorder/>,
	'/menu': <Icon.AccountTree/>,
	'/pages': <Icon.LibraryBooks/>,
	'/banners': <Icon.YouTube/>,
}

const SideMenu: React.FC<SideMenu.Props> = props => {
	const styles = useStyles()
	const router = useRouter()

	return <div className={`${styles.root} ${styles[props.isOpen && 'open' || 'closed']}`}>
		<List>
			{props.items.map((section, i) => <Fragment key={i}>
				{i > 0 && <Divider />}
				{section.map((item, i) => <ListItem key={i}>
					<Link className={styles.item} href={item.href + '?menu'}>
						<ListItemIcon>
							{icons[item.href]}
						</ListItemIcon>
						<ListItemText
							classes={{
								primary: router.pathname.includes(item.href) && styles.boldWeight || styles.normalWeight
							}}
						>
							{item.label}
						</ListItemText>
					</Link>
				</ListItem>)}
			</Fragment>)}
		</List>
	</div>
}
namespace SideMenu {
	export interface Props {
		items: Item[][]
		isOpen: boolean
	}
	export interface Item {
		href: string
		label: string
	}
}

export default SideMenu