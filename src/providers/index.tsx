"use client";

import React from "react";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { RecoilRoot } from "recoil";

import Notification from "@/components/global/Toast";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 0,
      },
    },
    queryCache: new QueryCache({
      onError: (error: any, query) => {
        console.log(error, query);
      },
      onSettled: (data, error) => {
        console.log(data, error);
      },
    }),
  });

  return (
    <RecoilRoot>
      <Notification />
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </RecoilRoot>
  );
};

export default Providers;
