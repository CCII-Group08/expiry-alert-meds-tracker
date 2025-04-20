
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, PieChart, LineChart, Bar, Pie, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
import { Medicine, Package, ChartBar, ChartPie, ChartLine, Plus } from 'lucide-react';

const Index = () => {
  // Mock data for charts
  const expiryStatusData = [
    { name: 'Safe', value: 65, color: '#10b981' },
    { name: 'Expiring Soon', value: 25, color: '#f59e0b' },
    { name: 'Expired', value: 10, color: '#ef4444' },
  ];
  
  const categoryData = [
    { name: 'Antibiotics', value: 30, color: '#6366f1' },
    { name: 'Analgesics', value: 25, color: '#8b5cf6' },
    { name: 'Antiviral', value: 15, color: '#ec4899' },
    { name: 'Vitamins', value: 10, color: '#14b8a6' },
    { name: 'Vaccines', value: 8, color: '#0ea5e9' },
    { name: 'Antihistamines', value: 7, color: '#f97316' },
    { name: 'Other', value: 5, color: '#6b7280' },
  ];
  
  const monthlyExpiryData = [
    { month: 'Jan', count: 3 },
    { month: 'Feb', count: 5 },
    { month: 'Mar', count: 2 },
    { month: 'Apr', count: 8 },
    { month: 'May', count: 12 },
    { month: 'Jun', count: 7 },
    { month: 'Jul', count: 9 },
    { month: 'Aug', count: 4 },
    { month: 'Sep', count: 6 },
    { month: 'Oct', count: 8 },
    { month: 'Nov', count: 11 },
    { month: 'Dec', count: 7 },
  ];
  
  // Dashboard summary data
  const summaryData = [
    { title: "Total Medicines", value: "128", icon: Medicine, color: "bg-blue-100 text-blue-800" },
    { title: "Expiring Soon", value: "25", icon: Package, color: "bg-yellow-100 text-yellow-800" },
    { title: "Expired", value: "10", icon: Package, color: "bg-red-100 text-red-800" },
    { title: "Categories", value: "7", icon: ChartPie, color: "bg-purple-100 text-purple-800" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-primary">ExpiryAlert Dashboard</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your comprehensive medicine inventory management system
          </p>
          
          <div className="flex justify-center space-x-4 mt-6">
            <Button asChild>
              <Link to="/inventory">View Inventory</Link>
            </Button>
            <Button variant="outline" asChild className="gap-2">
              <Link to="/add-medicine"><Plus className="h-4 w-4" /> Add Medicine</Link>
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryData.map((item, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{item.title}</p>
                    <p className="text-3xl font-bold mt-1">{item.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${item.color}`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Expiry Status Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChartPie className="h-5 w-5" />
                Medicine Expiry Status
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expiryStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {expiryStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Categories Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChartBar className="h-5 w-5" />
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
                    <Bar dataKey="value" nameKey="name">
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Expiry Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChartLine className="h-5 w-5" />
                Monthly Medicine Expiry Forecast
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyExpiryData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      name="Expiring Medicines"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Feature Access */}
        <div className="mt-10 grid md:grid-cols-3 gap-4">
          <Card className="bg-white shadow-md">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                Expiry Tracking
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get real-time alerts for medicines nearing expiration.
              </p>
              <Button variant="outline" asChild size="sm" className="w-full">
                <Link to="/inventory">View Expiring</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-md">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Medicine className="h-5 w-5 text-purple-600" />
                Inventory Management
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Easily add, edit, and manage your medicine stock.
              </p>
              <Button variant="outline" asChild size="sm" className="w-full">
                <Link to="/inventory">Manage Inventory</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-md">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <ChartBar className="h-5 w-5 text-green-600" />
                Reporting
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Generate comprehensive reports and insights.
              </p>
              <Button variant="outline" asChild size="sm" className="w-full">
                <Link to="/inventory">View Reports</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Custom tooltip for the charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border rounded shadow text-sm">
        <p className="font-medium">{label || payload[0].name}</p>
        <p className="text-muted-foreground">
          {payload[0].name}: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export default Index;
