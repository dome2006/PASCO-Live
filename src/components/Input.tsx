import { type ChangeEventHandler } from 'react';
import styles from './Input.module.css'

export default function Component({ children, unit, width, value, onChange }: { children: React.ReactNode; unit?: string; width?: string, value?: string, onChange?: ChangeEventHandler<HTMLInputElement> }) {
	return (
		<div className={styles.group}>
			<p className={styles.title}>{children}</p>
			<div style={{ width }} className={styles.inputRow}>
				<input style={{ width }} value={value} autoCorrect={'false'} className={styles.input} onChange={onChange}/>
				<p>{unit}</p>
			</div>
		</div>
	)
}
