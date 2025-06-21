const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);
const tableName = process.env.STORAGE_STOCKTRADINGDB_NAME;

exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event));

  // Extract user ID from Cognito identity or fallback
  const userId =
    event.requestContext?.authorizer?.claims?.email || "anonymous_user";

  if (event.httpMethod === "POST") {
    try {
      const { dataType, data } = JSON.parse(event.body);

      const params = new PutCommand({
        TableName: tableName,
        Item: {
          userId,
          dataType,
          data,
        },
      });

      await docClient.send(params);

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Data saved successfully." }),
      };
    } catch (error) {
      console.error("POST error:", error);
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: error.message }),
      };
    }
  }

  if (event.httpMethod === "GET") {
    try {
      const { dataType } = event.queryStringParameters;

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.Item ? result.Item.data : null),
      };
    } catch (error) {
      console.error("GET error:", error);
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: error.message }),
      };
    }
  }

  return {
    statusCode: 400,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ error: "Unsupported HTTP method" }),
  };
};
