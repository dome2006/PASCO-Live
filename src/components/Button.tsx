import styles from './Button.module.css'

import classnames from 'classnames'

export default function Card({ children, type = 'primary' }: { children: React.ReactNode; type?: 'primary' | 'secondary' }) {
	return <div className={classnames(styles.container, styles[type])}>{children}</div>
}
