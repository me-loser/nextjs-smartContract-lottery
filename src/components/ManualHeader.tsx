"use client";
import React, { useEffect } from "react";
import { useMoralis } from "react-moralis";

const ManualHeader: React.FC = () => {
  const {
    enableWeb3,
    account,
    isWeb3Enabled,
    Moralis,
    deactivateWeb3,
    isWeb3EnableLoading,
  } = useMoralis();

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.localStorage.getItem("connected")) {
        enableWeb3();
      }
    }
  }, [isWeb3Enabled]);

  useEffect(() => {
    Moralis.onAccountChanged((newAccount) => {
      if (newAccount == null) {
        window.localStorage.removeItem("connected");
        deactivateWeb3();
      }
    });
  }, []);
  return (
    <nav className="p-5 border-b-2">
      <ul className="">
        <li className="flex flex-row">
          {account ? (
            <div className="ml-auto py-2 px-4">
              Connected to {account.slice(0, 6)}...
              {account.slice(account.length - 4)}
            </div>
          ) : (
            <button
              onClick={async () => {
                // await walletModal.connect()
                const ret = await enableWeb3();
                if (typeof ret !== "undefined") {
                  // depends on what button they picked
                  if (typeof window !== "undefined") {
                    window.localStorage.setItem("connected", "injected");
                    // window.localStorage.setItem("connected", "walletconnect")
                  }
                }
              }}
              disabled={isWeb3EnableLoading}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
            >
              Connect
            </button>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default ManualHeader;
