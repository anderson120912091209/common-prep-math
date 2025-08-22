import { Button } from "./ui/button"
import { Card } from "./ui/card" 
import { Input } from "./ui/input"
import { MetricsCard } from "./metrics-card"
import { StatsChart } from "./stats-chart"
import { VaultTable } from "./vault-table"
import { BarChart3, ChevronDown, Trophy, Home, LayoutDashboard, LifeBuoy, Settings, Calculator } from "lucide-react"

export default function LeaderboardDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="grid lg:grid-cols-[240px_1fr]">
            <aside className="border-r border-gray-200 bg-gray-50">
          <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-6">
            <Calculator className="h-6 w-6 text-blue-600" />  
            <span className="font-bold text-gray-900">數學競賽排行榜</span>
          </div>
          <div className="px-4 py-4">
            <Input placeholder="搜尋" className="bg-white border-gray-200" />
          </div>
          <nav className="space-y-2 px-2">
            <Button variant="ghost" className="w-full justify-start gap-2 text-gray-700 hover:bg-gray-100">
              <LayoutDashboard className="h-4 w-4" />
              儀表板
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2 text-gray-700 hover:bg-gray-100">
              <BarChart3 className="h-4 w-4" />
              統計與成績
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2 text-gray-700 hover:bg-gray-100">
              <Trophy className="h-4 w-4" />
              排行榜
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2 text-gray-700 hover:bg-gray-100">
              <Home className="h-4 w-4" />
              競賽資訊
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2 text-gray-700 hover:bg-gray-100">
              <Calculator className="h-4 w-4" />
              數學題庫
              <ChevronDown className="ml-auto h-4 w-4" />
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2 text-gray-700 hover:bg-gray-100">
              <LifeBuoy className="h-4 w-4" />
              支援
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2 text-gray-700 hover:bg-gray-100">
              <Settings className="h-4 w-4" />
              設定
            </Button>
          </nav>
        </aside>
        <main className="p-4 bg-white">
          <div className="mb-4 flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-gray-900">總覽</h1>
              <div className="text-sm text-gray-600">2024年1月13日 - 2024年1月18日</div>
            </div>
            <Button variant="outline" className="gap-2 bg-white border-gray-200 text-gray-700">
              全國競賽
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <MetricsCard
              title="我的總分"
              value="2,847"
              change={{ value: "127", percentage: "+4.7%", isPositive: true }}
            />
            <MetricsCard title="全國排名" value="#23" change={{ value: "5", percentage: "+17.8%", isPositive: true }} />
            <MetricsCard title="解題數量" value="156" change={{ value: "12", percentage: "+8.3%", isPositive: true }} />
          </div>
          <Card className="mt-4 p-4 bg-white border border-gray-200">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">我的排名</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" className="text-gray-700 hover:bg-gray-100">
                  今日
                </Button>
                <Button size="sm" variant="ghost" className="text-gray-700 hover:bg-gray-100">
                  上週
                </Button>
                <Button size="sm" variant="ghost" className="text-gray-700 hover:bg-gray-100">
                  上月
                </Button>
                <Button size="sm" variant="ghost" className="text-gray-700 hover:bg-gray-100">
                  半年
                </Button>
                <Button size="sm" variant="ghost" className="text-gray-700 hover:bg-gray-100">
                  年度
                </Button>
              </div>
            </div>
            <StatsChart />
          </Card>
          <div className="mt-4">
            <VaultTable />
          </div>
        </main>
          </div>
        </div>
      </div>
    </div>
  )
}
