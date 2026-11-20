/* VitalPath Care Group — News Center story store.
 *
 * This file is the single source of truth for the /vitalpath-news page
 * (and /medical-news, which serves the same page). The page renders
 * whatever is stored here — newest first — in two lanes:
 *   lane "florida"  -> "Florida & Community"
 *   lane "national" -> "National & World"
 *
 * HOW A DAILY EDITOR PASS UPDATES THE NEWS:
 *   1. Research the day's real health news (Florida / Central Florida
 *      for the "florida" lane; national and world health for the
 *      "national" lane). Health scope only — no other topics.
 *   2. Add one record per story to the TOP of the VITALPATH_NEWS array
 *      below, following the exact shape of the existing records.
 *      The page sorts by dateISO automatically, so position is a
 *      courtesy, not a requirement — the date fields decide the order.
 *   3. Write the full briefing in plain language in the "body" array:
 *      one string per paragraph. Never invent a story, a number, a
 *      date, or a quote — every fact must come from the named source.
 *   4. End every record with its "source" line naming the original
 *      source and its date in plain text, e.g.
 *      "Source: Florida Department of Health announcement — November 19, 2026".
 *   5. Save the file. Nothing else needs editing: news.js renders the
 *      new stories, the lane sections, and the "Latest edition" line
 *      automatically.
 *
 * HARD RULE — NO DOORS BY CONSTRUCTION: a story record has NO link or
 * URL field, and none may ever be added. Stories are read in full on
 * this page; the source is named in plain text only, never linked.
 *
 * PARKED-COMPANY RULE: VitalPath news is information and education
 * only. No offers, no service claims, no prices, no booking or
 * lead-capture language inside any story.
 *
 * Record shape:
 * {
 *   headline:   string  — the story headline
 *   dateISO:    string  — "YYYY-MM-DD", the story's date
 *   dateDisplay:string  — the same date written out, e.g. "Friday, November 20, 2026"
 *   lane:       string  — "florida" or "national"
 *   body:       [string, ...] — full briefing, one string per paragraph
 *   source:     string  — "Source: <source name> — <source date>"
 * }
 */
window.VITALPATH_NEWS = [
  {
    headline: "Florida dengue cases reach 651 in the largest U.S. outbreak in decades; Orange County is under a mosquito-borne illness alert",
    dateISO: "2026-11-20",
    dateDisplay: "Friday, November 20, 2026",
    lane: "florida",
    body: [
      "Florida's record dengue outbreak is still growing, though more slowly than a week ago. The Florida Department of Health counted 27 new locally acquired cases in the week ending November 14, bringing the statewide total for the year to 651 — the largest dengue outbreak in the United States in decades. The week before had added 100 new cases.",
      "Most cases are on Florida's west coast: 487 in Hillsborough County and 116 in Pinellas County. Central Florida is part of the picture too, with 15 cases in Orange County and 2 in Seminole County. Orange County is one of ten counties under a mosquito-borne illness alert — the stronger of the state's two warning levels — and eleven more counties are under an advisory. One death has been confirmed in Hillsborough County.",
      "Dengue is spread by mosquito bites, not from person to person. Health officials call it “breakbone fever” because of the severe muscle and joint pain it can cause, along with sudden fever, headache and eye pain, usually starting three to fourteen days after a bite. There is no specific cure; most people recover within about a week, but about one in twenty people infected develops severe dengue, which is a medical emergency.",
      "The Department of Health's standing advice is to “drain and cover”: drain standing water from garbage cans, old tires, pool covers and any other containers where water collects around the home, and cover up outdoors — long sleeves and pants where practical, and repellent on exposed skin — especially around sunrise and sunset, when mosquitoes are most active. Recent heavy rain has left standing water across much of Florida, which is why officials expect case numbers may keep rising in the weeks ahead."
    ],
    source: "Source: Sarasota Herald-Tribune (USA TODAY Network–Florida), reporting Florida Department of Health data — November 20, 2026"
  },
  {
    headline: "Orange County health department offices close November 25–27 for Thanksgiving",
    dateISO: "2026-11-18",
    dateDisplay: "Wednesday, November 18, 2026",
    lane: "florida",
    body: [
      "The Florida Department of Health in Orange County (DOH-Orange) has announced that all of its Orange County offices will be closed in observance of the Thanksgiving holiday on Wednesday, November 25, Thursday, November 26 and Friday, November 27.",
      "Regular office hours will resume on Monday, November 30. The department reminds residents and visitors to celebrate safely over the holiday, and notes that anyone facing a medical emergency that needs immediate assistance should call 911.",
      "Families who use county health department services — clinic visits, immunization records, or program paperwork — may want to plan around the three-day closure and take care of time-sensitive business earlier that week."
    ],
    source: "Source: Florida Department of Health in Orange County announcement — November 18, 2026"
  },
  {
    headline: "FDA approves first treatments for two rare diseases: type 3 Gaucher disease and infantile-onset Niemann-Pick disease type C",
    dateISO: "2026-11-18",
    dateDisplay: "Wednesday, November 18, 2026",
    lane: "national",
    body: [
      "The U.S. Food and Drug Administration announced two first-of-their-kind approvals for rare diseases this week. On November 18, the agency approved Infilbray (venglustat), the first drug approved to treat the neurological symptoms of type 3 Gaucher disease, a rare inherited disorder.",
      "A day earlier, on November 17, the FDA approved Lembaz (adrabetadex), the first drug shown to help patients with infantile-onset Niemann-Pick disease type C live longer. Niemann-Pick disease type C is a rare inherited condition that begins in infancy.",
      "Approvals like these matter because rare diseases often have no approved treatment at all for the symptoms that most affect daily life. Families dealing with either condition should talk with their own specialists about what these approvals may mean for them."
    ],
    source: "Source: U.S. Food and Drug Administration news releases — November 17 and 18, 2026"
  },
  {
    headline: "United States loses its measles elimination status after more than a year of unbroken spread",
    dateISO: "2026-11-17",
    dateDisplay: "Tuesday, November 17, 2026",
    lane: "national",
    body: [
      "The Pan American Health Organization (PAHO) announced on November 17 that the United States has lost its measles elimination status, a standing the country had held since 2000. Reviewers concluded that a single chain of measles transmission, which began on January 20, 2025, has persisted unbroken for more than twelve months — which means measles transmission is considered re-established in the United States. The elimination status for rubella in the United States remains unchanged.",
      "The numbers behind the decision are the highest in decades. The CDC has confirmed 5,412 measles cases in the United States so far in 2026, as of November 12, most of them among unvaccinated people. Across the Americas, 58,213 confirmed measles cases and 82 deaths had been reported as of November 13. Mexico and Bolivia lost their measles elimination status in the same announcement; Canada had lost its status in 2025.",
      "PAHO's director, Dr. Jarbas Barbosa, said the current situation requires urgent attention and called on countries across the Americas to close vaccination gaps and strengthen surveillance and outbreak response. Countries that lose elimination status are expected to submit a corrective action plan, and to earn the status back the United States would have to stop continuous spread for at least twelve months."
    ],
    source: "Source: Pan American Health Organization (PAHO) announcement — November 17, 2026"
  },
  {
    headline: "Flu season is off to a very early start, with high activity in seven states",
    dateISO: "2026-11-14",
    dateDisplay: "Saturday, November 14, 2026",
    lane: "national",
    body: [
      "The U.S. flu season has started unusually early this year and is intensifying quickly. In its latest weekly update, posted Friday, November 13, the Centers for Disease Control and Prevention reported that seven states were reporting high flu activity — up from two states the week before — and that more than 3% of doctors' office visits were for flu-like illness, a sign that flu season is genuinely underway.",
      "The early surge is centered in the South and West. The states reporting high activity are California, Louisiana, Oregon, South Carolina, Tennessee, Texas and Washington, with Louisiana seeing the worst of it so far. The CDC estimates that flu has already caused at least 2.6 million illnesses, 36,000 hospitalizations and 2,100 deaths so far this season.",
      "Health officials say early-season activity is higher than what is usually seen at this point of the year, though it is not yet clear whether that will mean a worse season overall. Doctors expect spread to pick up further as people travel and gather for Thanksgiving later this month."
    ],
    source: "Source: Associated Press, reporting Centers for Disease Control and Prevention data — November 14, 2026"
  }
];
