
import React from 'react';
import { ChartBarIcon, PillIcon } from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  PieChart, 
  Pie, 
  Legend 
} from 'recharts';

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border rounded shadow-sm">
        <p className="font-medium">{payload[0].name}: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

// Sample data for expiry status
const expiryData = [
  { name: 'Valid', value: 120, color: '#10b981' },
  { name: 'Expiring Soon', value: 30, color: '#f59e0b' },
  { name: 'Expired', value: 15, color: '#ef4444' },
];

// Sample data for categories
const categoryData = [
  { name: 'Antibiotics', value: 45, color: '#3b82f6' },
  { name: 'Analgesics', value: 32, color: '#8b5cf6' },
  { name: 'Antiviral', value: 18, color: '#ec4899' },
  { name: 'Vitamins', value: 28, color: '#10b981' },
  { name: 'Vaccines', value: 15, color: '#f59e0b' },
];

// Sample data for monthly expiry
const monthlyExpiryData = [
  { name: 'Jan', value: 5 },
  { name: 'Feb', value: 8 },
  { name: 'Mar', value: 3 },
  { name: 'Apr', value: 7 },
  { name: 'May', value: 12 },
  { name: 'Jun', value: 6 },
];

const Index = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
        <PillIcon className="h-8 w-8 text-primary" />
        Pharmacy Management Dashboard
      </h1>
      <p className="text-muted-foreground mb-6">
        Overview of your pharmacy inventory and analytics
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChartBarIcon className="h-5 w-5" />
              Expiry Status
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expiryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {expiryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Categories Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChartBarIcon className="h-5 w-5" />
              Medicine Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryData}
                  layout="vertical"
                  margin={{
                    top: 5,
                    right: 30,
                    left: 60,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value">
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Monthly Expiry Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChartBarIcon className="h-5 w-5" />
            Monthly Expiry Forecast
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyExpiryData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 30,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
