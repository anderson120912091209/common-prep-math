# 🏗️ CMS Implementation Strategy - Recommended Approach

## 🎯 **Recommended Architecture: Monorepo + Subdomain**

Based on your requirements and current setup, here's the optimal approach:

### **Repository Organization**
```
common-prep-math/
├── apps/
│   ├── student/          # Your current math/ app (renamed)
│   └── admin/            # New admin CMS
├── packages/
│   ├── shared-ui/        # Shared components
│   ├── database/         # Supabase types & migrations  
│   ├── auth/            # Authentication utilities
│   └── analytics/       # Shared analytics functions
├── docs/
├── package.json         # Workspace root
└── turbo.json          # Turborepo config (optional)
```

### **Deployment Strategy**
```
🌐 Production:
├── student.yourdomain.com  (Vercel/Netlify - Public)
└── admin.yourdomain.com    (Vercel/Netlify - Restricted)

🧪 Staging:
├── student-staging.yourdomain.com
└── admin-staging.yourdomain.com

💻 Development:
├── localhost:3000 (student)
└── localhost:3001 (admin)
```

## 🚀 **Step-by-Step Implementation Plan**

### **Phase 1: Repository Restructure (1-2 days)**

1. **Backup your current work**
```bash
git branch backup-before-restructure
```

2. **Create new structure**
```bash
# In your current repo root
mkdir -p apps/student apps/admin packages/shared-ui packages/database packages/auth
mv math/* apps/student/
```

3. **Set up workspace**
```json
// package.json (root)
{
  "name": "math-platform",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "npm run dev --workspace=apps/student",
    "dev:admin": "npm run dev --workspace=apps/admin",
    "dev:all": "concurrently \"npm run dev\" \"npm run dev:admin\"",
    "build": "npm run build --workspace=apps/student",
    "build:admin": "npm run build --workspace=apps/admin",
    "build:all": "npm run build --workspace=apps/student && npm run build --workspace=apps/admin"
  },
  "devDependencies": {
    "concurrently": "^8.2.0"
  }
}
```

### **Phase 2: Create Shared Packages (2-3 days)**

4. **Database package**
```typescript
// packages/database/package.json
{
  "name": "@math-platform/database",
  "version": "1.0.0",
  "main": "index.ts",
  "dependencies": {
    "@supabase/supabase-js": "^2.38.0"
  }
}

// packages/database/index.ts
export * from './types';
export * from './client';
export * from './queries';

// packages/database/types.ts
// Move your admin-types.ts here

// packages/database/client.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// packages/database/queries/problems.ts
export const getProblemsByProgram = async (programId: string) => {
  // Shared query functions
};
```

5. **Shared UI package**
```typescript
// packages/shared-ui/package.json
{
  "name": "@math-platform/ui",
  "version": "1.0.0",
  "main": "index.ts",
  "dependencies": {
    "react": "^18.2.0",
    "tailwindcss": "^3.3.0"
  }
}

// packages/shared-ui/components/Button.tsx
// Shared components used by both apps

// packages/shared-ui/index.ts
export { Button } from './components/Button';
export { Card } from './components/Card';
export { LoadingSpinner } from './components/LoadingSpinner';
```

### **Phase 3: Create Admin CMS App (1-2 weeks)**

6. **Initialize admin app**
```bash
cd apps/admin
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir
```

7. **Admin app structure**
```
apps/admin/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── programs/
│   │   ├── problems/
│   │   ├── analytics/
│   │   ├── students/
│   │   └── layout.tsx      # Admin dashboard layout
│   ├── api/
│   ├── globals.css
│   └── layout.tsx          # Root layout
├── components/
│   ├── ProblemEditor/      # Rich text + LaTeX editor
│   ├── ProgramManager/     # Program CRUD
│   ├── BulkImport/         # CSV upload
│   └── AnalyticsDashboard/ # Performance charts
├── lib/
│   ├── auth.ts            # Admin authentication
│   ├── permissions.ts     # Role-based access
│   └── validation.ts      # Form validation
└── package.json
```

### **Phase 4: Security Implementation (3-5 days)**

8. **Environment-based access control**
```typescript
// apps/admin/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if user has admin role
  const userRole = request.headers.get('x-user-role');
  
  if (!['teacher', 'admin', 'super_admin'].includes(userRole || '')) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|login).*)',
  ],
};
```

9. **Database Row Level Security**
```sql
-- Enable RLS on admin tables
ALTER TABLE math_problems ENABLE ROW LEVEL SECURITY;

-- Admin users can manage content
CREATE POLICY admin_content_access ON math_problems
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.user_id = auth.uid()
      AND up.role IN ('teacher', 'admin', 'content_creator', 'super_admin')
    )
  );
```

## 🔒 **Security Strategy**

### **1. Multi-layered Access Control**
```typescript
// Authentication levels:
// Level 1: Supabase Auth (valid user)
// Level 2: Role Check (teacher/admin role)
// Level 3: Resource Permission (can edit this specific content)
// Level 4: Network Restriction (optional IP whitelist)

const checkAdminAccess = async (userId: string, resource: string) => {
  // Check user role
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('user_id', userId)
    .single();
    
  if (!['teacher', 'admin'].includes(profile?.role)) {
    throw new Error('Insufficient permissions');
  }
  
  // Check resource-specific permissions
  const { data: permission } = await supabase
    .from('content_permissions')
    .select('*')
    .eq('user_id', userId)
    .eq('resource_type', resource)
    .single();
    
  return permission !== null;
};
```

### **2. Environment Separation**
```bash
# Production Environment Variables
# Student App (.env.production)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_MODE=student

# Admin App (.env.production)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_MODE=admin
ADMIN_SECRET_KEY=your-admin-secret
```

### **3. Network Security (Optional)**
```typescript
// IP Whitelist for admin access
const ALLOWED_ADMIN_IPS = [
  '192.168.1.0/24',  // Office network
  '10.0.0.0/8',      // VPN range
];

const checkIPAccess = (ip: string) => {
  return ALLOWED_ADMIN_IPS.some(range => ipInRange(ip, range));
};
```

## 📦 **Deployment Strategy**

### **Option A: Vercel (Recommended for MVP)**
```yaml
# vercel.json (student app)
{
  "builds": [
    { "src": "apps/student/package.json", "use": "@vercel/next" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "apps/student/$1" }
  ]
}

# vercel.json (admin app) 
{
  "builds": [
    { "src": "apps/admin/package.json", "use": "@vercel/next" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "apps/admin/$1" }
  ]
}
```

### **Option B: Docker + Railway/Render**
```dockerfile
# Dockerfile.student
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --workspace=apps/student
EXPOSE 3000
CMD ["npm", "start", "--workspace=apps/student"]

# Dockerfile.admin  
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --workspace=apps/admin
EXPOSE 3001
CMD ["npm", "start", "--workspace=apps/admin"]
```

### **Option C: Self-hosted with Nginx**
```nginx
# nginx.conf
server {
    server_name student.yourdomain.com;
    location / {
        proxy_pass http://localhost:3000;
    }
}

server {
    server_name admin.yourdomain.com;
    
    # Optional: Restrict access by IP
    allow 192.168.1.0/24;
    deny all;
    
    location / {
        proxy_pass http://localhost:3001;
    }
}
```

## 🛠️ **Development Workflow**

### **Daily Development**
```bash
# Start both apps for development
npm run dev:all

# Work on student app only
npm run dev

# Work on admin app only  
npm run dev:admin

# Run tests across all packages
npm run test --workspaces

# Build everything for production
npm run build:all
```

### **Shared Package Development**
```bash
# Make changes to shared package
cd packages/database
# Edit types, add new queries

# Both apps automatically pick up changes
# Hot reload works across workspace boundaries
```

### **Database Migrations**
```bash
# Store migrations in shared package
packages/database/migrations/
├── 001_initial_schema.sql
├── 002_add_admin_features.sql
└── 003_add_analytics.sql

# Apply migrations
npm run migrate --workspace=packages/database
```

## 📊 **Monitoring & Analytics**

### **Separate Analytics Tracking**
```typescript
// Track admin vs student usage separately
const trackEvent = (event: string, properties: any) => {
  const appMode = process.env.NEXT_PUBLIC_APP_MODE;
  
  analytics.track(`${appMode}_${event}`, {
    ...properties,
    app: appMode,
    timestamp: new Date().toISOString()
  });
};
```

### **Performance Monitoring**
```typescript
// Monitor both apps with different dashboards
const adminMetrics = {
  contentCreationTime: 'How long to create a problem',
  bulkImportSuccess: 'Success rate of CSV imports',
  teacherActiveUsers: 'Daily active teachers'
};

const studentMetrics = {
  problemSolveTime: 'Time to solve problems',
  sessionDuration: 'How long students study',
  studentActiveUsers: 'Daily active students'
};
```

## 🎯 **Next Steps**

### **Week 1: Setup**
1. ✅ Restructure repository as monorepo
2. ✅ Set up shared packages
3. ✅ Create basic admin app structure

### **Week 2: Core Admin Features**
1. ✅ Admin authentication & role checking
2. ✅ Basic problem creation interface
3. ✅ Program management

### **Week 3: Advanced Features**
1. ✅ Rich text editor with LaTeX support
2. ✅ Bulk import functionality
3. ✅ Real-time updates between apps

### **Week 4: Polish & Deploy**
1. ✅ Security hardening
2. ✅ Performance optimization
3. ✅ Production deployment

This approach gives you:
- ✅ **Rapid development** - Shared code reduces duplication
- ✅ **Strong security** - Multi-layered protection for admin access
- ✅ **Easy deployment** - Independent scaling of student vs admin
- ✅ **Future-proof** - Easy to add new apps or features

The monorepo approach is used by companies like Google, Facebook, and Uber for exactly these reasons - it provides the benefits of code sharing while maintaining clear application boundaries! 🚀
