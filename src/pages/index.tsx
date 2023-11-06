import Head from 'next/head'

// import { api } from '~/utils/api'
import styles from './index.module.css'
import Card from '~/components/Card'
import Header from '~/components/Header'
import Button from '~/components/Button'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'

export default function Home() {
	// const hello = api.post.hello.useQuery({ text: 'from tRPC' })

	const router = useRouter()

	return (
		<>
			<motion.div className={styles.page} transition={{duration: 0.1}} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
				<Header indicatorState={'green'}></Header>
				<main className={styles.main}>
					<Card
						title={'Zimmertemperatur'}
						indicatorState={'green'}
						rows={[
							{ label: 'ID', value: '202-838' },
							{ label: 'Typ', value: 'Temperatur' },
							{ idSeperator: true },
							{ label: 'Messung alle', value: '5 Minuten' },
							{ label: 'Letzte Messung', value: 'vor 3 Minuten' },
							{ idSeperator: true },
							{ label: 'Temperatur', value: '20°C' },
							{ label: 'Batterie', value: '52%' },
						]}
						onEdit={async () => {
							await router.push('/settings')
						}}
					></Card>
				</main>
			</motion.div>
			<motion.div className={styles.fob} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
				<Button>
					<svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
						<path d="M5.25 0.5V5.75H0V9.25H5.25V14.5H8.75V9.25H14V5.75H8.75V0.5H5.25Z" fill="white" />
					</svg>
				</Button>
			</motion.div>
		</>
	)
}

