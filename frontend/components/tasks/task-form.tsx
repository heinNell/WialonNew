'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const taskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  type: z.enum(['delivery', 'pickup', 'service', 'maintenance']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().optional(),
  contactName: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal('')),
  scheduledStartTime: z.string().optional(),
  estimatedDuration: z.number().min(1).max(480).default(30),
  weight: z.number().optional(),
  volume: z.number().optional(),
  packageCount: z.number().optional(),
  orderNumber: z.string().optional(),
  notes: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  onSuccess?: () => void;
  initialData?: Partial<TaskFormData>;
}

export default function TaskForm({ onSuccess, initialData }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      type: 'delivery',
      priority: 'medium',
      estimatedDuration: 30,
      ...initialData,
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: TaskFormData) => api.createTask(data),
    onSuccess: () => {
      toast.success('Task created successfully');
      onSuccess?.();
    },
    onError: () => {
      toast.error('Failed to create task');
    },
  });

  const onSubmit = (data: TaskFormData) => {
    createMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Basic Information</h3>

        <div>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            {...register('title')}
            placeholder="Delivery to Customer A"
          />
          {errors.title && (
            <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register('description')}
            placeholder="Additional details about the task"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="type">Type *</Label>
            <Select
              defaultValue={watch('type')}
              onValueChange={(value) => setValue('type', value as any)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="delivery">Delivery</SelectItem>
                <SelectItem value="pickup">Pickup</SelectItem>
                <SelectItem value="service">Service</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="priority">Priority *</Label>
            <Select
              defaultValue={watch('priority')}
              onValueChange={(value) => setValue('priority', value as any)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="orderNumber">Order Number</Label>
          <Input
            id="orderNumber"
            {...register('orderNumber')}
            placeholder="ORD-12345"
          />
        </div>
      </div>

      {/* Location */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Location</h3>

        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            {...register('address')}
            placeholder="123 Main Street, Johannesburg"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="latitude">Latitude *</Label>
            <Input
              id="latitude"
              type="number"
              step="0.000001"
              {...register('latitude', { valueAsNumber: true })}
              placeholder="-26.1950"
            />
            {errors.latitude && (
              <p className="text-sm text-red-500 mt-1">{errors.latitude.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="longitude">Longitude *</Label>
            <Input
              id="longitude"
              type="number"
              step="0.000001"
              {...register('longitude', { valueAsNumber: true })}
              placeholder="28.0340"
            />
            {errors.longitude && (
              <p className="text-sm text-red-500 mt-1">{errors.longitude.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Contact Information</h3>

        <div>
          <Label htmlFor="contactName">Contact Name</Label>
          <Input
            id="contactName"
            {...register('contactName')}
            placeholder="John Doe"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="contactPhone">Phone</Label>
            <Input
              id="contactPhone"
              {...register('contactPhone')}
              placeholder="+27 12 345 6789"
            />
          </div>

          <div>
            <Label htmlFor="contactEmail">Email</Label>
            <Input
              id="contactEmail"
              type="email"
              {...register('contactEmail')}
              placeholder="john@example.com"
            />
            {errors.contactEmail && (
              <p className="text-sm text-red-500 mt-1">{errors.contactEmail.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Schedule & Details */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Schedule & Details</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="scheduledStartTime">Scheduled Time</Label>
            <Input
              id="scheduledStartTime"
              type="datetime-local"
              {...register('scheduledStartTime')}
            />
          </div>

          <div>
            <Label htmlFor="estimatedDuration">Duration (minutes) *</Label>
            <Input
              id="estimatedDuration"
              type="number"
              {...register('estimatedDuration', { valueAsNumber: true })}
              placeholder="30"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              {...register('weight', { valueAsNumber: true })}
              placeholder="5.5"
            />
          </div>

          <div>
            <Label htmlFor="volume">Volume (m³)</Label>
            <Input
              id="volume"
              type="number"
              step="0.01"
              {...register('volume', { valueAsNumber: true })}
              placeholder="0.5"
            />
          </div>

          <div>
            <Label htmlFor="packageCount">Package Count</Label>
            <Input
              id="packageCount"
              type="number"
              {...register('packageCount', { valueAsNumber: true })}
              placeholder="2"
            />
          </div>
        </div>
      </div>

      {/* Notes */}
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          {...register('notes')}
          placeholder="Additional notes or instructions"
          rows={3}
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-4 pt-4">
        <Button
          type="submit"
          disabled={createMutation.isPending}
          className="w-full sm:w-auto"
        >
          {createMutation.isPending && (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          )}
          Create Task
        </Button>
      </div>
    </form>
  );
}