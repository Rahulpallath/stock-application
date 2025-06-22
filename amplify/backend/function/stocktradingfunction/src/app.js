/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_STOCKTRADINGDB_ARN
	STORAGE_STOCKTRADINGDB_NAME
	STORAGE_STOCKTRADINGDB_STREAMARN
Amplify Params - DO NOT EDIT */

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  UpdateCommand,
  DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

// ✅ FIXED: Use the correct environment variable name
const tableName = process.env.STORAGE_STOCKTRADINGDB_NAME;

exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  // ✅ Check if table name exists
  if (!tableName) {
    console.error('❌ TABLE NAME NOT SET:', process.env);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
        "Access-Control-Allow-Headers": "*"
      },
      body: JSON.stringify({ 
        error: "Database configuration error",
        debug: {
          tableName,
          envVars: Object.keys(process.env).filter(key => key.includes('STORAGE'))
        }
      }),
    };
  }

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
    "Access-Control-Allow-Headers": "*"
  };

  // Preflight CORS support
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "CORS check OK" }),
    };
  }

  try {
    // Get user ID from different sources
    let userId;
    
    // Try to get from Cognito claims first
    if (event.requestContext?.authorizer?.claims) {
      userId = event.requestContext.authorizer.claims.sub || 
               event.requestContext.authorizer.claims.email ||
               event.requestContext.authorizer.claims.username;
    }
    
    // If not in claims, try from request body
    if (!userId && event.body) {
      const body = JSON.parse(event.body);
      userId = body.userId;
    }
    
    // If still no userId, try from path parameters
    if (!userId && event.pathParameters) {
      userId = event.pathParameters.userId;
    }
    
    // Default fallback
    if (!userId) {
      userId = "anonymous_user";
    }

    console.log("User ID:", userId);

    switch (event.httpMethod) {
      case "POST":
        return await handlePost(event, userId);
      case "GET":
        return await handleGet(event, userId);
      case "PUT":
        return await handlePut(event, userId);
      case "DELETE":
        return await handleDelete(event, userId);
      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: "Method not allowed" }),
        };
    }
  } catch (error) {
    console.error("Handler error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: "Internal server error",
        message: error.message 
      }),
    };
  }
};

async function handlePost(event, userId) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
    "Access-Control-Allow-Headers": "*"
  };

  try {
    const body = JSON.parse(event.body);
    const { dataType, data, updatedAt } = body;

    if (!dataType) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Missing required field: dataType" }),
      };
    }

    const params = new PutCommand({
      TableName: tableName,
      Item: {
        userId,
        dataType,
        data,
        updatedAt: updatedAt || new Date().toISOString(),
        ttl: Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60) // 1 year TTL
      },
    });

    console.log("DynamoDB PUT params:", JSON.stringify(params, null, 2));
    await docClient.send(params);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        message: "Data saved successfully",
        userId,
        dataType
      }),
    };
  } catch (error) {
    console.error("POST error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
}

async function handleGet(event, userId) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
    "Access-Control-Allow-Headers": "*"
  };

  try {
    const { dataType } = event.queryStringParameters || {};

    if (dataType) {
      // Get specific item
      const params = new GetCommand({
        TableName: tableName,
        Key: {
          userId,
          dataType,
        },
      });

      const result = await docClient.send(params);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(result.Item || {}),
      };
    } else {
      // Get all items for user
      const params = new QueryCommand({
        TableName: tableName,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      });

      const result = await docClient.send(params);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(result.Items || []),
      };
    }
  } catch (error) {
    console.error("GET error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
}

async function handlePut(event, userId) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
    "Access-Control-Allow-Headers": "*"
  };

  try {
    const body = JSON.parse(event.body);
    const { dataType, data, updatedAt } = body;

    if (!dataType) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Missing required field: dataType" }),
      };
    }

    const params = new UpdateCommand({
      TableName: tableName,
      Key: {
        userId,
        dataType
      },
      UpdateExpression: 'SET #data = :data, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#data': 'data'
      },
      ExpressionAttributeValues: {
        ':data': data,
        ':updatedAt': updatedAt || new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    });

    const result = await docClient.send(params);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result.Attributes),
    };
  } catch (error) {
    console.error("PUT error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
}

async function handleDelete(event, userId) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
    "Access-Control-Allow-Headers": "*"
  };

  try {
    const { dataType } = event.queryStringParameters || {};

    if (!dataType) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Missing required parameter: dataType" }),
      };
    }

    const params = new DeleteCommand({
      TableName: tableName,
      Key: {
        userId,
        dataType
      }
    });

    await docClient.send(params);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "Data deleted successfully" }),
    };
  } catch (error) {
    console.error("DELETE error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
}