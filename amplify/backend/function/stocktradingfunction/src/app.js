const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.STORAGE_STOCKTRADINGDB_NAME;

exports.handler = async (event) => {
  const userId = event.requestContext.authorizer.claims.email;

  if (event.httpMethod === "POST") {
    const { dataType, data } = JSON.parse(event.body);

    const params = {
      TableName: tableName,
      Item: {
        userId,
        dataType,
        data,
      },
    };

    try {
      await docClient.put(params).promise();
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Saved successfully" }),
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: err.message }),
      };
    }
  }

  if (event.httpMethod === "GET") {
    const { dataType } = event.queryStringParameters;

    const params = {
      TableName: tableName,
      Key: {
        userId,
        dataType,
      },
    };

    try {
      const result = await docClient.get(params).promise();
      return {
        statusCode: 200,
        body: JSON.stringify(result.Item ? result.Item.data : null),
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: err.message }),
      };
    }
  }

  return {
    statusCode: 400,
    body: JSON.stringify({ error: "Unsupported method" }),
  };
};
