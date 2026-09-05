"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings, ArrowDown, Bitcoin, Repeat } from "lucide-react";
import { I18nProvider, Input, Label, NumberField } from "react-aria-components";
import { cn } from "@/lib/utils";
import React from "react";

interface InputUnitProps {
  className?: string;
  isTargetUnit?: boolean;
  initialValue: number;
  walletBalance: string;
  selectedAssetId: string;
  assetOptions: {
    id: string;
    name: string;
    Icon: React.ElementType;
  }[];
}

function TransactionInputUnit({
  className,
  isTargetUnit,
  initialValue,
  walletBalance,
  selectedAssetId,
  assetOptions,
}: InputUnitProps) {
  return (
    <>
      {isTargetUnit && (
        <div
          className="z-10 size-11 flex items-center justify-center rounded-full bg-linear-to-b from-primary to-primary-to inset-shadow-[0_1px_rgb(255_255_255/0.15)] absolute top-1/2 -translate-y-1/2"
          aria-hidden="true"
        >
          <ArrowDown className="text-primary-foreground" size={20} />
        </div>
      )}
      <Card
        className={cn(
          "relative w-full flex-row items-center justify-between gap-4 p-5 dark:bg-card/64",
          isTargetUnit
            ? "[mask-image:radial-gradient(ellipse_28px_26px_at_50%_0%,transparent_0,_transparent_26px,_black_27px)]"
            : "[mask-image:radial-gradient(ellipse_28px_26px_at_50%_100%,transparent_0,_transparent_26px,_black_27px)]",
          className,
        )}
      >
        {isTargetUnit && (
          <div
            className="absolute -top-px left-1/2 -translate-x-1/2 w-[54px] h-[27px] rounded-b-full border-b border-x border-white/15"
            aria-hidden="true"
          ></div>
        )}
        <div className="grow">
          <I18nProvider locale="en-US">
            <NumberField
              defaultValue={initialValue}
              minValue={0}
              formatOptions={{
                minimumFractionDigits: 1,
                maximumFractionDigits: 2,
                useGrouping: true,
              }}
            >
              <Label className="sr-only">Value</Label>
              <Input className="w-full max-w-48 text-3xl font-semibold bg-transparent focus-visible:outline-none py-0.5 px-1 -ml-1 mb-1 focus:bg-card/64 rounded-lg appearance-none" />
            </NumberField>
          </I18nProvider>
          <div className="text-xs text-muted-foreground mt-1">
            <span className="text-muted-foreground/70">Available: </span>
            {walletBalance}
          </div>
        </div>
        <div className="shrink-0">
          <Select defaultValue={selectedAssetId}>
            <SelectTrigger className="p-2 pr-3 h-10 rounded-full [&>span_svg]:text-muted-foreground/80 [&>span]:flex [&>span]:items-center [&>span]:gap-3 [&>span_svg]:shrink-0 border-0 bg-card/64 hover:bg-card/80 shadow-lg inset-shadow-[0_1px_rgb(255_255_255/0.15)]">
              <SelectValue placeholder="Select Asset" />
            </SelectTrigger>
            <SelectContent
              className="dark bg-zinc-800 border-none shadow-black/10 inset-shadow-[0_1px_rgb(255_255_255/0.15)] [&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]>span>svg]:shrink-0"
              align="center"
            >
              {assetOptions.map((asset) => (
                <SelectItem key={asset.id} value={asset.id}>
                  <asset.Icon className="size-6 shrink-0 rounded-full" />
                  <span className="truncate uppercase text-xs font-medium">
                    {asset.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>
    </>
  );
}

function ExchangeFlowInterface({ availableAssets }: { availableAssets: any[] }) {
  return (
    <>
      <div className="relative flex flex-col items-center gap-2 mb-6">
        <TransactionInputUnit
          initialValue={15494.9}
          walletBalance="24,579"
          selectedAssetId="2"
          assetOptions={availableAssets}
        />
        <TransactionInputUnit
          isTargetUnit
          initialValue={12984.2}
          walletBalance="1,379.2"
          selectedAssetId="1"
          assetOptions={availableAssets}
        />
      </div>
      <div className="mb-3 px-3 text-xs font-medium uppercase text-muted-foreground/60">
        Transaction Details
      </div>
      <Card className="p-4 gap-0 rounded-xl">
        <ul className="text-sm space-y-3">
          <li className="flex items-center justify-between border-b border-card/50 pb-3">
            <span className="text-muted-foreground">Value</span>
            <span className="font-medium">$2,867</span>
          </li>
          <li className="flex items-center justify-between border-b border-card/50 pb-3">
            <span className="text-muted-foreground">Service Fee</span>
            <span className="font-medium">$31.2</span>
          </li>
          <li className="flex items-center justify-between">
            <span className="text-muted-foreground">Total</span>
            <span className="font-medium">$2,898.2</span>
          </li>
        </ul>
        <Button size="lg" className="w-full mt-6 h-12 text-base">
          Execute Trade
        </Button>
        <div className="mt-4 text-xs text-center uppercase">
          1 <span className="text-muted-foreground">ARK =</span> 1,574.04{" "}
          <span className="text-muted-foreground">TOK</span>
        </div>
      </Card>
    </>
  );
}

export function AssetExchangeModule() {
  const availableAssets = [
    { id: "1", name: "Ark", Icon: Bitcoin },
    { id: "2", name: "Tok", Icon: Repeat },
  ];

  return (
    <Tabs defaultValue="swap" className="flex w-full max-w-sm flex-1 flex-col gap-4">
      <div className="flex items-center gap-3">
        <TabsList className="flex w-full bg-background dark:bg-card/64 p-1 h-11 shadow-md *:not-first:ms-px dark:inset-shadow-[0_1px_rgb(255_255_255/0.15)]">
          <TabsTrigger
            value="swap"
            className="flex-1 data-[state=active]:shadow-none data-[state=active]:bg-transparent relative before:absolute before:inset-y-2 before:-left-px before:w-px before:bg-border dark:before:bg-card first:before:hidden"
          >
            Swap
          </TabsTrigger>
          <TabsTrigger
            value="purchase"
            className="flex-1 data-[state=active]:shadow-none data-[state=active]:bg-transparent relative before:absolute before:inset-y-2 before:-left-px before:w-px before:bg-border dark:before:bg-card first:before:hidden"
          >
            Purchase
          </TabsTrigger>
          <TabsTrigger
            value="transfer"
            className="flex-1 data-[state=active]:shadow-none data-[state=active]:bg-transparent relative before:absolute before:inset-y-2 before:-left-px before:w-px before:bg-border dark:before:bg-card first:before:hidden"
          >
            Transfer
          </TabsTrigger>
        </TabsList>
        <Button
          size="icon"
          variant="ghost"
          className="size-9 shrink-0 text-muted-foreground hover:text-foreground/80"
        >
          <span className="sr-only">Options</span>
          <Settings className="size-5" />
        </Button>
      </div>
      <div className="dark bg-background dark:bg-secondary/64 rounded-2xl p-4">
        <TabsContent value="swap">
          <ExchangeFlowInterface availableAssets={availableAssets} />
        </TabsContent>
        <TabsContent value="purchase">
          <ExchangeFlowInterface availableAssets={availableAssets} />
        </TabsContent>
        <TabsContent value="transfer">
          <ExchangeFlowInterface availableAssets={availableAssets} />
        </TabsContent>
      </div>
    </Tabs>
  );
}