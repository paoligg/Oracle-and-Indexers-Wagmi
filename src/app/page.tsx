import { Balance } from '../components/Balance'
import { ConnectButton } from '../components/ConnectButton'
import { Connected } from '../components/Connected'
import { SwapTokens } from '../components/SwapTokens'

export function Page() {
  return (
    <div className="bg-black text-white p-8">
      <h1 className="text-6xl font-bold mb-4 ">Token Swapper</h1>

      <ConnectButton />
      <Connected>
        <hr />
        <Balance />
        <br /> 
        <hr />
        <SwapTokens />
      </Connected>
    </div>
  )
}

export default Page
