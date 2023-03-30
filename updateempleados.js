"use strict";
const AWS = require("aws-sdk");

let dynamoDBClientParams = {};

if (process.env.IS_OFFLINE) {
  dynamoDBClientParams = {
    region: "localhost",
    endpoint: "http://localhost:8000",
    accessKeyId: "DEFAULT_ACCESS_KEY", // needed if you don't have aws credentials at all in env
    secretAccessKey: "DEFAULT_SECRET", // needed if you don't have aws credentials at all in env
  };
}

const dynamodb = new AWS.DynamoDB.DocumentClient(dynamoDBClientParams);

module.exports.updateEmpleados = async (event) => {
  const id = event.pathParameters.id; // Obtener el ID del empleado de los parámetros de ruta
  const body = JSON.parse(event.body); // Obtener el cuerpo de la solicitud

  // Actualizar solo los campos proporcionados en el cuerpo de la solicitud
  const updateExpression =
    "SET " +
    Object.keys(body)
      .map((key) => `#${key} = :${key}`)
      .join(", ");
  const expressionAttributeNames = Object.keys(body).reduce(
    (acc, key) => ({ ...acc, [`#${key}`]: key }),
    {}
  );
  const expressionAttributeValues = Object.keys(body).reduce(
    (acc, key) => ({ ...acc, [`:${key}`]: body[key] }),
    {}
  );

  const updateParams = {
    TableName: process.env.DYNAMODB_EMPLEADOS_TABLE,
    Key: { pk: id },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: "ALL_NEW",
  };

  const result = await dynamodb.update(updateParams).promise();

  return {
    statusCode: 200,
    headers:{
      "Access-Control-Allow-Origin": '*',

    },
    body: JSON.stringify({ EMPLEADO: result.Attributes }),
  };
};
