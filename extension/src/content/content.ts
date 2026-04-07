//interface describes what an object looks like
// This says: "The data we extract will always have a 'url' string
// and a 'textContent' string." This helps catch mistakes early --
// if we accidentally forget one of these fields, TypeScript will
// warn us before we even run the code.

interface PageData {
    url: string;
    textContent: string;
}

// Security check interface
interface SecurityCheck {
    isSafe: boolean;
    warnings: string[];
    domain: string;
}

//function that reads page content
//grabs:(1) current page URL & (2) visible text on page
//trimming text and cap it to 5000 characters to avoid sending too much data to the server

// function extractPageData(): PageData {
//     const url = window.location.href;
//     const rawText: string = document.body.innerText || "";
//     const textContent: string = rawText.trim().substring(0,5000);
    
//     return {
//         url: url,
//         textContent: textContent
//     };
// }

// Common legitimate domains (whitelist)
const TRUSTED_DOMAINS = new Set([
    'google.com',
    'github.com',
    'stackoverflow.com',
    'wikipedia.org',
    'microsoft.com',
    'apple.com',
    'amazon.com',
    'facebook.com',
    'twitter.com',
    'linkedin.com',
    'reddit.com',
    'youtube.com'
]);

// Common misspellings / lookalikes (examples)
const COMMON_LOOKALIKES: Record<string, string[]> = {
    'google.com': ['gogle.com', 'googlle.com', 'goolge.com', 'g00gle.com'],
    'github.com': ['githup.com', 'gitbub.com', 'githuub.com'],
    'amazon.com': ['amaz0n.com', 'amazom.com', 'amaozn.com'],
    'paypal.com': ['paypa1.com', 'paypai.com', 'paypa.com']
};

// Extract domain from URL
function extractDomain(url: string): string {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname.toLowerCase();
    } catch {
        return '';
    }
}

// Check for misspellings using Levenshtein distance
function levenshteinDistance(str1: string, str2: string): number {
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix: number[][] = Array(len2 + 1)
        .fill(null)
        .map(() => Array(len1 + 1).fill(0));

    for (let i = 0; i <= len1; i++) matrix[0][i] = i;
    for (let j = 0; j <= len2; j++) matrix[j][0] = j;

    for (let j = 1; j <= len2; j++) {
        for (let i = 1; i <= len1; i++) {
            const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
            matrix[j][i] = Math.min(
                matrix[j][i - 1] + 1,
                matrix[j - 1][i] + 1,
                matrix[j - 1][i - 1] + cost
            );
        }
    }
    return matrix[len2][len1];
}

// Perform security checks on domain
function checkDomainSecurity(url: string): SecurityCheck {
    const domain = extractDomain(url);
    const warnings: string[] = [];
    let isSafe = true;

    if (!domain) {
        return { isSafe: false, warnings: ['Invalid URL format'], domain: '' };
    }

    // Check 1: HTTPS protocol
    if (!url.startsWith('https://')) {
        warnings.push('⚠️ Not using HTTPS. Connection may not be secure.');
        isSafe = false;
    }

    // Check 2: Trusted TLD (.com, .org)
    const tld = domain.split('.').pop() || '';
    if (tld === 'com' || tld === 'org') {
        // Additional check: is it a known trusted domain?
        if (TRUSTED_DOMAINS.has(domain)) {
            return { isSafe: true, warnings: [], domain };
        }
    }

    // Check 3: Check against known lookalikes
    for (const [legitimate, lookalikes] of Object.entries(COMMON_LOOKALIKES)) {
        if (lookalikes.includes(domain)) {
            warnings.push(`🚨 Suspected phishing: "${domain}" looks like "${legitimate}"`);
            isSafe = false;
        }
    }

    // Check 4: Fuzzy matching for misspellings (Levenshtein distance < 3)
    for (const trustedDomain of TRUSTED_DOMAINS) {
        const distance = levenshteinDistance(domain, trustedDomain);
        if (distance > 0 && distance <= 2) {
            warnings.push(`⚠️ Domain "${domain}" is very similar to "${trustedDomain}". Double-check before entering credentials.`);
            isSafe = false;
        }
    }

    // Check 5: Suspicious patterns (numbers replacing letters)
    if (/[0-9]/.test(domain) && domain.length > 10) {
        warnings.push('⚠️ Domain contains numbers. Verify this is the correct site.');
        isSafe = false;
    }

    return { isSafe, warnings, domain };
}

function extractPageData(): PageData {
    const url = window.location.href;
    const rawText: string = document.body.innerText || "";
    const textContent: string = rawText.trim().substring(0, 5000);
    
    return {
        url: url,
        textContent: textContent
    };
}

// Listen for messages from the popup script
// chrome.runtime.onMessage is Chrome's messaging system.
// When the popup sends a message, this listener receives it

//listener receives:
//message = data sent by popup
//sender = info about who sent message
//sendResponse = function to send a reply back to the popup

chrome.runtime.onMessage.addListener(
   (
     message: { action: string },
     sender: chrome.runtime.MessageSender,
     sendResponse: (response:PageData) => void
   ) => {
     if (message.action === "scanPage") {
        const pageData = extractPageData();
        sendResponse(pageData);
     }
     return true;
 } 
);

