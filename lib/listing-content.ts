export const BIO_CONTENT = {
  monthly: {
    heading: "About this monthly rental",
    paragraphs: [
      "This is a monthly furnished rental managed by Open Air Homes, a licensed California brokerage (DRE #02164159). Stays of 30 nights or more are exempt from Transient Occupancy Tax under California law.",
      "All monthly guests sign a California Association of Realtors (CAR) lease before check-in. CAR forms are the industry standard for 30+ day tenancies in California and provide real legal protection for both the guest and the homeowner.",
      "Open Air Homes has managed furnished rentals across Los Angeles and Palm Springs since 2012, with a 4.89 average Airbnb rating across thousands of stays. Our reservations team is available 24/7."
    ]
  },
  str: {
    heading: "About this short-term rental",
    paragraphs: [
      "This is a short-term rental managed by Open Air Homes, a licensed California brokerage (DRE #02164159). The property is permitted in compliance with the local short-term rental ordinance and operates legally under the city's regulations.",
      "Transient Occupancy Tax applies to stays under 30 nights and is collected at checkout, then remitted directly to the city on the homeowner's behalf. The exact rate appears in your price breakdown.",
      "Open Air Homes has maintained Superhost status on Airbnb for over 14 years, with a 4.89 average Airbnb rating across thousands of stays. Our reservations team is available 24/7."
    ]
  }
} as const;

export const FAQ_CONTENT = {
  monthly: [
    {
      q: "Why is this a monthly rental and not a nightly stay?",
      a: "This home has a 30-night minimum because monthly rentals offer steadier revenue for the homeowner, less wear on the property, and full legal compliance with local short-term rental rules. In California, stays of 30+ nights are classified as tenancies and follow a different legal framework than nightly stays.\n\nMany homes on our platform do monthly rentals for one reason or another. Some homeowners do not qualify for short-term rentals; others simply prefer longer stays for less turnover. Most of our homeowners occupy their homes for part of the year and rent out when they are away. They often prefer guests looking for longer stays who will become a local part of the community, respect the home and neighborhood, and understand they are moving into a home that is loved and cared for. We work with each homeowner to make the space feel less personalized so guests can feel like it is their own home during their stay."
    },
    {
      q: "Do I need to sign a lease?",
      a: "Yes. All guests staying 30+ nights sign a California Association of Realtors (CAR) lease before check-in. We send the lease via DocuSign shortly after your booking is approved. CAR forms are the standard for furnished tenancies in California, and the lease contains all of the boilerplate language you would see in any long-term lease. It is a legal requirement and gives both parties clear legal protection."
    },
    {
      q: "Is this an instant booking?",
      a: "No. Nearly every booking on the Open Air Homes direct site is request-to-book. We review each request within 24 hours, then approve or decline based on the dates and the details of your stay. Your card is held but not charged until we approve."
    },
    {
      q: "Do I have to pay Transient Occupancy Tax (TOT)?",
      a: "No. Transient Occupancy Tax applies only to stays under 30 nights. Monthly rentals are exempt under California law, which is one of the reasons monthly stays are typically less expensive per night than equivalent short-term bookings."
    },
    {
      q: "What's included in the monthly price?",
      a: "Your monthly rental includes the home fully furnished, all utilities (water, gas, electricity, internet), routine maintenance, and 24/7 support from our reservations team. Cleaning is performed before your stay and after departure. Mid-stay cleanings can be added for an additional fee.\n\nUtilities are capped at 30% above the property's standard usage. If usage during your stay exceeds that cap, we bill the difference for water, power, and gas at the end of the stay."
    },
    {
      q: "Can I extend my stay?",
      a: "Often yes, depending on the calendar and when the homeowner is returning. Reach out to reservations@openairhomes.com a few weeks before your departure date and we will check availability. Extensions are processed under the same CAR lease structure.\n\nPlease note that calendars often remain open further into the future, so if you are considering extending, the sooner we are aware the better."
    },
    {
      q: "How is booking direct different from booking on Airbnb?",
      a: "Booking direct removes the platform service fee that Airbnb charges guests, which on monthly stays can be meaningful. You also get a direct line to our team, the same property, the same homeowner, and the same CAR lease. Same home, same standards, fewer fees."
    },
    {
      q: "Who manages this home?",
      a: "Open Air Homes, a licensed California brokerage (DRE #02164159) operating across Los Angeles and Palm Springs since 2012. We manage every aspect of the rental: guest communication, lease, cleaning, maintenance, and support. You have one point of contact throughout your stay, and you can reach us simply by texting or calling 24/7. A reservations team member is on every hour of every day to help with anything you need during your stay."
    }
  ],
  str: [
    {
      q: "Is this an instant booking?",
      a: "No. Nearly every booking on the Open Air Homes direct site is request-to-book. We review each request within 24 hours, then approve or decline based on the dates and the details of your stay. Your card is held but not charged until we approve."
    },
    {
      q: "What is Transient Occupancy Tax (TOT) and why is it on my bill?",
      a: "TOT is a city tax on short-term lodging. Most Southern California cities charge between 9% and 14% on stays under 30 nights. We collect it at checkout and remit it directly to the city on the homeowner's behalf, in full compliance with local law. The exact rate for this home appears in your price breakdown."
    },
    {
      q: "Is this property permitted for short-term rentals?",
      a: "Yes. We only manage short-term rentals in homes that hold the appropriate city permit. Open Air Homes operates in markets where we maintain a physical presence and where we can ensure ongoing compliance for every home in our portfolio."
    },
    {
      q: "Can I extend my stay past 30 nights?",
      a: "If your stay crosses the 30-night threshold, the booking shifts into our monthly rental framework, which means you will sign a CAR lease and TOT no longer applies for the extended portion. Reach out to reservations@openairhomes.com and we will walk you through it."
    },
    {
      q: "What's the cancellation policy?",
      a: "Our standard policy is a full refund if you cancel at least 30 days before check-in, and 50% if you cancel at least 14 days before check-in. Specific terms appear at checkout. If you need flexibility outside these windows, mention it in your booking request."
    },
    {
      q: "How is booking direct different from booking on Airbnb?",
      a: "Booking direct removes the Airbnb guest service fee, which is typically 13% to 16% of the booking total. You get the same home, the same standards of care, and a direct line to our team for any questions before or during your stay."
    },
    {
      q: "Who manages this home?",
      a: "Open Air Homes, a licensed California brokerage (DRE #02164159) operating across Los Angeles and Palm Springs since 2012. We have maintained Superhost status on Airbnb for over 14 years. You have one point of contact throughout your stay, and you can reach us simply by texting or calling 24/7. A reservations team member is on every hour of every day to help with anything you need during your stay."
    }
  ]
} as const;
