import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, TrendingUp, Eye, RefreshCw, ArrowDown, ArrowUp, ArrowLeftRight, Clock, Bitcoin } from "lucide-react"

export default function WalletCard() {
  return (
 
      <div className="max-w-md mx-auto">
        <Card className="p-0 bg-white border-0 shadow-sm rounded-xl overflow-hidden">
          <div className="space-y-0">
           
            <div className="space-y-0">
              <div className="p-5 bg-slate-900 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Wallet className="w-5 h-5 text-slate-300" />
                    <span className="font-medium text-slate-100">Funding</span>
                  </div>
                  <span className="font-semibold text-white">$243,940.03</span>
                </div>
              </div>

              <div className="p-5 bg-slate-800 text-white border-t border-slate-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-slate-300" />
                    <span className="font-medium text-slate-100">Unified Trading</span>
                  </div>
                  <span className="font-semibold text-white">$310,495.50</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white">
             
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                  <span className="text-slate-600 font-medium">Total Balance</span>
                  <Eye className="w-4 h-4 text-slate-400" />
                </div>
                <RefreshCw className="w-4 h-4 text-slate-400" />
              </div>

           
              <div className="space-y-3 mb-8">
                <div className="text-4xl font-light text-slate-900 tracking-tight">$534,435.53</div>
                <div className="flex items-center gap-2 text-amber-600">
                  <Bitcoin className="w-4 h-4" />
                  <span className="font-medium">9.300554 BTC</span>
                </div>
              </div>

              <div className="flex gap-3 mb-8">
                <Button className="flex-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg h-11 gap-2 font-medium">
                  <ArrowDown className="w-4 h-4" />
                  Deposit
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg h-11 gap-2 font-medium bg-transparent"
                >
                  <ArrowUp className="w-4 h-4" />
                  Withdraw
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-11 h-11 rounded-lg border-slate-200 hover:bg-slate-50 bg-transparent"
                >
                  <ArrowLeftRight className="w-4 h-4 text-slate-600" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-11 h-11 rounded-lg border-slate-200 hover:bg-slate-50 bg-transparent"
                >
                  <Clock className="w-4 h-4 text-slate-600" />
                </Button>
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-100">
               
                <div className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors rounded-lg">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-900">Funding Account</h3>
                    <p className="text-sm text-slate-500">Manage your funding account</p>
                  </div>
                </div>

                
                <div className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors rounded-lg">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-900">Unified Trading Account</h3>
                    <p className="text-sm text-slate-500">Manage your trading account</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
   
  )
}
