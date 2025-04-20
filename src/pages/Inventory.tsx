
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package, Search, Filter } from "lucide-react";

const Inventory = () => {
  // Temporary mock data until we integrate with backend
  const medicines = [
    {
      id: 1,
      name: "Paracetamol",
      quantity: 100,
      batchNumber: "B123",
      expiryDate: "2025-12-31",
      manufacturer: "PharmaCorp",
      category: "analgesics",
      expiryStatus: "safe"
    },
    {
      id: 2,
      name: "Amoxicillin",
      quantity: 50,
      batchNumber: "B456",
      expiryDate: "2024-05-15",
      manufacturer: "MediLabs",
      category: "antibiotics",
      expiryStatus: "expiring-soon"
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Package className="h-8 w-8" />
          Medicine Inventory
        </h1>
        <Button asChild>
          <a href="/add-medicine">Add New Medicine</a>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search medicines..."
                className="pl-9"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Batch Number</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Manufacturer</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {medicines.map((medicine) => (
                  <TableRow key={medicine.id}>
                    <TableCell className="font-medium">{medicine.name}</TableCell>
                    <TableCell>{medicine.quantity}</TableCell>
                    <TableCell>{medicine.batchNumber}</TableCell>
                    <TableCell>{medicine.expiryDate}</TableCell>
                    <TableCell>{medicine.manufacturer}</TableCell>
                    <TableCell className="capitalize">{medicine.category}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                        ${medicine.expiryStatus === 'expired' ? 'bg-red-100 text-red-700' : 
                        medicine.expiryStatus === 'expiring-soon' ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-green-100 text-green-700'}`}>
                        {medicine.expiryStatus === 'expired' ? 'Expired' :
                         medicine.expiryStatus === 'expiring-soon' ? 'Expiring Soon' :
                         'Safe'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Inventory;
