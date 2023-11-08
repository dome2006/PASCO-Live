/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type AppType } from 'next/app'

import { api } from '~/utils/api'

import '~/styles/globals.css'
import Head from 'next/head'
import { AnimatePresence } from 'framer-motion'
import { createContext, useState } from 'react'

export const mainPageScrollContext = createContext({
	scroll: 0,
	setScoll: (value: number) => {
		//empty
	},
})

const MyApp: AppType = ({ Component, pageProps, router }) => {
	const [scroll, setScoll] = useState(0)

	return (
		<>
			<Head>
				<title>PASCO Live</title>
				<meta name="description" content="PASCO Live" />

				<link rel="icon" href="/favicon.png" />

				<meta name="theme-color" content="#FFFFFF" />
			</Head>
			<mainPageScrollContext.Provider value={{ scroll, setScoll }}>
				<AnimatePresence mode={'sync'} initial={false}>
					<Component {...pageProps} key={router.pathname} />
				</AnimatePresence>
			</mainPageScrollContext.Provider>
		</>
	)
}

export default api.withTRPC(MyApp)

