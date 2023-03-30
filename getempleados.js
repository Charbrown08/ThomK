'use strict'
const AWS = require('aws-sdk')

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



module.exports.getEmpleados= async (event) => {

  let empleadoId = event.pathParameters.id


  const queryParams = {
    ExpressionAttributeValues: { ':pk': empleadoId },
    KeyConditionExpression: 'pk = :pk',
    TableName: process.env.DYNAMODB_EMPLEADOS_TABLE
  }


  const result = await dynamodb.query(queryParams).promise()

  

  return {
    statusCode: 200,
    headers:{
      "Access-Control-Allow-Origin": '*',

    },
    body: JSON.stringify({      
      items: await result.Items.map(empleado => {
        return {
          id: empleado.pk,
          nombre:empleado.nombre,
          salario: empleado.salario
          }
        })
    })
  }

}