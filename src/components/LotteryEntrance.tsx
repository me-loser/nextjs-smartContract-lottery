"use client";
import { useEffect, useState } from "react";
import { abi, contractAddresses } from "../../constants";
import { useWeb3Contract } from "react-moralis";
import { useMoralis } from "react-moralis";
import { BigNumber, ethers, ContractTransaction } from "ethers";
import { useNotification } from "web3uikit";
import { GrNotification } from "react-icons/gr";

interface contractAddressesInterface {
  [key: string]: string[];
}

const LotteryEntrance: React.FC = () => {
  const addresses: contractAddressesInterface = contractAddresses;
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId: string = parseInt(chainIdHex!).toString();
  const raffleAddress = chainId in addresses ? addresses[chainId][0] : null;
  console.log(raffleAddress);
  const [entranceFee, setEntranceFee] = useState<string>("0");
  const [numPlayers, setNumPlayers] = useState<string>("0");
  const [recentWinner, setRecentWinner] = useState<string>("0");
  const dispatch = useNotification();
  const {
    runContractFunction: enterRaffle,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress!,
    functionName: "enterRaffle",
    params: {},
    msgValue: entranceFee,
  });
  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress!,
    functionName: "getEntranceFee",
    params: {},
  });
  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress!,
    functionName: "getNumberOfPlayers",
    params: {},
  });
  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress!,
    functionName: "getRecentWinner",
    params: {},
  });
  const updateUI = async () => {
    const entranceFeeFromCall = (
      (await getEntranceFee()) as BigNumber
    ).toString();
    const numPlayersFromCall = (
      (await getNumberOfPlayers()) as BigNumber
    ).toString();
    const recentWinnerFromCall = (await getRecentWinner()) as string;
    setEntranceFee(entranceFeeFromCall);
    setNumPlayers(numPlayersFromCall);
    setRecentWinner(recentWinnerFromCall);
  };
  useEffect(() => {
    if (isWeb3Enabled && raffleAddress) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  const handleNewNotification = (tx: ContractTransaction) => {
    dispatch({
      type: "info",
      message: "Transaction Complete!",
      title: "Tx Notification",
      position: "topR",
      icon: <GrNotification />,
    });
  };

  const handleSuccess = async (tx: ContractTransaction) => {
    await tx.wait(1);
    handleNewNotification(tx);
    updateUI();
  };
  return (
    <div className="p-5">
      Hi from lottery entrance!
      {raffleAddress ? (
        <div className="">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
            onClick={async function () {
              await enterRaffle({
                onSuccess: (tx) => handleSuccess(tx as ContractTransaction),
              });
            }}
            disabled={isLoading || isFetching}
          >
            {isLoading || isFetching ? (
              <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
            ) : (
              <div>Enter Raffle</div>
            )}
          </button>
          <div>
            Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH
          </div>
          <div>Number Of Players: {numPlayers} </div>
          <div> Recent Winner: {recentWinner} </div>
        </div>
      ) : (
        <div>No Raffle Address Deteched</div>
      )}
    </div>
  );
};

export default LotteryEntrance;