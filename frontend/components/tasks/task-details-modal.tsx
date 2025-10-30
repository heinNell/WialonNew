'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate, getStatusColor } from '@/lib/utils';
import {
  MapPin,
  User,
  Phone,
  Mail,
  Calendar,
  Package,
  FileText,
  Clock,
} from 'lucide-react';

interface TaskDetailsModalProps {
  task: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function TaskDetailsModal({
  task,
  isOpen,
  onClose,
}: TaskDetailsModalProps) {
  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{task.title}</span>
            <Badge className={getStatusColor(task.status)}>
              {task.status.replace('_', ' ')}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Type</p>
              <p className="font-medium capitalize">{task.type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Priority</p>
              <Badge
                variant="outline"
                className={
                  task.priority === 'urgent'
                    ? 'border-red-500 text-red-700'
                    : task.priority === 'high'
                    ? 'border-orange-500 text-orange-700'
                    : 'border-gray-500 text-gray-700'
                }
              >
                {task.priority}
              </Badge>
            </div>
            {task.orderNumber && (
              <div>
                <p className="text-sm text-gray-600">Order Number</p>
                <p className="font-medium">{task.orderNumber}</p>
              </div>
            )}
            {task.referenceNumber && (
              <div>
                <p className="text-sm text-gray-600">Reference Number</p>
                <p className="font-medium">{task.referenceNumber}</p>
              </div>
            )}
          </div>

          {/* Description */}
          {task.description && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-gray-600" />
                <p className="text-sm font-medium text-gray-600">Description</p>
              </div>
              <p className="text-gray-900">{task.description}</p>
            </div>
          )}

          {/* Location */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-gray-600" />
              <p className="text-sm font-medium text-gray-600">Location</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              {task.address && <p className="font-medium">{task.address}</p>}
              <p className="text-sm text-gray-600">
                Coordinates: {task.latitude.toFixed(6)}, {task.longitude.toFixed(6)}
              </p>
            </div>
          </div>

          {/* Contact Information */}
          {(task.contactName || task.contactPhone || task.contactEmail) && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-gray-600" />
                <p className="text-sm font-medium text-gray-600">Contact Information</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                {task.contactName && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span>{task.contactName}</span>
                  </div>
                )}
                {task.contactPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{task.contactPhone}</span>
                  </div>
                )}
                {task.contactEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{task.contactEmail}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Schedule */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-gray-600" />
              <p className="text-sm font-medium text-gray-600">Schedule</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              {task.scheduledStartTime && (
                <div>
                  <p className="text-sm text-gray-600">Scheduled Start</p>
                  <p className="font-medium">{formatDate(task.scheduledStartTime)}</p>
                </div>
              )}
              {task.actualStartTime && (
                <div>
                  <p className="text-sm text-gray-600">Actual Start</p>
                  <p className="font-medium">{formatDate(task.actualStartTime)}</p>
                </div>
              )}
              {task.actualEndTime && (
                <div>
                  <p className="text-sm text-gray-600">Completed At</p>
                  <p className="font-medium">{formatDate(task.actualEndTime)}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">Estimated Duration</p>
                <p className="font-medium">{task.estimatedDuration} minutes</p>
              </div>
            </div>
          </div>

          {/* Package Details */}
          {(task.weight || task.volume || task.packageCount) && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-4 h-4 text-gray-600" />
                <p className="text-sm font-medium text-gray-600">Package Details</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-3 gap-4">
                {task.weight && (
                  <div>
                    <p className="text-sm text-gray-600">Weight</p>
                    <p className="font-medium">{task.weight} kg</p>
                  </div>
                )}
                {task.volume && (
                  <div>
                    <p className="text-sm text-gray-600">Volume</p>
                    <p className="font-medium">{task.volume} m³</p>
                  </div>
                )}
                {task.packageCount && (
                  <div>
                    <p className="text-sm text-gray-600">Packages</p>
                    <p className="font-medium">{task.packageCount}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {task.notes && (
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Notes</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-900">{task.notes}</p>
              </div>
            </div>
          )}

          {/* Completion Notes */}
          {task.completionNotes && (
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Completion Notes</p>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-gray-900">{task.completionNotes}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}