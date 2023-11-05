import styles from './Header.module.css'

export default function Component({ indicatorState }: { indicatorState: 'green' | 'yellow' | 'red' }) {
	return (
		<header className={styles.header}>
			<h1 className={styles.title}>PASCO Live</h1>
			<div className={styles.indicator} style={{ backgroundColor: `var(--${indicatorState})` }}></div>
		</header>
	)
}
