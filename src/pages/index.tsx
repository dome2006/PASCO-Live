/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { api } from '~/utils/api'
import styles from './index.module.css'
import Card from '~/components/Card'
import Header from '~/components/Header'
import Button from '~/components/Button'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { useScroll } from 'react-use'
import { useContext, useEffect, useRef } from 'react'
import { mainPageScrollContext } from './_app'

export default function Home() {
	const { data } = api.sensor.getAll.useQuery()

	const cards = data?.cards ?? []

	const router = useRouter()

	const { scroll, setScoll } = useContext(mainPageScrollContext)

	const scrollRef = useRef<HTMLDivElement>(null)
	const { y } = useScroll(scrollRef)

	useEffect(() => {
		scrollRef.current?.scrollTo(0, scroll)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [scrollRef])

	useEffect(() => {
		setScoll(y)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [y])

	return (
		<>
			<motion.div
				ref={scrollRef}
				className={styles.page}
				initial={{ scale: 0.9, opacity: 0 }}
				animate={{ scale: 1, opacity: 1, transition: { ease: [0, 0.58, 0.58, 1.25], duration: 0.2, delay: 0.1 } }}
				exit={{ scale: 0.9, opacity: 0, transition: { ease: [0.49, -0.28, 0.96, 0.66], duration: 0.2 } }}
			>
				<Header indicatorState={'green'}></Header>
				<main className={styles.main}>
					{cards.map((card, index) => {
						return (
							<Card
								key={index}
								title={card.name}
								indicatorState={card.status}
								rows={[
									{ label: 'ID', value: card.sensorID },
									{ label: 'Typ', value: card.sensorType },
									...(card.lastMeasurement > 0
										? [
												{ idSeperator: true },
												{ label: 'Messung alle', value: `${card.measurementDuration} Minuten` },
												{ label: 'Letzte Messung', value: `vor ${card.lastMeasurement} Minuten` },
												{ idSeperator: true },
												...card.measurements.map((measurement) => {
													return { label: measurement.name, value: measurement.value.toString() }
												}),
										  ]
										: []),
								]}
								onEdit={async () => {
									await router.push({ pathname: '/settings', query: { id: card.id } })
								}}
							></Card>
						)
					})}
				</main>
			</motion.div>
			<motion.div className={styles.fob} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
				<Button
					onClick={async () => {
						await router.push({ pathname: '/settings', query: { isAdd: true } })
					}}
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
						<path d="M5.25 0.5V5.75H0V9.25H5.25V14.5H8.75V9.25H14V5.75H8.75V0.5H5.25Z" fill="white" />
					</svg>
				</Button>
			</motion.div>
		</>
	)
}
