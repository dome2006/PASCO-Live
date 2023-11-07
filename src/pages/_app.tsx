/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type AppType } from 'next/app'

import { api } from '~/utils/api'

import '~/styles/globals.css'
import Head from 'next/head'
import { AnimatePresence } from 'framer-motion'
import { createContext } from 'react'

const MyApp: AppType = ({ Component, pageProps, router }) => {
	return (
		<>
			<Head>
				<title>PASCO Live</title>
				<meta name="description" content="PASCO Live" />

				<link rel="icon" href="/favicon.png" />

				<meta name="theme-color" content="#FFFFFF" />
			</Head>
			<AnimatePresence mode={'sync'} initial={false}>
				<Component {...pageProps} key={router.pathname} />
			</AnimatePresence>
		</>
	)
}

export default api.withTRPC(MyApp)

