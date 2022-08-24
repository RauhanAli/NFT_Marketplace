import '../styles/globals.css'
import Link from 'next/link'   
function MyApp({ Component, pageProps }) {
  return (
  <div>
    <nav className="border-b p-6">
    <p className='text-4xl font-bold text-blue-900'>Crypto Gaming League NFTS</p>
    <div className="flex mt-4">
    <Link href="/">
      <a className="mr-6 text-sky-500">Home</a>
      </Link>
      <Link href="/create-item">
      <a className="mr-6 text-sky-500">Sell Digital Asset</a>
      </Link>
      <Link href="/my-asset">
      <a className="mr-6 text-sky-500">CLG Digital Asset</a>
      </Link>
      <Link href="/dashboard">
      <a className="mr-6 text-sky-500">Creator Dashboard</a>
      </Link>
    </div>
    </nav>
    <Component {...pageProps} />
  </div>
  )
}
export default MyApp
