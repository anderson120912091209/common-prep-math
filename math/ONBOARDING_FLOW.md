# Onboarding Flow Documentation

## Overview

The new waitlist system includes a comprehensive onboarding flow that collects detailed user information after OAuth authentication. This replaces the simple email collection with a multi-step questionnaire.

## Flow Architecture

### 1. Initial Signup
- User visits `/waitlist`
- User clicks OAuth provider (Google/GitHub/Facebook) or uses email signup
- OAuth users are redirected to `/waitlist/onboarding`
- Email users complete basic signup and are added to waitlist

### 2. Onboarding Process (OAuth Users Only)
- User completes 4-step questionnaire:
  1. **Math Interests**: Multi-select from 10 math fields
  2. **Current Level**: Single select from 4 levels
  3. **Study Time**: Single select from 5 time commitments
  4. **Learning Goals**: Free text input
- Progress bar shows completion status
- Data is saved to database upon completion

### 3. Success Page
- Shows personalized success message with user's preferences
- Displays collected onboarding data
- Provides navigation back to home

## Database Schema

### New Fields Added to `waitlist` Table

```sql
math_interests TEXT[]           -- Array of selected math fields
current_level TEXT              -- User's current math level
study_time TEXT                 -- Preferred study time commitment
learning_goals TEXT             -- User's learning objectives
onboarding_completed BOOLEAN    -- Whether onboarding was completed
```

### Field Values

#### Math Interests
- `algebra` - 代數
- `geometry` - 幾何
- `calculus` - 微積分
- `statistics` - 統計學
- `linear_algebra` - 線性代數
- `trigonometry` - 三角函數
- `probability` - 機率論
- `number_theory` - 數論
- `competition_math` - 競賽數學
- `applied_math` - 應用數學

#### Current Levels
- `beginner` - 初學者
- `intermediate` - 中等程度
- `advanced` - 進階程度
- `expert` - 專家級

#### Study Times
- `30min` - 30分鐘/天
- `1hour` - 1小時/天
- `2hours` - 2小時/天
- `3plus` - 3小時以上/天
- `weekend` - 週末集中學習

## File Structure

```
math/app/waitlist/
├── page.tsx                    # Main waitlist page
├── onboarding/
│   └── page.tsx               # Onboarding questionnaire
└── success/
    └── page.tsx               # Success page

math/app/components/waitlist-ui/
├── waitlist-form.tsx          # OAuth and email signup form
├── form.tsx                   # Legacy email-only form
└── success.tsx                # Success component

math/lib/
└── supabase.ts               # Updated TypeScript interfaces

database_migration.sql         # Database schema updates
```

## Implementation Details

### OAuth Redirect Flow
1. User clicks OAuth button in `waitlist-form.tsx`
2. Redirects to OAuth provider
3. Returns to `/waitlist/onboarding`
4. Onboarding page checks authentication and completion status
5. If not completed, shows questionnaire
6. If completed, redirects to success page

### Data Validation
- Each step validates required fields before allowing progression
- Math interests: At least one selection required
- Current level: Single selection required
- Study time: Single selection required
- Learning goals: Non-empty text required

### Error Handling
- Authentication errors redirect to main waitlist page
- Database errors show user-friendly messages
- Duplicate entries are handled gracefully
- Network errors provide retry options

## Usage Examples

### Querying Users by Math Interest
```sql
SELECT * FROM waitlist 
WHERE 'calculus' = ANY(math_interests) 
AND onboarding_completed = true;
```

### Finding Users by Level
```sql
SELECT * FROM waitlist 
WHERE current_level = 'intermediate' 
AND onboarding_completed = true;
```

### Getting Study Time Distribution
```sql
SELECT study_time, COUNT(*) 
FROM waitlist 
WHERE onboarding_completed = true 
GROUP BY study_time;
```

## Future Enhancements

1. **A/B Testing**: Different question sets for different user segments
2. **Progressive Profiling**: Collect additional data over time
3. **Personalization**: Use collected data to customize user experience
4. **Analytics**: Track completion rates and user preferences
5. **Email Segmentation**: Use onboarding data for targeted email campaigns

## Migration Notes

- Existing users without onboarding data are marked as `onboarding_completed = true`
- New OAuth users must complete onboarding before accessing success page
- Email signup users bypass onboarding (legacy behavior maintained)
- Database indexes are created for optimal query performance
