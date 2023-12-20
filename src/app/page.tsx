import { Balance } from '../components/Balance'
import { ConnectButton } from '../components/ConnectButton'
import { Connected } from '../components/Connected'
import { SwapTokens } from '../components/SwapTokens'
import { TheGraph } from '../components/TheGraph'

export function Page() {
  return (
    <div className="bg-black text-white p-8">
      <h1 className="text-6xl font-bold mb-4 ">Oracle and Indexer</h1>

      <ConnectButton />
      <Connected>
        <hr />
        <Balance />
        <br /> 
        <hr />
        <SwapTokens />
        <br />
        <hr />
        <TheGraph />
      </Connected>
    </div>
  )
}

export default Page
