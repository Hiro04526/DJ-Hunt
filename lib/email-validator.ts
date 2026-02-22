export function getEmailSuggestion(email: string): string | null {
  if (!email.includes("@")) return null;
  
  const [localPart, domain] = email.toLowerCase().split("@");
  
  const commonTypos: Record<string, string> = {
    // Gmail typos
    "gmal.com": "gmail.com",
    "gamil.com": "gmail.com",
    "gnail.com": "gmail.com",
    "gmial.com": "gmail.com",
    "gmaill.com": "gmail.com",
    "gmail.co": "gmail.com",
    "gmail.con": "gmail.com",  // 'n' is next to 'm'
    "gmai.com": "gmail.com",
    "gmsil.com": "gmail.com",  // 's' is next to 'a'
    "gmaik.com": "gmail.com",  // 'k' is next to 'l'

    // Yahoo typos
    "yaho.com": "yahoo.com",
    "yahooo.com": "yahoo.com",
    "yhoo.com": "yahoo.com",
    "yahoo.co": "yahoo.com",
    "yahoo.con": "yahoo.com",
    "yahou.com": "yahoo.com",

    // DLSU typos
    "dslu.edu.ph": "dlsu.edu.ph",  // Swapped letters
    "dlus.edu.ph": "dlsu.edu.ph",  // Swapped letters
    "dlsu.ed.ph": "dlsu.edu.ph",   // Missing 'u'
    "dlsu.edu.p": "dlsu.edu.ph",   // Missing 'h'
    "dlsu.edu.oh": "dlsu.edu.ph",  // 'o' is next to 'p'
    "dlsu.edu.com": "dlsu.edu.ph", // Muscle memory typing .com
    "dlsu.ph": "dlsu.edu.ph",      // Skipping .edu entirely
    "dlsu.edu.phl": "dlsu.edu.ph", // Adding an extra 'l'

    // Other common ones just to be safe
    "hotmial.com": "hotmail.com",
    "hitmail.com": "hotmail.com",
    "outlok.com": "outlook.com",
    "outlook.con": "outlook.com"
  };

  if (commonTypos[domain]) {
    return `${localPart}@${commonTypos[domain]}`;
  }

  return null;
}