"use client";

interface GuestFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  numGuests: number;
  tripDescription: string;
  hasPets: boolean;
  petInfo: string;
  houseRulesAck: boolean;
  stayingMyself: boolean;
}

interface GuestInfoFormProps {
  data: GuestFormData;
  onChange: (data: GuestFormData) => void;
  maxGuests: number;
  errors: Record<string, string>;
  onEmailBlur?: (email: string) => void;
}

export default function GuestInfoForm({
  data,
  onChange,
  maxGuests,
  errors,
  onEmailBlur,
}: GuestInfoFormProps) {
  function update(field: string, value: string | number | boolean) {
    onChange({ ...data, [field]: value });
  }

  return (
    <div className="space-y-5">
      {/* Name */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            First name *
          </label>
          <input
            type="text"
            value={data.firstName}
            onChange={(e) => update("firstName", e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#4C6C4E] focus:ring-1 focus:ring-[#4C6C4E]"
          />
          {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Last name *
          </label>
          <input
            type="text"
            value={data.lastName}
            onChange={(e) => update("lastName", e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#4C6C4E] focus:ring-1 focus:ring-[#4C6C4E]"
          />
          {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Email *
        </label>
        <input
          type="email"
          value={data.email}
          onChange={(e) => update("email", e.target.value)}
          onBlur={() => {
            if (onEmailBlur && data.email.includes("@")) {
              onEmailBlur(data.email);
            }
          }}
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#4C6C4E] focus:ring-1 focus:ring-[#4C6C4E]"
        />
        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
      </div>

      {/* Phone */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Phone <span className="font-normal text-gray-400">(optional — for faster approval)</span>
        </label>
        <input
          type="tel"
          value={data.phone}
          onChange={(e) => update("phone", e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#4C6C4E] focus:ring-1 focus:ring-[#4C6C4E]"
        />
        {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
      </div>

      {/* Guests */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Number of guests *
        </label>
        <input
          type="number"
          min={1}
          max={maxGuests}
          value={data.numGuests}
          onChange={(e) => update("numGuests", parseInt(e.target.value) || 1)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#4C6C4E] focus:ring-1 focus:ring-[#4C6C4E]"
        />
      </div>

      {/* Trip description */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Tell us about your trip *
        </label>
        <textarea
          value={data.tripDescription}
          onChange={(e) => update("tripDescription", e.target.value)}
          rows={3}
          placeholder="What brings you to the area? Any special requests?"
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#4C6C4E] focus:ring-1 focus:ring-[#4C6C4E]"
        />
        {errors.tripDescription && (
          <p className="mt-1 text-xs text-red-500">{errors.tripDescription}</p>
        )}
        <p className="mt-1 text-xs text-gray-400">
          {data.tripDescription.length}/20 characters minimum
        </p>
      </div>

      {/* Pets toggle */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Will you be bringing pets?
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => onChange({ ...data, hasPets: false, petInfo: "" })}
            className={`rounded-lg border px-6 py-2 text-sm font-medium transition ${
              !data.hasPets
                ? "border-[#4C6C4E] bg-[#4C6C4E]/10 text-[#4C6C4E]"
                : "border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            No
          </button>
          <button
            type="button"
            onClick={() => update("hasPets", true)}
            className={`rounded-lg border px-6 py-2 text-sm font-medium transition ${
              data.hasPets
                ? "border-[#4C6C4E] bg-[#4C6C4E]/10 text-[#4C6C4E]"
                : "border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            Yes
          </button>
        </div>
        {data.hasPets && (
          <div className="mt-3">
            <input
              type="text"
              value={data.petInfo}
              onChange={(e) => update("petInfo", e.target.value)}
              placeholder="Breed, weight, and number of pets"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#4C6C4E] focus:ring-1 focus:ring-[#4C6C4E]"
            />
          </div>
        )}
      </div>

      {/* House rules */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={data.houseRulesAck}
            onChange={(e) => update("houseRulesAck", e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#4C6C4E] focus:ring-[#4C6C4E]"
          />
          <span className="text-sm text-gray-600">
            I confirm that my group will refrain from loud noise, amplified
            music, parties, and excessive traffic. *
          </span>
        </label>
        {errors.houseRulesAck && (
          <p className="mt-2 text-xs text-red-500">{errors.houseRulesAck}</p>
        )}
      </div>
    </div>
  );
}
