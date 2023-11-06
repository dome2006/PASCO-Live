// import { api } from '~/utils/api'
import styles from './settings.module.css'
import Header from '~/components/Header'
import Card from '~/components/Card'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'

export default function Home() {
	// const hello = api.post.hello.useQuery({ text: 'from tRPC' })

	const router = useRouter()

	return (
		<>
			<motion.div
				onClick={() => {
					router.back()
				}}
				className={styles.overlay}
				transition={{ duration: 0.1 }}
				initial={{ scale: 1.3, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				exit={{ scale: 1.3, opacity: 0 }}
			>
				<h1>Einstellungen hier</h1>
			</motion.div>
		</>
	)
}
