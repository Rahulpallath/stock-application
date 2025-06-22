const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

// ✅ FIXED: Use the correct environment variable name
const tableName = process.env.STORAGE_STOCKTRADINGDB_NAME;

exports.handler = async (event) => {
    console.log('📥 Event received:', JSON.stringify(event, null, 2));
    
    // Debug environment variables
    console.log('🔧 Environment variables check:');
    console.log('STORAGE_STOCKTRADINGDB_NAME:', process.env.STORAGE_STOCKTRADINGDB_NAME);
    console.log('STORAGE_STOCKTRADINGDB_ARN:', process.env.STORAGE_STOCKTRADINGDB_ARN);
    console.log('All STORAGE vars:', Object.keys(process.env).filter(k => k.includes('STORAGE')));
    
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE"
    };
    
    // Handle OPTIONS request for CORS
    if (event.httpMethod === 'OPTIONS') {
        console.log('✅ CORS preflight request handled');
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'CORS OK' })
        };
    }
    
    // ✅ Check if table name exists
    if (!tableName) {
        console.error('❌ TABLE NAME IS NULL OR UNDEFINED');
        console.error('Available env vars:', Object.keys(process.env));
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Database configuration error - table name not found',
                debug: {
                    expectedVar: 'STORAGE_STOCKTRADINGDB_NAME',
                    availableStorageVars: Object.keys(process.env).filter(k => k.includes('STORAGE')),
                    allEnvVars: Object.keys(process.env)
                }
            })
        };
    }
    
    console.log(`✅ Using table name: ${tableName}`);
    
    try {
        // Get user ID from multiple sources
        let userId = 'anonymous_user';
        
        // Try Cognito identity first
        if (event.requestContext?.identity?.cognitoIdentityId) {
            userId = event.requestContext.identity.cognitoIdentityId;
            console.log('👤 User ID from Cognito Identity:', userId);
        }
        // Try from request body
        else if (event.body) {
            try {
                const body = JSON.parse(event.body);
                if (body.userId) {
                    userId = body.userId;
                    console.log('👤 User ID from request body:', userId);
                }
            } catch (e) {
                console.log('⚠️ Could not parse body for userId');
            }
        }
        
        console.log(`👤 Final userId: ${userId}`);
        
        // Parse the path to get userId and dataType for GET requests
        const pathParts = event.path.split('/').filter(p => p);
        
        if (event.httpMethod === 'GET') {
            console.log('📖 Processing GET request');
            
            // Handle different GET patterns
            let targetUserId = userId;
            let dataType = null;
            
            if (event.queryStringParameters?.dataType) {
                dataType = event.queryStringParameters.dataType;
            } else if (pathParts.length >= 3) {
                // Pattern: /portfolio/{userId}/{dataType}
                targetUserId = pathParts[1];
                dataType = pathParts[2];
            }
            
            if (!dataType) {
                console.error('❌ Missing dataType in GET request');
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Missing dataType parameter' })
                };
            }
            
            const params = {
                TableName: tableName,
                Key: {
                    userId: targetUserId,
                    dataType: dataType
                }
            };
            
            console.log('🔄 DynamoDB GET params:', JSON.stringify(params, null, 2));
            const result = await dynamodb.get(params).promise();
            console.log('✅ GET result:', JSON.stringify(result, null, 2));
            
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(result.Item || {})
            };
            
        } else if (event.httpMethod === 'POST') {
            console.log('📝 Processing POST request');
            
            const body = JSON.parse(event.body);
            console.log('📄 Request body:', JSON.stringify(body, null, 2));
            
            if (!body.dataType) {
                console.error('❌ Missing dataType in POST request');
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Missing required field: dataType' })
                };
            }
            
            // Use userId from body if provided, otherwise use detected userId
            const finalUserId = body.userId || userId;
            
            const params = {
                TableName: tableName,
                Item: {
                    userId: finalUserId,
                    dataType: body.dataType,
                    data: body.data,
                    updatedAt: body.updatedAt || new Date().toISOString(),
                    ttl: Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60) // 1 year TTL
                }
            };
            
            console.log('💾 DynamoDB PUT params:', JSON.stringify(params, null, 2));
            await dynamodb.put(params).promise();
            console.log('✅ Data saved successfully');
            
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ 
                    message: 'Data saved successfully',
                    userId: finalUserId,
                    dataType: body.dataType
                })
            };
        }
        
        console.log('❌ Unsupported HTTP method:', event.httpMethod);
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
        
    } catch (error) {
        console.error('💥 Lambda error:', error);
        console.error('📍 Error stack:', error.stack);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Internal server error',
                message: error.message,
                tableName: tableName
            })
        };
    }
};