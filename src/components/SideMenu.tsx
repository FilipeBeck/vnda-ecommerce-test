import { Link, List, ListItem, ListItemIcon, ListItemText, Divider, Paper } from '@material-ui/core'
import * as Icon from '@material-ui/icons'
import { Fragment } from 'react'
import { useRouter } from 'next/router'
import styles from './SideMenu.module.scss'
/**
 * Ícones dos itens de menu.
 */
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
	const router = useRouter()

	return <Paper className={`${styles.root} ${styles[props.isOpen && 'open' || 'closed']}`}>
		<List>
			{props.items.map((section, i) => <Fragment key={i}>
				{i > 0 && <Divider />}
				{section.map((item, i) => <ListItem key={i}>
					<Link className={styles.listItem} href={item.href + '?menu'}>
						<ListItemIcon>
							{icons[item.href]}
						</ListItemIcon>
						<ListItemText
							classes={{
								primary: router.pathname.includes(item.href) && styles.activeRoute || styles.inactiveRoute
							}}
						>
							{item.label}
						</ListItemText>
					</Link>
				</ListItem>)}
			</Fragment>)}
		</List>
	</Paper>
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