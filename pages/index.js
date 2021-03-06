import { getSession, signOut } from 'next-auth/client'
import { getToken } from 'next-auth/jwt';

import Head from 'next/head'
import styles from '../styles/Home.module.css'

const secret = process.env.JWT_SECRET;

const spreadSheetId = "1JjVcw5NWw7VFj7VEUFkBVKLLnQ_OG3RJEnFHubAN9Oc"
const range1 = "Sheet1!A2:A"
const range2 = "Sheet1!C2:C"
const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadSheetId}/values:batchGet?valueRenderOption=UNFORMATTED_VALUE&ranges=${range1}&ranges=${range2}&majorDimension=COLUMNS`

export async function getServerSideProps (context) {

  // Get the user's session based on the request
  const session = await getSession(context)

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }


  const token = await getToken({
    req: context.req,
    secret: process.env.JWT_SECRET,
    encryption: true
  })


  //console.log("get server side token", token);

  const res = await fetch(url, {
    credentials: 'include',
    headers: {
      'Authorization': `Bearer ${token.accessToken}`
    }
  });

  const resres = await res.json();
  const index = resres?.valueRanges[0]?.values[0].findIndex(name => name === token.name);
  console.log("index resres", resres?.valueRanges[0]?.values[0][index], resres?.valueRanges[1]?.values[0][index]);

  return {
    props: { session },
  }
}

export default function Home({session}) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Holy Sheet</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <a
                      href={`/api/auth/signout`}

       onClick={(e) => {
e.preventDefault()
        signOut()
      }}>Sign out</a>

      <h1>Session</h1>
      <code>{JSON.stringify(session)}</code>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}
