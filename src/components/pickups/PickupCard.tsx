import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const STATUS_COLORS = {
  SCHEDULED: "bg-gray-100 text-gray-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-purple-100 text-purple-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const WASTE_TYPE_COLORS = {
  PLASTIC: "bg-blue-100 text-blue-800",
  ORGANIC: "bg-green-100 text-green-800",
  PAPER: "bg-gray-100 text-gray-800",
  METAL: "bg-yellow-100 text-yellow-800",
  GLASS: "bg-cyan-100 text-cyan-800",
  MIXED: "bg-purple-100 text-purple-800",
};

export interface PickupCardProps {
  pickup: any;
  color: string;
  cancelPickup: any;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatWeight = (weight?: number) => {
  return weight ? `${weight} kg` : "Not specified";
};

const PickupCard: React.FC<PickupCardProps> = ({
  pickup,
  cancelPickup,
  color = "border-green-500",
}) => {
  return (
    <div
      key={pickup.id}
      className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 ${color} flex flex-col justify-between h-full`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Pickup Request #{pickup.id.slice(-8)}
          </h3>
          <p className="text-sm text-gray-600 mb-1">
            📅 {formatDate(pickup.pickupDate)}
          </p>
          <p className="text-sm text-gray-600">
            📍 {pickup.address.street}, {pickup.address.city}{" "}
            {pickup.address.postalCode}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            STATUS_COLORS[pickup.status as keyof typeof STATUS_COLORS] ||
            "bg-gray-100 text-gray-700"
          }`}
        >
          {pickup.status.replace("_", " ")}
        </span>
      </div>

      {/* Waste Types */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Waste Types:</h4>
        <div className="flex flex-wrap gap-2">
          {pickup.wasteTypes.map((type: any) => (
            <span
              key={type}
              className={`px-2 py-1 text-xs font-medium rounded ${
                WASTE_TYPE_COLORS[type as keyof typeof WASTE_TYPE_COLORS]
              }`}
            >
              {type}
            </span>
          ))}
        </div>
      </div>

      {/* Weight Information */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <span className="text-sm font-medium text-gray-700">
            Estimated Weight:
          </span>
          <p className="text-sm text-gray-600">
            {formatWeight(pickup.estimatedWeight)}
          </p>
        </div>
        {pickup.actualWeight && (
          <div>
            <span className="text-sm font-medium text-gray-700">
              Actual Weight:
            </span>
            <p className="text-sm text-gray-600">
              {formatWeight(pickup.actualWeight)}
            </p>
          </div>
        )}
      </div>

      {/* Special Instructions */}
      {pickup.specialInstructions && (
        <div className="mb-4">
          <span className="text-sm font-medium text-gray-700">
            Special Instructions:
          </span>
          <p className="text-sm text-gray-600">{pickup.specialInstructions}</p>
        </div>
      )}

      {/* Driver Notes */}
      {pickup.driverNotes && (
        <div className="mb-4">
          <span className="text-sm font-medium text-gray-700">
            Driver Notes:
          </span>
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
      {pickup.photoUrl && (
        <div className="mb-4">
          <ZoomImage src={pickup.photoUrl} alt="Pickup Photo" />
        </div>
      )}
      {/* Actions */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-auto">
        <span className="text-xs text-gray-500">
          Created {new Date(pickup.createdAt).toLocaleDateString("id-ID")}
        </span>
        <div className="flex gap-2">
          {pickup.status === "PENDING" && (
            <button
              onClick={() => cancelPickup(pickup.id)}
              className="text-red-600 cursor-pointer hover:text-red-800 text-sm font-medium"
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
  );
};

// Komponen ZoomImage
const ZoomImage: React.FC<{
  src: string;
  alt?: string;
  thumbWidth?: number;
  thumbHeight?: number;
}> = ({ src, alt = "", thumbWidth = 64, thumbHeight = 64 }) => {
  const [showZoom, setShowZoom] = useState(false);
  return (
    <>
      <button
        type="button"
        className="focus:outline-none"
        onClick={() => setShowZoom(true)}
        aria-label="Zoom Pickup Photo"
      >
        <Image
          src={src}
          alt={alt}
          width={thumbWidth}
          height={thumbHeight}
          
          style={{ objectFit: "cover" }}
          className="rounded w-16 h-16 object-cover transition-transform hover:scale-105"
        />
      </button>
      {showZoom && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          onClick={() => setShowZoom(false)}
        >
          <div className="relative">
            <Image
              src={src}
              alt={alt + " Zoom"}
              width={600}
              height={600}
              className="rounded-lg shadow-lg max-w-full max-h-[80vh] object-contain"
            />
            <button
              type="button"
              className="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:bg-gray-200"
              onClick={(e) => {
                e.stopPropagation();
                setShowZoom(false);
              }}
              aria-label="Close Zoom"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6 text-gray-700"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
export default PickupCard;
