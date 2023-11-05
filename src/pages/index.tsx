import Head from 'next/head'

// import { api } from '~/utils/api'
import styles from './index.module.css'
import { Card } from '~/components/Cards'
import Header from '~/components/Header'

export default function Home() {
	// const hello = api.post.hello.useQuery({ text: 'from tRPC' })

	return (
		<>
			<Head>
				<title>PASCO Live</title>
				<meta name="description" content="PASCO Live " />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Header indicatorState={'green'}></Header>
			<main className={styles.main}>
				<Card title={"Zimmertemperatur"} indicatorState={"green"} rows={
          [
            {label: "ID", value: "202-838"},
            {label: "Typ", value: "Temperatur"},
            {idSeperator: true},
            {label: "Messung alle", value: "5 Minuten"},
            {label: "Letzte Messung", value: "vor 3 Minuten"},
            {idSeperator: true},
            {label: "Temperatur", value: "20°C"},
            {label: "Batterie", value: "52%"}
          ]
        }></Card>
			</main>
		</>
	)
}

