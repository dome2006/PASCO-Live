import styles from './Button.module.css'

import classnames from 'classnames'

export default function Card({ children, onClick, type = 'primary' }: { children?: React.ReactNode; onClick?: () => void; type?: 'primary' | 'secondary' | "none" }) {
	return (
		<button className={classnames(styles.container, styles[type])} onClick={onClick}>
			{children}
		</button>
	)
}
