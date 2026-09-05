"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card"

// Публичные типы для переиспользования в демо
export interface NewsItem {
  id: string
  title: string
  url?: string
  publishedAt?: string
}

export interface NewsSearchResult {
  topic: string
  items: NewsItem[]
}

type NewsListProps = {
  data?: NewsSearchResult | null
  isLoading?: boolean
  error?: string | null
}

export function NewsList({ data, isLoading, error }: NewsListProps) {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>News</CardTitle>
        <CardDescription>
          {data?.topic ? `Topic: ${data.topic}` : "Recent headlines"}
        </CardDescription>
      </CardHeader>

      {/* Loading skeleton */}
      {isLoading && (
        <CardContent>
          <ul className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <li key={i} className="rounded-md bg-muted px-3 py-2">
                <div className="h-4 w-3/4 bg-background/50 rounded animate-pulse" />
                <div className="mt-1 h-3 w-1/3 bg-background/30 rounded animate-pulse" />
              </li>
            ))}
          </ul>
        </CardContent>
      )}

      {/* Error state */}
      {!isLoading && error && (
        <CardContent>
          <div className="text-sm text-destructive">Error: {error}</div>
        </CardContent>
      )}

      {/* Empty state (нет данных) */}
      {!isLoading && !error && !data && (
        <CardContent>
          <div className="text-sm text-muted-foreground">
            No data yet. Pass a <code>NewsSearchResult</code> to the component.
          </div>
        </CardContent>
      )}

      {/* Data state */}
      {!isLoading && !error && data && (
        <CardContent>
          {data.items.length === 0 ? (
            <div className="text-sm text-muted-foreground">No results.</div>
          ) : (
            <ul className="space-y-2">
              {data.items.map((item) => (
                <li key={item.id} className="rounded-md bg-muted px-3 py-2">
                  {item.url ? (
                    <a
                      href={item.url}
                      className="font-medium hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.title}
                    </a>
                  ) : (
                    <span className="font-medium">{item.title}</span>
                  )}
                  {item.publishedAt && (
                    <div className="text-xs text-muted-foreground">
                      {new Date(item.publishedAt).toLocaleString()}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      )}
    </Card>
  )
}

export default NewsList
