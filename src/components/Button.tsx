import ContentLoader from 'react-content-loader'
import styles from './Button.module.css'

import classnames from 'classnames'

export default function Card({
	children,
	onClick,
	loading: loading,
	type = 'primary',
}: {
	children?: React.ReactNode
	onClick?: () => void
	loading?: boolean
	type?: 'primary' | 'secondary' | 'danger' | 'none'
}) {
	return (
		<button disabled={loading} className={classnames(styles.container, styles[type], loading && styles.loading)} onClick={onClick}>
			<div className={styles.children}>{children}</div>
			{loading && (
				<ContentLoader className={styles.contentLoader} speed={0.5} width={'calc(100% + 14px)'} height={'100%'} backgroundColor="#2397f300" foregroundColor="#b0dcff">
					<rect x="0" y="0" rx="0" ry="0" width="400" height="160" />
				</ContentLoader>
			)}
		</button>
	)
}
