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


import Router from 'next/router'

export const fixTimeoutTransition = (timeout: number): void => {
  Router.events.on('beforeHistoryChange', () => {
    // Create a clone of every <style> and <link> that currently affects the page. It doesn't matter
    // if Next.js is going to remove them or not since we are going to remove the copies ourselves
    // later on when the transition finishes.
    const nodes = document.querySelectorAll('link[rel=stylesheet], style:not([media=x])')
    const copies = [...nodes].map((el) => el.cloneNode(true) as HTMLElement)

    for (const copy of copies) {
      // Remove Next.js' data attributes so the copies are not removed from the DOM in the route
      // change process.
      copy.removeAttribute('data-n-p')
      copy.removeAttribute('data-n-href')

      // Add duplicated nodes to the DOM.
      document.head.appendChild(copy)
    }

    const handler = () => {
      // Emulate a `.once` method using `.on` and `.off`
      Router.events.off('routeChangeComplete', handler)

      window.setTimeout(() => {
        for (const copy of copies) {
          // Remove previous page's styles after the transition has finalized.
          document.head.removeChild(copy)
        }
      }, timeout)
    }

    Router.events.on('routeChangeComplete', handler)
  })
}

fixTimeoutTransition(300)