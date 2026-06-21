import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient({
  log: ['error'],
});

const DB_FILE = path.join(process.cwd(), 'prisma', 'fallback_db.json');

// Helper to read JSON fallback database
function getFallbackData() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (e) {
    // Ignore error and return default
  }
  const defaultData = { users: [], scans: [], reports: [] };
  saveFallbackData(defaultData);
  return defaultData;
}

// Helper to write JSON fallback database
function saveFallbackData(data: any) {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    // Ignore error
  }
}

// Check database connectivity dynamically with a cache interval
let isDbConnected = false;
let lastCheckTime = 0;
const CHECK_INTERVAL = 15000; // Check database connectivity every 15 seconds

async function checkConnection() {
  const now = Date.now();
  if (now - lastCheckTime < CHECK_INTERVAL) {
    return isDbConnected;
  }
  
  // Set lastCheckTime immediately to throttle concurrent checks
  lastCheckTime = now;
  
  try {
    // Execute a simple query to verify connection
    const connPromise = prisma.$queryRaw`SELECT 1`;
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 1500));
    await Promise.race([connPromise, timeoutPromise]);
    
    if (!isDbConnected) {
      console.log('✅ Connected to PostgreSQL Database.');
    }
    isDbConnected = true;
    return true;
  } catch (error) {
    if (isDbConnected) {
      console.warn('⚠️ PostgreSQL database connection lost. Falling back to persistent JSON database.');
    }
    isDbConnected = false;
    return false;
  }
}

export const db = {
  user: {
    async findUnique(args: any) {
      if (await checkConnection()) {
        try {
          return await prisma.user.findUnique(args);
        } catch (e) {
          // Fall through
        }
      }
      const { email, id } = args.where;
      const data = getFallbackData();
      if (email) {
        return data.users.find((u: any) => u.email === email) || null;
      }
      if (id) {
        return data.users.find((u: any) => u.id === id) || null;
      }
      return null;
    },
    async findFirst(args: any) {
      if (await checkConnection()) {
        try {
          return await prisma.user.findFirst(args);
        } catch (e) {
          // Fall through
        }
      }
      const { email, id } = args.where;
      const data = getFallbackData();
      if (email) {
        return data.users.find((u: any) => u.email === email) || null;
      }
      if (id) {
        return data.users.find((u: any) => u.id === id) || null;
      }
      return null;
    },
    async create(args: any) {
      if (await checkConnection()) {
        try {
          return await prisma.user.create(args);
        } catch (e) {
          // Fall through
        }
      }
      const newUser = {
        id: 'user_' + Math.random().toString(36).substring(2, 9),
        createdAt: new Date().toISOString(),
        ...args.data,
      };
      const data = getFallbackData();
      data.users.push(newUser);
      saveFallbackData(data);
      return newUser;
    },
  },
  scan: {
    async create(args: any) {
      if (await checkConnection()) {
        try {
          return await prisma.scan.create(args);
        } catch (e) {
          // Fall through
        }
      }
      const scanId = 'scan_' + Math.random().toString(36).substring(2, 9);
      
      let reportData: any = null;
      const { report, ...scanFields } = args.data;
      const data = getFallbackData();

      if (report && report.create) {
        reportData = {
          id: 'rep_' + Math.random().toString(36).substring(2, 9),
          scanId,
          ...report.create,
        };
        data.reports.push(reportData);
      }

      const newScan = {
        id: scanId,
        uploadDate: new Date().toISOString(),
        ...scanFields,
        report: reportData,
      };
      data.scans.push(newScan);
      saveFallbackData(data);
      return newScan;
    },
    async findUnique(args: any) {
      if (await checkConnection()) {
        try {
          return await prisma.scan.findUnique(args);
        } catch (e) {
          // Fall through
        }
      }
      const id = args.where.id;
      const data = getFallbackData();
      const scan = data.scans.find((s: any) => s.id === id);
      if (scan && args.include?.report) {
        // Hydrate report
        const rep = data.reports.find((r: any) => r.scanId === id);
        return {
          ...scan,
          report: rep || null,
        };
      }
      return scan || null;
    },
    async count(args: any) {
      if (await checkConnection()) {
        try {
          return await prisma.scan.count(args);
        } catch (e) {
          // Fall through
        }
      }
      const userId = args.where?.userId;
      const data = getFallbackData();
      let list = data.scans;
      if (userId) {
        list = list.filter((s: any) => s.userId === userId);
      }
      return list.length;
    },
    async findMany(args: any) {
      if (await checkConnection()) {
        try {
          return await prisma.scan.findMany(args);
        } catch (e) {
          // Fall through
        }
      }
      const userId = args.where?.userId;
      const data = getFallbackData();
      let list = [...data.scans];
      if (userId) {
        list = list.filter((s: any) => s.userId === userId);
      }

      // Apply Search Filter
      const search = args.where?.apkName?.contains;
      if (search) {
        list = list.filter((s: any) =>
          s.apkName.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Apply Risk Level Filter
      const risk = args.where?.riskLevel;
      if (risk) {
        list = list.filter((s: any) => s.riskLevel === risk);
      }

      // Apply sorting (newest first)
      list.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());

      // Apply Pagination
      const skip = args.skip || 0;
      const take = args.take || 10;
      let sliced = list.slice(skip, skip + take);

      // Hydrate nested reports if requested
      if (args.include?.report) {
        sliced = sliced.map((s: any) => {
          const rep = data.reports.find((r: any) => r.scanId === s.id);
          return {
            ...s,
            report: rep || null,
          };
        });
      }

      return sliced;
    },
  },
};
