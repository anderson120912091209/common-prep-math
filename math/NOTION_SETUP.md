# Notion CMS Setup Guide

## Environment Variables

Add these to your `.env.local` file:

```env
NOTION_TOKEN=your_notion_integration_token_here
NOTION_DATABASE_ID=your_notion_database_id_here
```

## Notion Database Setup

1. **Create a Notion Integration**:
   - Go to https://www.notion.so/my-integrations
   - Click "New integration"
   - Give it a name (e.g., "Mathy Waitlist")
   - Select the workspace where your database will be
   - Copy the "Internal Integration Token"

2. **Create a Database**:
   - Create a new page in Notion
   - Add a database with these properties:
     - **Name** (Title) - for the person's name
     - **Email** (Email) - for the email address
     - **Date** (Date) - for when they joined
     - **Status** (Select) - with options like "New", "Contacted", "Converted"

3. **Share the Database**:
   - Open your database
   - Click "Share" in the top right
   - Click "Invite" and add your integration
   - Copy the database ID from the URL (the part after the last slash)

## API Endpoints

The system includes two API endpoints:

### `/api/mail` (POST)
- Currently simulates email sending
- You can integrate with SendGrid, Resend, or other email services
- Validates email format and required fields

### `/api/notion` (POST)
- Creates a new page in your Notion database
- Requires `name` and `email` in the request body
- Automatically adds timestamp and status

## Usage

The form component automatically:
1. Validates user input
2. Sends email (simulated)
3. Creates Notion database entry
4. Shows success/error messages
5. Handles rate limiting and errors

## Testing

You can test the API endpoints directly:

```bash
# Test mail endpoint
curl -X POST http://localhost:3000/api/mail \
  -H "Content-Type: application/json" \
  -d '{"firstname":"Test","email":"test@example.com"}'

# Test Notion endpoint
curl -X POST http://localhost:3000/api/notion \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com"}'
```
