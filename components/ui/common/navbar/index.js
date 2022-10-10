import { useWeb3 } from "@components/providers";
import Link from "next/link";
import { Button } from "@components/ui/common";
import { useAccount } from "@components/hooks/web3/useAccount";

export default function Navbar() {
  const { connect, isLoading, isWeb3Loaded } = useWeb3();

  const { account } = useAccount();

  return (
    <section>
      <div className='relative pt-6 px-4 sm:px-6 lg:px-8'>
        <nav className='relative' aria-label='Global'>
          <div className='flex justify-between items-center'>
            <div>
              <Link href='/'>
                <a className='text-sm font-medium text-gray-500 hover:text-gray-900'>
                  Home
                </a>
              </Link>
              <a
                href='#'
                className='font-medium mr-8 text-gray-500 hover:text-gray-900'>
                Product
              </a>
              <Link href='/marketplace'>
                <a className='font-medium mr-8 text-gray-500 hover:text-gray-900'>
                  Marketplace
                </a>
              </Link>

              <a
                href='#'
                className='font-medium mr-8 text-gray-500 hover:text-gray-900'>
                Features
              </a>
            </div>
            <div>
              <a
                href='#'
                className='font-medium mr-8 text-gray-500 hover:text-gray-900'>
                Company
              </a>

              {isLoading ? (
                <Button disabled={true}>Loading...</Button>
              ) : isWeb3Loaded ? (
                account.data ? (
                  <Button variant='white'>
                    Connected {account.isAdmin && "as Admin"}
                  </Button>
                ) : (
                  <Button onClick={connect}>Connect</Button>
                )
              ) : (
                <Button
                  onClick={() =>
                    window.open("https://metamask.io/download.html")
                  }>
                  Install Metamask
                </Button>
              )}
            </div>
          </div>
        </nav>
      </div>
    </section>
  );
}
