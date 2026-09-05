"use client"

import { motion } from "framer-motion"
import { Card } from "./card"
import { Button } from "./button"
import {
  Wallet,
  TrendingUp,
  Eye,
  RefreshCw,
  ArrowDown,
  ArrowUp,
  ArrowLeftRight,
  Clock,
  Bitcoin,
} from "lucide-react"

interface Account {
  id: string
  name: string
  description: string
  icon: React.ReactNode
}

interface WalletCardProps {
  totalBalance: string
  btcAmount: string
  fundingBalance: string
  tradingBalance: string
  accounts: Account[]
}

export function WalletCard({
  totalBalance,
  btcAmount,
  fundingBalance,
  tradingBalance,
  accounts,
}: WalletCardProps) {
  return (
    <motion.div
      
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="max-w-md mx-auto"
    >
      <Card className="p-0 border-0 shadow-md rounded-xl overflow-hidden bg-white dark:bg-slate-900">
        {/* Funding */}
        <div className="p-5 bg-slate-900 dark:bg-slate-800 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wallet className="w-5 h-5 text-slate-300" />
              <span className="font-medium">Funding</span>
            </div>
            <span className="font-semibold">{fundingBalance}</span>
          </div>
        </div>

        {/* Trading */}
        <div className="p-5 bg-slate-800 dark:bg-slate-700 text-white border-t border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-slate-300" />
              <span className="font-medium">Unified Trading</span>
            </div>
            <span className="font-semibold">{tradingBalance}</span>
          </div>
        </div>

        {/* Balance */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
              <span className="text-slate-600 dark:text-slate-300 font-medium">
                Total Balance
              </span>
              <Eye className="w-4 h-4 text-slate-400" />
            </div>
            <RefreshCw className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-3 mb-8">
            <div className="text-4xl font-light text-slate-900 dark:text-white tracking-tight">
              {totalBalance}
            </div>
            <div className="flex items-center gap-2 text-amber-600">
              <Bitcoin className="w-4 h-4" />
              <span className="font-medium">{btcAmount}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mb-8">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
              <Button className="w-full bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-lg h-11 gap-2 font-medium">
                <ArrowDown className="w-4 h-4" />
                Deposit
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
              <Button
                variant="outline"
                className="w-full border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg h-11 gap-2 font-medium bg-transparent"
              >
                <ArrowUp className="w-4 h-4" />
                Withdraw
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="outline"
                size="icon"
                className="w-11 h-11 rounded-lg border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 bg-transparent"
              >
                <ArrowLeftRight className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="outline"
                size="icon"
                className="w-11 h-11 rounded-lg border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 bg-transparent"
              >
                <Clock className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              </Button>
            </motion.div>
          </div>

          {/* Accounts */}
          <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
            {accounts.map((account) => (
              <motion.div
                key={account.id}
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                  {account.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-slate-900 dark:text-white">
                    {account.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {account.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
