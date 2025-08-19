import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const notionToken = process.env.NOTION_TOKEN;
    const notionDatabaseId = process.env.NOTION_DATABASE_ID;

    const config = {
      hasToken: !!notionToken,
      hasDatabaseId: !!notionDatabaseId,
      tokenLength: notionToken?.length || 0,
      databaseIdLength: notionDatabaseId?.length || 0,
      tokenPreview: notionToken ? `${notionToken.substring(0, 10)}...` : "Not set",
      databaseIdPreview: notionDatabaseId ? `${notionDatabaseId.substring(0, 10)}...` : "Not set"
    };

    console.log("Notion configuration check:", config);

    if (!notionToken || !notionDatabaseId) {
      return NextResponse.json({
        status: "error",
        message: "Missing environment variables",
        config
      }, { status: 500 });
    }

    // Test the Notion API connection
    try {
      const response = await fetch(`https://api.notion.com/v1/databases/${notionDatabaseId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${notionToken}`,
          "Notion-Version": "2022-06-28",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return NextResponse.json({
          status: "error",
          message: "Failed to connect to Notion API",
          config,
          error: errorData
        }, { status: response.status });
      }

      const databaseInfo = await response.json();
      
      return NextResponse.json({
        status: "success",
        message: "Notion configuration is working",
        config,
        database: {
          id: databaseInfo.id,
          title: databaseInfo.title?.[0]?.plain_text || "Untitled",
          properties: Object.keys(databaseInfo.properties || {})
        }
      });

    } catch (apiError) {
      return NextResponse.json({
        status: "error",
        message: "Failed to test Notion API connection",
        config,
        error: apiError instanceof Error ? apiError.message : "Unknown error"
      }, { status: 500 });
    }

  } catch (error) {
    return NextResponse.json({
      status: "error",
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
