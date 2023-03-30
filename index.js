module.exports.handler = async (event) => {
  return {
    statusCode: 200,
    headers:{
      "Access-Control-Allow-Origin": '*',

    },
    body: JSON.stringify(
      {
        message: "Bienvenido a serverless , EL Camino del programador!",
        
      }    
    ),
  };
};
