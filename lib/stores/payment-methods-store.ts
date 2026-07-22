import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PayMentMethod {
  id: number;
  payMentMethod: string;
  status: "Active" | "Inactive";
}

interface PayMentStore {
  paymentmethods: PayMentMethod[];
  togglePayMentStatus: (id: number) => void;
}

export const usePayMentMethodStore = create<PayMentStore>()(
  persist(
    (set) => ({
      paymentmethods: [
        {
          id: 1,
          payMentMethod: "Cash",
          status: "Active",
        },
        {
          id: 2,
          payMentMethod: "Stipe",
          status: "Active",
        },
        {
          id: 3,
          payMentMethod: "Wallet",
          status: "Active",
        },
        {
          id: 4,
          payMentMethod: "GooglePay",
          status: "Active",
        },
      ],
      togglePayMentStatus: (id: number) => {
        set((state) => ({
          paymentmethods: state.paymentmethods.map((method) =>
            method.id === id
              ? {
                  ...method,
                  status: method.status === "Active" ? "Inactive" : "Active",
                }
              : method
          ),
        }));
      },
    }),
    {
      name: "payment-store",
      version: 1,
    }
  )
);
