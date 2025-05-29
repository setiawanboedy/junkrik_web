'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Pickup {
  id: string;
  pickupDate: string;
  wasteTypes: string[];
  estimatedWeight?: number;
  actualWeight?: number;
  status: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    notes?: string;
  };
  specialInstructions?: string;
  driverNotes?: string;
  createdAt: string;
  schedule?: {
    id: string;
    dayOfWeek: number;
    time: string;
  };
}

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-purple-100 text-purple-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800'
};

const WASTE_TYPE_COLORS = {
  PLASTIC: 'bg-blue-100 text-blue-800',
  ORGANIC: 'bg-green-100 text-green-800',
  PAPER: 'bg-gray-100 text-gray-800',
  METAL: 'bg-yellow-100 text-yellow-800',
  GLASS: 'bg-cyan-100 text-cyan-800',
  MIXED: 'bg-purple-100 text-purple-800'
};

export default function PickupList() {
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchPickups = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams();
      if (statusFilter) queryParams.append('status', statusFilter);
      
      const response = await fetch(`/api/pickups?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch pickups');
      }
      const data = await response.json();
      setPickups(data.data || []);
    } catch (err) {      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchPickups();
  }, [fetchPickups]);

  const handleCancel = async (pickupId: string) => {
    if (!confirm('Are you sure you want to cancel this pickup?')) {
      return;
    }

    try {
      const response = await fetch(`/api/pickups/${pickupId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to cancel pickup');
      }

      setPickups(pickups.map(pickup => 
        pickup.id === pickupId 
          ? { ...pickup, status: 'CANCELLED' }
          : pickup
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel pickup');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatWeight = (weight?: number) => {
    return weight ? `${weight} kg` : 'Not specified';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Pickup Requests</h2>
        <Link
          href="/dashboard/pickups/new"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Request Pickup
        </Link>
      </div>

      {/* Filter */}
      <div className="flex space-x-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {pickups.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500 mb-4">No pickup requests found</div>
          <Link
            href="/dashboard/pickups/new"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Request Your First Pickup
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {pickups.map((pickup) => (
            <div
              key={pickup.id}
              className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Pickup Request #{pickup.id.slice(-8)}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    📅 {formatDate(pickup.pickupDate)}
                  </p>
                  <p className="text-sm text-gray-600">
                    📍 {pickup.address.street}, {pickup.address.city} {pickup.address.postalCode}
                  </p>
                </div>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${STATUS_COLORS[pickup.status as keyof typeof STATUS_COLORS]}`}>
                  {pickup.status.replace('_', ' ')}
                </span>
              </div>

              {/* Waste Types */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Waste Types:</h4>
                <div className="flex flex-wrap gap-2">
                  {pickup.wasteTypes.map((type) => (
                    <span
                      key={type}
                      className={`px-2 py-1 text-xs font-medium rounded ${WASTE_TYPE_COLORS[type as keyof typeof WASTE_TYPE_COLORS]}`}
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              {/* Weight Information */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-sm font-medium text-gray-700">Estimated Weight:</span>
                  <p className="text-sm text-gray-600">{formatWeight(pickup.estimatedWeight)}</p>
                </div>
                {pickup.actualWeight && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Actual Weight:</span>
                    <p className="text-sm text-gray-600">{formatWeight(pickup.actualWeight)}</p>
                  </div>
                )}
              </div>

              {/* Special Instructions */}
              {pickup.specialInstructions && (
                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-700">Special Instructions:</span>
                  <p className="text-sm text-gray-600">{pickup.specialInstructions}</p>
                </div>
              )}

              {/* Driver Notes */}
              {pickup.driverNotes && (
                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-700">Driver Notes:</span>
                  <p className="text-sm text-gray-600">{pickup.driverNotes}</p>
                </div>
              )}

              {/* Schedule Info */}
              {pickup.schedule && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-blue-700">
                    🔄 This pickup is part of your regular schedule
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span className="text-xs text-gray-500">
                  Created {new Date(pickup.createdAt).toLocaleDateString('id-ID')}
                </span>
                
                <div className="flex gap-2">
                  {pickup.status === 'PENDING' && (
                    <button
                      onClick={() => handleCancel(pickup.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Cancel
                    </button>
                  )}
                  <Link
                    href={`/dashboard/pickups/${pickup.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
