'use strict'
const AWS = require('aws-sdk')
const { randomUUID } = require("crypto")

let dynamoDBClientParams = {}

if (process.env.IS_OFFLINE) {
    dynamoDBClientParams =  {
        region: 'localhost',
        endpoint: 'http://localhost:8000',
        accessKeyId: 'DEFAULT_ACCESS_KEY',  // needed if you don't have aws credentials at all in env
        secretAccessKey: 'DEFAULT_SECRET' // needed if you don't have aws credentials at all in env
    }
}

const dynamodb = new AWS.DynamoDB.DocumentClient(dynamoDBClientParams)

module.exports.createEmpleados = async (event) => {
  const id = randomUUID();  
  
  let empleadosBody = JSON.parse(event.body)
  empleadosBody = {
    nombre: empleadosBody.nombre,
    salario: empleadosBody.salario
  }
  empleadosBody.pk=id

  
  const putParams = {
    TableName: process.env.DYNAMODB_EMPLEADOS_TABLE,
    Item: empleadosBody,
  }
  await dynamodb.put(putParams).promise()

  return {
    statusCode: 201,
    headers:{
      "Access-Control-Allow-Origin": '*',

    },
    "body": JSON.stringify({'EMPLEADO': putParams.Item})
    
  }
}