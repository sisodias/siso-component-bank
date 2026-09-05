// components/ui/swap-card.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftRight, ChevronDown } from "lucide-react";

import { cn } from "../_utils/cn";
import { Button } from "./button";
import {
  Card,
  CardContent,
  CardHeader,
} from "./card";
import { Input } from "./input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

// Define a type for the token data
export interface Token {
  symbol: string;
  name: "Ethereum" | "Aave";
  icon: React.ComponentType<{ className?: string }>;
}

// Props for the individual currency input panel
interface CurrencyInputPanelProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  selectedToken: Token;
  onTokenSelect: (token: Token) => void;
  tokens: Token[];
  usdValue: string;
  showMaxButton?: boolean;
}

// A reusable component for the "Sell" and "Buy" sections
const CurrencyInputPanel: React.FC<CurrencyInputPanelProps> = ({
  label,
  value,
  onValueChange,
  selectedToken,
  onTokenSelect,
  tokens,
  usdValue,
  showMaxButton = false,
}) => (
  <Card className="bg-background rounded-2xl border-none shadow-none">
    <CardHeader className="p-4">
      <span className="text-sm text-muted-foreground">{label}</span>
    </CardHeader>
    <CardContent className="p-4 pt-0">
      <div className="flex items-center justify-between gap-4">
        <Input
          type="number"
          placeholder="0"
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          className="text-4xl font-semibold h-auto p-0 border-none focus-visible:ring-0 shadow-none bg-transparent"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="rounded-full h-12 px-4 gap-2 text-lg">
              <selectedToken.icon className="h-6 w-6" />
              {selectedToken.symbol}
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            {tokens.map((token) => (
              <DropdownMenuItem key={token.symbol} onSelect={() => onTokenSelect(token)}>
                <token.icon className="h-6 w-6 mr-2" />
                <span>{token.symbol}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-sm text-muted-foreground">${usdValue}</span>
        {showMaxButton && (
          <div className="flex items-center gap-2">
             <span className="text-sm text-muted-foreground">52.32 ETH</span>
            <Button variant="secondary" size="sm" className="rounded-full h-7">Max</Button>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);


// Props for the main SwapCard component
export interface SwapCardProps extends React.HTMLAttributes<HTMLDivElement> {
  tokens: Token[];
  initialSellToken: Token;
  initialBuyToken: Token;
  onSwap: (data: { sellAmount: string; buyAmount: string; sellToken: Token; buyToken: Token }) => void;
}

const SwapCard = React.forwardRef<HTMLDivElement, SwapCardProps>(
  ({ className, tokens, initialSellToken, initialBuyToken, onSwap, ...props }, ref) => {
    // State for managing inputs and token selections
    const [sellAmount, setSellAmount] = React.useState("10");
    const [buyAmount, setBuyAmount] = React.useState("147.712");
    const [sellToken, setSellToken] = React.useState<Token>(initialSellToken);
    const [buyToken, setBuyToken] = React.useState<Token>(initialBuyToken);
    const [isSellOnTop, setIsSellOnTop] = React.useState(true);
    const [activeTab, setActiveTab] = React.useState("Swap");


    // Handler to swap the positions of the input panels
    const handleSwapPosition = () => {
      setIsSellOnTop(!isSellOnTop);
    };

    // Calculate USD values (mocked for this example)
    const sellUsdValue = (parseFloat(sellAmount) * 3840.92).toFixed(2);
    const buyUsdValue = (parseFloat(buyAmount) * 259.00).toFixed(2);

    // Panels configuration
    const sellPanel = (
        <CurrencyInputPanel
          label="Sell"
          value={sellAmount}
          onValueChange={setSellAmount}
          selectedToken={sellToken}
          onTokenSelect={setSellToken}
          tokens={tokens}
          usdValue={sellUsdValue}
          showMaxButton
        />
    );

    const buyPanel = (
        <CurrencyInputPanel
          label="Buy"
          value={buyAmount}
          onValueChange={setBuyAmount}
          selectedToken={buyToken}
          onTokenSelect={setBuyToken}
          tokens={tokens}
          usdValue={buyUsdValue}
        />
    );

    return (
      <Card
        ref={ref}
        className={cn("w-full max-w-md mx-auto p-4 sm:p-2 rounded-3xl shadow-lg border", className)}
        {...props}
      >
        <CardContent className="p-2 sm:p-4">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-6">
            <div className="bg-muted p-1 rounded-full flex items-center">
              {["Swap", "Send", "Buy"].map((tab) => (
                <Button
                  key={tab}
                  variant={activeTab === tab ? "secondary" : "ghost"}
                  onClick={() => setActiveTab(tab)}
                  className="rounded-full px-6 sm:px-8 text-md font-medium"
                >
                  {tab}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Main content with animated swap */}
          <div className="relative">
            <AnimatePresence initial={false}>
              <motion.div
                key={isSellOnTop ? "sell" : "buy"}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="bg-muted/50 rounded-2xl"
              >
                {isSellOnTop ? sellPanel : buyPanel}
              </motion.div>
              <motion.div
                key={isSellOnTop ? "buy" : "sell"}
                layout
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="bg-muted/50 rounded-2xl mt-1"
              >
                {isSellOnTop ? buyPanel : sellPanel}
              </motion.div>
            </AnimatePresence>

            {/* Swap button in the middle */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center">
                <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full h-10 w-10 border-4 border-background"
                    onClick={handleSwapPosition}
                >
                    <ArrowLeftRight className="h-5 w-5 rotate-90" />
                </Button>
            </div>
          </div>
          
          {/* Swap action button */}
          <Button
            size="lg"
            className="w-full mt-6 h-14 text-lg rounded-2xl"
            onClick={() => onSwap({ sellAmount, buyAmount, sellToken, buyToken })}
          >
            Swap
          </Button>

          {/* Exchange rate info */}
          <div className="text-center text-sm text-muted-foreground mt-4">
             1 AAVE = 0.0676995 ETH ($259.00) | $7.44 <ChevronDown className="inline h-4 w-4" />
          </div>
        </CardContent>
      </Card>
    );
  }
);

SwapCard.displayName = "SwapCard";

export { SwapCard };