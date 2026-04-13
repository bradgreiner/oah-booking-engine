import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: { email?: string };
}

export default async function UnsubscribePage({ searchParams }: Props) {
  const email = searchParams.email;
  let success = false;

  if (email) {
    try {
      await prisma.bookingSession.updateMany({
        where: { guestEmail: email },
        data: { unsubscribed: true },
      });
      success = true;
    } catch {
      // If no sessions found, still show success to avoid info leakage
      success = true;
    }
  }

  return (
    <>
      <Navbar />
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md text-center">
          {success ? (
            <>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#4C6C4E]/10">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-7 w-7 text-[#4C6C4E]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h1 className="mt-4 font-serif text-2xl text-gray-900">Unsubscribed</h1>
              <p className="mt-2 text-sm text-gray-500">
                You won&apos;t receive any more booking reminder emails from us.
              </p>
            </>
          ) : (
            <>
              <h1 className="font-serif text-2xl text-gray-900">Unsubscribe</h1>
              <p className="mt-2 text-sm text-gray-500">
                No email address provided. If you followed a link from an email, please try again.
              </p>
            </>
          )}
          <a href="/" className="mt-6 inline-block text-sm font-medium text-[#4C6C4E] hover:underline">
            Back to Open Air Homes
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
