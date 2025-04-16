import { MultiLineChart } from '@/components/charts/MultiLineChart';
import { BarRaceChart } from '@/components/charts/BarRaceChart';
import { NetworkGraph } from '@/components/charts/NetworkGraph';
import { Card } from '@/components/ui/card';
import { LineChart, BarChart2, Network } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-500/10 to-yellow-500/10">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
            Data Explorer
          </h1>
        </div>

        <div className="grid gap-8">
          <Card className="p-6 glassmorphism">
            <div className="flex items-center gap-2 mb-4">
              <LineChart className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Time Series Analysis</h2>
            </div>
            <MultiLineChart />
          </Card>

          <Card className="p-6 glassmorphism">
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Animated Bar Race</h2>
            </div>
            <BarRaceChart />
          </Card>

          <Card className="p-6 glassmorphism">
            <div className="flex items-center gap-2 mb-4">
              <Network className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Network Visualization</h2>
            </div>
            <NetworkGraph />
          </Card>
        </div>
      </div>
    </main>
  );
}