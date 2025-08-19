import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json();

    // Validate input
    if (!name || !email) {
      console.error("Missing required fields:", { name, email });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get Notion credentials from environment variables
    const notionToken = process.env.NOTION_TOKEN;
    const notionDatabaseId = process.env.NOTION_DATABASE_ID;

    console.log("Environment check:", {
      hasToken: !!notionToken,
      hasDatabaseId: !!notionDatabaseId,
      tokenLength: notionToken?.length,
      databaseIdLength: notionDatabaseId?.length
    });

    if (!notionToken || !notionDatabaseId) {
      console.error("Missing Notion environment variables");
      console.error("NOTION_TOKEN:", notionToken ? "Set" : "Missing");
      console.error("NOTION_DATABASE_ID:", notionDatabaseId ? "Set" : "Missing");
      
      // For development/testing, simulate success if Notion is not configured
      console.log("Notion not configured - simulating success for development");
      return NextResponse.json(
        { 
          message: "Successfully added to Notion (simulated - Notion not configured)",
          pageId: "simulated-page-id",
          simulated: true
        },
        { status: 200 }
      );
    }

    // Create the page in Notion database
    const requestBody = {
      parent: {
        database_id: notionDatabaseId,
      },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: name,
              },
            },
          ],
        },
        Email: {
          email: email,
        },
        Date: {
          date: {
            start: new Date().toISOString(),
          },
        },
        Status: {
          select: {
            name: "New",
          },
        },
      },
    };

    console.log("Making Notion API request with body:", JSON.stringify(requestBody, null, 2));

    const response = await fetch(`https://api.notion.com/v1/pages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${notionToken}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    console.log("Notion API response status:", response.status);
    console.log("Notion API response headers:", Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = await response.text();
      }
      console.error("Notion API error response:", errorData);
      return NextResponse.json(
        { 
          error: "Failed to create Notion page",
          details: errorData,
          status: response.status
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Successfully created Notion page:", data.id);

    return NextResponse.json(
      { message: "Successfully added to Notion", pageId: data.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Notion API error:", error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
