
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Pill, ArrowLeft } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Form schema with validation
const medicineSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  quantity: z.number().min(1, { message: "Quantity must be at least 1" }),
  batchNumber: z.string().min(1, { message: "Batch number is required" }),
  expiryDate: z.string().refine(date => {
    const today = new Date();
    const expDate = new Date(date);
    return expDate >= today;
  }, { message: "Expiry date must be in the future" }),
  manufacturer: z.string().min(2, { message: "Manufacturer is required" }),
  category: z.string().min(1, { message: "Please select a category" }),
  barcode: z.string().optional(),
  notes: z.string().optional(),
});

type MedicineFormValues = z.infer<typeof medicineSchema>;

const AddMedicine = () => {
  const navigate = useNavigate();
  const form = useForm<MedicineFormValues>({
    resolver: zodResolver(medicineSchema),
    defaultValues: {
      name: "",
      quantity: 1,
      batchNumber: "",
      expiryDate: "",
      manufacturer: "",
      category: "",
      barcode: "",
      notes: "",
    },
  });

  const onSubmit = async (data: MedicineFormValues) => {
    try {
      // We would normally send this to our API
      console.log('Form submitted with data:', data);
      
      // Success message
      toast.success("Medicine added successfully!", {
        description: `${data.name} has been added to your inventory.`,
      });
      
      // Navigate back to inventory
      navigate('/inventory');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("Failed to add medicine", {
        description: "There was an error adding the medicine to inventory.",
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Button 
        variant="outline" 
        className="mb-6" 
        onClick={() => navigate('/inventory')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Inventory
      </Button>
      
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Medicine className="h-6 w-6 text-primary" />
            <CardTitle>Add New Medicine</CardTitle>
          </div>
          <CardDescription>
            Fill out the form below to add a new medicine to your inventory.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medicine Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Paracetamol" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity*</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="batchNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Batch Number*</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., B12345" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date*</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="manufacturer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Manufacturer*</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., PharmaCorp" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category*</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="antibiotics">Antibiotics</SelectItem>
                          <SelectItem value="analgesics">Analgesics</SelectItem>
                          <SelectItem value="antiviral">Antiviral</SelectItem>
                          <SelectItem value="vitamins">Vitamins</SelectItem>
                          <SelectItem value="vaccines">Vaccines</SelectItem>
                          <SelectItem value="antihistamines">Antihistamines</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="barcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Barcode (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 978020137962" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Add any additional information about the medicine here..." 
                        className="resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end space-x-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate('/inventory')}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Medicine</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddMedicine;
