import Head from 'next/head'

// import { api } from '~/utils/api'
import styles from './index.module.css'
import Card from '~/components/Card'
import Header from '~/components/Header'
import Button from '~/components/Button'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { useScroll } from 'react-use'
import { useEffect, useRef } from 'react'

export default function Home() {
	// const hello = api.post.hello.useQuery({ text: 'from tRPC' })

	const router = useRouter()

	const scrollRef = useRef<HTMLDivElement>(null)
	const { y } = useScroll(scrollRef)

  useEffect(() => {
    scrollRef.current?.scrollTo(0, router.query.y ? parseInt(router.query.y as string) : 0)
    //gewollt nur einmal ausgeführt
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollRef])

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		router.replace({ pathname: '/', query: { y } }, undefined, { shallow: true })
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
							await router.push({ pathname: '/settings' })
						}}
					></Card>
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
							await router.push({ pathname: '/settings' })
						}}
					></Card>
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
							await router.push({ pathname: '/settings' })
						}}
					></Card>
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
							await router.push({ pathname: '/settings' })
						}}
					></Card>
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
							await router.push({ pathname: '/settings' })
						}}
					></Card>
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
							await router.push({ pathname: '/settings' })
						}}
					></Card>
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
							await router.push({ pathname: '/settings' })
						}}
					></Card>
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
							await router.push({ pathname: '/settings' })
						}}
					></Card>
				</main>
			</motion.div>
			<div className={styles.fob}>
				<Button
					onClick={async () => {
						await router.push({ pathname: '/settings', query: { isAdd: true } })
					}}
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
						<path d="M5.25 0.5V5.75H0V9.25H5.25V14.5H8.75V9.25H14V5.75H8.75V0.5H5.25Z" fill="white" />
					</svg>
				</Button>
			</div>
		</>
	)
}

