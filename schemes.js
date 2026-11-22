// Scheme rules as data, so a non-engineer can audit them line by line.
// IMPORTANT: these rules were written from memory of public scheme guidelines and have NOT been
// checked against the official pages. Before showing this to anyone, open each `url`, confirm every
// condition and amount, and set `verified_on` to the date you checked. The UI shows this status.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SCHEMES = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  const UNORG = ['unorganised_worker', 'street_vendor', 'artisan', 'farmer'];
  // A scheme is open to you if ANY one path has all its `when` conditions true.
  // `confirm` lists things the form cannot check; they keep the result at "Likely".
  return [
    { id: 'pmkisan', name: 'PM-KISAN', benefit: '₹6,000 a year, paid in three instalments to farmer families', url: 'https://pmkisan.gov.in', docs: ['Aadhaar', 'Land records', 'Bank account linked to Aadhaar'], verified_on: null,
      paths: [{ when: [['owns_farmland', 'is', true, 'Owns cultivable land'], ['income_tax_payer', 'is', false, 'Family does not pay income tax']],
        confirm: ['No family member is a serving or retired government employee (some lower grades are exempt)', 'No family member is a registered professional such as a doctor, lawyer or CA'] }] },
    { id: 'pmjjby', name: 'PM Jeevan Jyoti Bima Yojana', benefit: '₹2 lakh life cover for ₹436 a year', url: 'https://jansuraksha.gov.in', docs: ['Bank account', 'Aadhaar'], verified_on: null,
      paths: [{ when: [['age', 'between', [18, 50], 'Aged 18 to 50'], ['has_bank_account', 'is', true, 'Has a bank or post office account']], confirm: [] }] },
    { id: 'pmsby', name: 'PM Suraksha Bima Yojana', benefit: '₹2 lakh accident cover for ₹20 a year', url: 'https://jansuraksha.gov.in', docs: ['Bank account', 'Aadhaar'], verified_on: null,
      paths: [{ when: [['age', 'between', [18, 70], 'Aged 18 to 70'], ['has_bank_account', 'is', true, 'Has a bank or post office account']], confirm: [] }] },
    { id: 'apy', name: 'Atal Pension Yojana', benefit: 'Guaranteed pension of ₹1,000 to ₹5,000 a month from age 60', url: 'https://jansuraksha.gov.in', docs: ['Bank account', 'Aadhaar', 'Mobile number'], verified_on: null,
      paths: [{ when: [['age', 'between', [18, 40], 'Aged 18 to 40'], ['has_bank_account', 'is', true, 'Has a savings account']], confirm: ['Confirm the applicant personally meets the income-tax exclusion on the official page'] }] },
    { id: 'pmjay', name: 'Ayushman Bharat PM-JAY', benefit: 'Free hospital treatment up to ₹5 lakh per family per year', url: 'https://beneficiary.nha.gov.in', docs: ['Aadhaar', 'Ration card or family ID'], verified_on: null,
      paths: [{ when: [['age', 'gte', 70, 'Aged 70 or above (any income)']], confirm: [] },
        { when: [['bpl', 'is', true, 'Low-income household']], confirm: ['Your family appears on the official beneficiary list (check with Aadhaar on the portal)'] }] },
    { id: 'pmuy', name: 'PM Ujjwala Yojana', benefit: 'A deposit-free LPG connection for women in poor households', url: 'https://pmuy.gov.in', docs: ['Aadhaar', 'Ration card', 'Bank account'], verified_on: null,
      paths: [{ when: [['gender', 'is', 'female', 'Applicant is a woman'], ['age', 'gte', 18, 'Aged 18 or above'], ['has_lpg', 'is', false, 'No LPG connection in the household']], confirm: ['Household falls in one of the eligible poor-household categories'] }] },
    { id: 'ssy', name: 'Sukanya Samriddhi Yojana', benefit: 'High-interest, tax-free savings account for a girl child', url: 'https://www.indiapost.gov.in', docs: ['Girl’s birth certificate', 'Parent’s ID and address proof'], verified_on: null,
      paths: [{ when: [['has_girl_child_under_10', 'is', true, 'Has a daughter under 10']], confirm: ['At most two such accounts per family (exceptions for twins)'] }] },
    { id: 'svanidhi', name: 'PM SVANidhi', benefit: 'Collateral-free working-capital loans for street vendors, in rising tranches', url: 'https://pmsvanidhi.mohua.gov.in', docs: ['Aadhaar', 'Vending certificate, ID card or letter of recommendation'], verified_on: null,
      paths: [{ when: [['occupation', 'is', 'street_vendor', 'Works as a street vendor']], confirm: ['You vend in an urban or peri-urban area', 'You hold a vending certificate or can get a letter of recommendation from the local body'] }] },
    { id: 'vishwakarma', name: 'PM Vishwakarma', benefit: 'Skill training, a toolkit grant and low-interest loans for traditional artisans', url: 'https://pmvishwakarma.gov.in', docs: ['Aadhaar', 'Bank account', 'Ration card'], verified_on: null,
      paths: [{ when: [['occupation', 'is', 'artisan', 'Works with hands and tools in a traditional trade'], ['age', 'gte', 18, 'Aged 18 or above']], confirm: ['Your trade is one of the listed trades', 'No similar government business loan taken in the last five years', 'Only one member per family can register'] }] },
    { id: 'pmsym', name: 'PM Shram Yogi Maandhan', benefit: '₹3,000 a month pension after 60 for unorganised workers, with matching government contribution', url: 'https://maandhan.in', docs: ['Aadhaar', 'Savings account'], verified_on: null,
      paths: [{ when: [['occupation', 'in', UNORG, 'Works in the unorganised sector'], ['age', 'between', [18, 40], 'Aged 18 to 40'], ['annual_income', 'lte', 180000, 'Earns ₹15,000 a month or less'], ['epfo_member', 'is', false, 'Not covered by PF, ESIC or NPS']], confirm: ['Confirm your own monthly earnings are no more than INR 15,000; family income alone cannot establish this', 'Confirm you are not personally an income tax payer and are not covered by NPS'] }] },
    { id: 'pmmvy', name: 'PM Matru Vandana Yojana', benefit: 'Cash support for pregnant women and new mothers', url: 'https://pmmvy.wcd.gov.in', docs: ['Aadhaar', 'Mother and child protection card', 'Bank account'], verified_on: null,
      paths: [{ when: [['gender', 'is', 'female', 'Applicant is a woman'], ['pregnant_or_new_mother', 'is', true, 'Pregnant or recently delivered']], confirm: ['It is your first child, or a second child who is a girl', 'You are not in regular government employment'] }] },
    { id: 'ignoaps', name: 'Indira Gandhi National Old Age Pension', benefit: 'Monthly pension for senior citizens in low-income households', url: 'https://nsap.nic.in', docs: ['Age proof', 'BPL card', 'Bank account'], verified_on: null,
      paths: [{ when: [['age', 'gte', 60, 'Aged 60 or above'], ['bpl', 'is', true, 'Below-poverty-line household']], confirm: [] }] },
    { id: 'pms_sc', name: 'Post-Matric Scholarship for SC students', benefit: 'Fees and a maintenance allowance for study after class 10', url: 'https://scholarships.gov.in', docs: ['Caste certificate', 'Income certificate', 'Previous marksheet', 'Bank account'], verified_on: null,
      paths: [{ when: [['category', 'is', 'sc', 'Belongs to a Scheduled Caste'], ['post_matric_student', 'is', true, 'Studying after class 10'], ['annual_income', 'lte', 250000, 'Family income up to ₹2.5 lakh a year']], confirm: [] }] },
    { id: 'pmay', name: 'PM Awas Yojana', benefit: 'Financial help to build or buy a first pucca house', url: 'https://pmay-urban.gov.in', docs: ['Aadhaar', 'Income proof', 'Land or property papers'], verified_on: null,
      paths: [{ when: [['has_pucca_house', 'is', false, 'Does not own a pucca house'], ['annual_income', 'lte', 900000, 'Family income up to ₹9 lakh a year']], confirm: ['No family member owns a pucca house anywhere in India', 'In villages, your household must be on the housing survey list'] }] },
    { id: 'eshram', name: 'e-Shram card', benefit: 'National ID for unorganised workers that links you to social-security schemes', url: 'https://eshram.gov.in', docs: ['Aadhaar', 'Mobile linked to Aadhaar', 'Bank account'], verified_on: null,
      paths: [{ when: [['occupation', 'in', UNORG, 'Works in the unorganised sector'], ['age', 'between', [16, 59], 'Aged 16 to 59'], ['epfo_member', 'is', false, 'Not a member of PF or ESIC']], confirm: [] }] }
  ];
});
