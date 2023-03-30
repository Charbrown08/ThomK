import boto3, json, os

client = boto3.resource('dynamodb')

IS_OFFLINE = os.getenv('IS_OFFLINE', False)
if IS_OFFLINE:
    boto3.Session(
        aws_access_key_id='ACCESS_KEY',
        aws_secret_access_key='SECRET_KEY',
    )
    client = boto3.resource('dynamodb', endpoint_url='http://localhost:8000')

table = client.Table('t-empleados-dev')


def deleteEmpleados(event, context):
    empleado_id = event['pathParameters']['id']
    result = table.delete_item(Key = {'pk': empleado_id})

    body = json.dumps( { 'message' : f"Empleado {empleado_id} borrado"})

    response = {
        'statusCode': result['ResponseMetadata']['HTTPStatusCode'],
        'headers':{  "Access-Control-Allow-Origin": '*'},
        
        'body': body
    }

    return response