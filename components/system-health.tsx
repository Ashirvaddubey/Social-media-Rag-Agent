"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Activity, CheckCircle, AlertCircle, XCircle } from "lucide-react"

interface SystemStatus {
  overall: "healthy" | "warning" | "error"
  services: {
    ingestion: "healthy" | "warning" | "error"
    rag: "healthy" | "warning" | "error"
    trends: "healthy" | "warning" | "error"
    database: "healthy" | "warning" | "error"
  }
  uptime: string
  lastCheck: Date
}

export function SystemHealth() {
  const [status, setStatus] = useState<SystemStatus>({
    overall: "healthy",
    services: {
      ingestion: "healthy",
      rag: "healthy",
      trends: "healthy",
      database: "healthy",
    },
    uptime: "99.9%",
    lastCheck: new Date(),
  })

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate status checks
      setStatus((prev) => ({
        ...prev,
        lastCheck: new Date(),
      }))
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-500"
      case "warning":
        return "bg-yellow-500"
      case "error":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <div className={`w-2 h-2 rounded-full ${getStatusColor(status.overall)}`} />
          System Health
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">System Status</h4>
            <Badge variant={status.overall === "healthy" ? "default" : "destructive"}>
              {status.overall.toUpperCase()}
            </Badge>
          </div>

          <div className="space-y-3">
            {Object.entries(status.services).map(([service, serviceStatus]) => (
              <div key={service} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(serviceStatus)}
                  <span className="text-sm capitalize">{service}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {serviceStatus}
                </Badge>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Uptime:</span>
              <span>{status.uptime}</span>
            </div>
            <div className="flex justify-between">
              <span>Last Check:</span>
              <span>{status.lastCheck.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
