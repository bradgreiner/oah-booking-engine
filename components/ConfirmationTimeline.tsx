interface ConfirmationTimelineProps {
  numNights: number;
}

const STEPS = [
  {
    title: "We review your request",
    description: "Within 24 hours",
  },
  {
    title: "You receive an approval or decline email",
    description: "Check your inbox",
  },
];

export default function ConfirmationTimeline({
  numNights,
}: ConfirmationTimelineProps) {
  const steps = [...STEPS];

  if (numNights >= 30) {
    steps.push({
      title: "Sign the rental agreement",
      description: "Required for stays of 30+ nights",
    });
  }

  steps.push({
    title: "Receive check-in instructions",
    description: "7 days before arrival",
  });

  return (
    <div className="mt-4 space-y-0">
      {steps.map((step, i) => (
        <div key={i} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#4C6C4E]/10 text-xs font-semibold text-[#4C6C4E]">
              {i + 1}
            </div>
            {i < steps.length - 1 && (
              <div className="h-full w-px bg-gray-200" />
            )}
          </div>
          <div className="pb-5">
            <p className="text-sm font-medium text-gray-800">{step.title}</p>
            <p className="text-xs text-gray-500">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
