import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { VENTURE_POLICIES, PLANS, SupportTicket } from './src/data/ventureData.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

export const OFFICIAL_ESCALATION_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSfG5JMuC4wqn_BiSjp48mKrOmB3TKmckKeM6r0wYXzMCUbPcQ/viewform?usp=header';

// Initialize Google Gen AI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// In-memory support tickets store
const tickets: SupportTicket[] = [
  {
    id: 'VIT-TKT-1082',
    customerName: 'Demo Client',
    customerEmail: 'client@example.com',
    customerMobile: '9876543210',
    planId: 'gold',
    category: 'Website Configuration',
    priority: 'Normal',
    level: 'Level 1',
    subject: 'Second website domain mapping query',
    description: 'Assisting client with setting up DNS records for their 2nd gold plan website.',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    status: 'Resolved',
  },
];

// Return policies
app.get('/api/policies', (_req, res) => {
  res.json({ policies: VENTURE_POLICIES, plans: PLANS, escalationFormUrl: OFFICIAL_ESCALATION_FORM_URL });
});

// Create support/escalation ticket
app.post('/api/ticket/create', (req, res) => {
  try {
    const { customerName, customerEmail, customerMobile, planId, category, priority, level, subject, description } = req.body;
    
    if (!customerEmail || !customerMobile || !subject) {
      return res.status(400).json({ error: 'Missing required fields for ticket creation.' });
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newTicket: SupportTicket = {
      id: `VIT-ESC-${randomSuffix}`,
      customerName: customerName || 'Valued Client',
      customerEmail,
      customerMobile,
      planId: planId || 'silver',
      category: category || 'General Support',
      priority: priority || 'Normal',
      level: level || 'Level 1',
      subject,
      description: description || 'No additional description provided.',
      createdAt: new Date().toISOString(),
      status: 'Open',
    };

    tickets.unshift(newTicket);
    res.json({ success: true, ticket: newTicket, formUrl: OFFICIAL_ESCALATION_FORM_URL });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create support ticket' });
  }
});

// Get customer tickets
app.get('/api/ticket/list', (req, res) => {
  const email = req.query.email as string;
  const mobile = req.query.mobile as string;
  if (!email && !mobile) {
    return res.json({ tickets });
  }
  const filtered = tickets.filter(
    (t) => (email && t.customerEmail.toLowerCase() === email.toLowerCase()) || (mobile && t.customerMobile === mobile)
  );
  res.json({ tickets: filtered });
});

// Chat endpoint with Sweet, Conversational, De-escalating & Understanding Persona
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, customer } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    const clientName = customer?.name || 'ji';

    const systemInstruction = `You are "Isha", a friendly, sweet, and caring customer relations executive at **Venture Infotech Solution** (ventureinfotech.in).

CRITICAL STYLE RULE: KEEP REPLIES SHORT, SWEET & CONVERSATIONAL!
- Maximum 3 to 4 short sentences (around 40-70 words total).
- Never send long essays, long lists, or bulky text walls!
- Talk like a smart, warm human on WhatsApp or chat.

3-STEP FLOW IN EVERY SHORT MESSAGE:
1. **De-escalate & Chill (1 sentence)**:
   - "Arey ${clientName}, pehle aap bilkul chill ho jaiye, main aapke sath hoon!"
2. **Short Sweet Explanation (1-2 sentences)**:
   - Defend Venture sweetly: e.g. "Algorithm ko best buyers dhoondhne me 48 hours lagte hain. 48 hours ke baad bhi slow raha toh hum backup winning products add kar denge."
3. **Pucho Sawal to Understand (1 friendly question)**:
   - Always ask 1 simple question to understand their exact stage:
     * "Abhi ad run huye kitne ghante hue hain?"
     * "Dashboard me clicks kitne dikh rahe hain?"
     * "Kya checkout page par visitors drop ho rahe hain?"

When client replies with their data (e.g. "40 clicks aaye"), acknowledge it in 1 short sentence, give 1 quick tip, and ask the next simple question. Keep it short, caring, and crisp!`;

    // Local context fallback engine - Short, sweet, conversational
    const generateSweetDeescalationResponse = (lastUserQuery: string) => {
      const q = lastUserQuery.toLowerCase();

      // Police / Case / Court / Viral threat
      if (
        q.includes('case') ||
        q.includes('police') ||
        q.includes('fir') ||
        q.includes('court') ||
        q.includes('consumer') ||
        q.includes('viral') ||
        q.includes('social media') ||
        q.includes('defam') ||
        q.includes('dhamki')
      ) {
        return `Arey ${clientName}, pehle relax ho jaiye! Police ya case ki koi zaroorat nahi hai, hum aapse ladne nahi aapka store grow karne baithe hain. Main khud aapka issue solve karwati hoon. Mujhe bas batayein—abhi ad run huye kitne ghante hue hain aur kitne clicks aaye hain?`;
      }

      // Abusive language
      if (
        q.includes('bc') ||
        q.includes('mc') ||
        q.includes('gandu') ||
        q.includes('chutiya') ||
        q.includes('kutta') ||
        q.includes('saale') ||
        q.includes('bakwas')
      ) {
        return `${clientName}, main aapka gussa samajh sakti hoon, par please shanti se baat kijiye taaki hum solution nikal sakein. Main aapki madad karne hi baithi hoon. Batayein, exact kya problem aa rahi hai?`;
      }

      // Sales expectations / Jhoot / Thousands promise
      if (
        q.includes('sales executive') ||
        q.includes('thousands') ||
        q.includes('jhoot') ||
        q.includes('fraud') ||
        q.includes('dhoka') ||
        q.includes('chor') ||
        q.includes('promise') ||
        q.includes('zero sales') ||
        q.includes('sales nahi') ||
        q.includes('order nahi')
      ) {
        return `Arey ${clientName}, pehle bilkul chill ho jaiye! Sales team ne hamare top active stores ke benchmarks bataye the, koi jhoot nahi tha. Naye store ke algorithm ko buyers dhoondhne me 48 hours lagte hain, aur slow raha toh hum winning products import kar denge. Mujhe bas batayein—abhi ad start huye kitne ghante hue hain?`;
      }

      // Ad band / OFF kar do
      if (q.includes('off') || q.includes('band') || q.includes('stop') || q.includes('pause') || q.includes('hata do')) {
        return `${clientName}, ad ko beech me band karne se algorithm reset ho jayega aur paise waste honge. Isko 48 hours chalne dein, uske baad hum winning product laga denge. Abhi kitna time hua hai ad chalu huye?`;
      }

      // Refund enquiry
      if (q.includes('refund') || q.includes('paise wapas') || q.includes('cancel')) {
        return `Arey ${clientName}, pehle relax kijiye! Setup handover ke baad digital services non-refundable hoti hain, par hum Backup Plan ke tehat winning products add karke sales nikalwayenge. Aap batayein, dashboard me clicks kitne dikh rahe hain abhi?`;
      }

      // Number offline enquiry
      if (q.includes('offline') || q.includes('phone') || q.includes('call') || q.includes('number')) {
        return `Ji ${clientName}, quality aur call recording ke liye hum Dedicated IVR use karte hain, isiliye personal offline numbers blocked rehte hain. Main Isha yahan live hoon! Batayein, aapko kya help chahiye?`;
      }

      // General fallback
      return `Hello ${clientName}! Main Isha hoon. Aap bilkul chill hoke apna concern batayein, main yahan poori help karungi. Abhi aapke store ya ad me kya issue aa raha hai?`;
    };

    // Prepare contents for GenAI
    const contents = messages.map((m: any) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content || '' }],
    }));

    const lastMessage = messages[messages.length - 1]?.content || '';

    let reply = '';
    const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];

    for (const modelCandidate of modelsToTry) {
      try {
        const timeoutPromise = new Promise<null>((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 18000)
        );
        const callPromise = ai.models.generateContent({
          model: modelCandidate,
          contents,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });
        const response: any = await Promise.race([callPromise, timeoutPromise]);
        if (response?.text) {
          reply = response.text;
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${modelCandidate} failed/timed out:`, err?.message || err);
      }
    }

    if (!reply) {
      reply = generateSweetDeescalationResponse(lastMessage);
    }

    res.json({ reply, escalationFormUrl: OFFICIAL_ESCALATION_FORM_URL });
  } catch (err: any) {
    console.error('Chat error:', err);
    res.status(500).json({
      error: 'Chat processing failed',
      details: err.message || 'Unknown error',
    });
  }
});

// Start Server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Venture Infotech Solution Support 24 listening on port ${PORT}`);
  });
}

startServer();
