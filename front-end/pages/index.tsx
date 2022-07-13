import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Bozuman chat app</title>
        <meta name="description" content="Chat app develop by bozuman team" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container">
        <h1>Bozuman chat app home page</h1>
      </div>
    </div>
  )
}

export default Home
