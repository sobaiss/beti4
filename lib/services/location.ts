import { City } from "@/types/location";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

let client: DynamoDBClient | undefined;

if (!client) {
    const region = process.env.AWS_REGION || 'eu-north-1';
    const accessKeyId = process.env.AWS_ACCESS_KEY;
    const secretAccessKey = process.env.AWS_SECRET_KEY;
    if (!accessKeyId || !secretAccessKey) {
        throw new Error('AWS credentials are not set in environment variables');
    }

    const params = {
        region,
        credentials: {
            accessKeyId,
            secretAccessKey,
        }
    };

    // console.log('Initializing DynamoDB client with params:', params);
    client = new DynamoDBClient(params);
}

const docClient = DynamoDBDocumentClient.from(client);

export async function getCities() {
  const command = new QueryCommand({
    TableName: 'location-dev',
    ConsistentRead: true,
    KeyConditionExpression: "#pk = :pk",
    ExpressionAttributeNames: {
      "#pk": "pk",
      "#name": "name"
    },
    ExpressionAttributeValues: {
      ":pk":  "commune",
    },
    ProjectionExpression: "pk, sk, #name, zip",
  });

  const response = await docClient.send(command);

  return response.Items as City[] || [];
};

export async function getCitiesAndNeighborhood(): Promise<City[]> {
  const command = new ScanCommand({
    TableName: 'location-dev',
    ConsistentRead: true,
    ExpressionAttributeNames: {
      "#name": "name"
    },
    ProjectionExpression: "pk, sk, #name, zip",
  });

  const response = await docClient.send(command);

  return response.Items as City[] || [];
}