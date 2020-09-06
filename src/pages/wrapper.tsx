import { GetStaticProps } from 'next'
import ErrorPage from 'next/error'
import { makeStyles } from '@material-ui/core/styles'
import Head from 'next/head'
import Top from '../components/Top'
import SideMenu from '../components/SideMenu'
import sideMenuItems from '../side-menu-items.json'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
/**
 * Estilos.
 */
const useStyles = makeStyles({
	root: {
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
	},
	body: {
		display: 'flex',
		height: '-webkit-fill-available',
	}
})
/**
 * Componente empacotador das páginas contendo a estrutura comum a todas elas. Implementado seguindo o comentário em https://github.com/vercel/next.js/issues/2332#issuecomment-310153749. Poderia deixar fora de "pages", mas me pareceu mais semântico dentro.
 * @param props Atributos.
 */
const Wrapper: React.FC<Wrapper.Props> = props => {
	const styles = useStyles()
	const { isNavigated, top } = props
	const router = useRouter()
	const isSideMenuVisible = router.query.menu !== 'false'

	const handleMenuClick = useCallback(() => {
		router.replace({ pathname: location.pathname, query: { menu: isSideMenuVisible && 'false' || 'true' } })
	}, [isSideMenuVisible])

	if (isNavigated) {
		return <ErrorPage statusCode={404}/>
	}

	return <div className={styles.root}>
		<Head>
			<title>Vnda Ecommerce test</title>
			<link rel="icon" href="/favicon.ico" />
		</Head>
		<Top {...top} onMenuClick={handleMenuClick}/>
		<div className={styles.body}>
			<SideMenu
				isOpen={isSideMenuVisible}
				items={sideMenuItems}
			/>
			{props.children}
		</div>
	</div>
}
declare namespace Wrapper {
	/**
	 * Propriedades estáticas .
	 */
	export interface StaticProps {
		/**
		 * Determina se o componente está sendo renderizado como uma página em resposta à uma navegação do usuário.
		 */
		isNavigated?: boolean
	}
	/**
	 * Atributos.
	 */
	export interface Props extends StaticProps {
		top: Omit<Top.Props, 'onMenuClick'>
	}
	/**
	 * Parâmetros da URL.
	 */
	export interface Query {
		/**
		 * Determina se deve exibir o menu lateral.
		 */
		sideMenu?: boolean
	}
}
export default Wrapper
/**
 * Estabelece a flag determinando o componente está sendo renderizado como uma página em resposta à uma navegação do usuário.
 */
export const getStaticProps: GetStaticProps<Wrapper.StaticProps> = async () => {
	return {
		props: { isNavigated: true }
	}
}