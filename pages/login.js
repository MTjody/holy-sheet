import { signIn, signOut, useSession } from 'next-auth/client'
import { getSession } from 'next-auth/client'

export async function getServerSideProps (context) {
  // Get the user's session based on the request
  const session = await getSession(context)
  console.log("getServerSideProps", session)

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: { session },
  }
}

const Login = () => {

  //const [ session, loading ] = useSession()

console.log(process.env.GOOGLE_ID)

  // Show the user. No loading state is required
  return (
    <>
      <h1>Login</h1>
      <a
                href={`/api/auth/signin`}
                onClick={(e) => {
                  e.preventDefault()
                  signIn()
                }}
              >
                Sign in
              </a>
              </>
  )
}

export default Login
