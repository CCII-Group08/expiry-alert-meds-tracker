
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-4xl font-bold mb-4 text-primary">Welcome to ExpiryAlert</h1>
        <p className="text-xl text-muted-foreground mb-6">
          A comprehensive medicine inventory management system to help track and manage your pharmaceutical stock efficiently.
        </p>
        
        <div className="flex justify-center space-x-4">
          <Button asChild>
            <Link to="/inventory">View Inventory</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link to="/add-medicine">Add Medicine</Link>
          </Button>
        </div>

        <div className="mt-10 grid md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Expiry Tracking</h3>
            <p className="text-sm text-muted-foreground">
              Get real-time alerts for medicines nearing expiration.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Inventory Management</h3>
            <p className="text-sm text-muted-foreground">
              Easily add, edit, and manage your medicine stock.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Reporting</h3>
            <p className="text-sm text-muted-foreground">
              Generate comprehensive reports and insights.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
