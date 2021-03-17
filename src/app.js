const AWSXRay = require('aws-xray-sdk');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));
const cloudwatch = new AWS.CloudWatch({apiVersion: '2010-08-01'});
const timestreamwrite = new AWS.TimestreamWrite({apiVersion: '2018-11-01'});

AWS.config.update({region: process.env.DEFAULT_AWS_REGION || 'eu-west-1'});

exports.lambdaHandler = async (event, context) => {
    const timestreamParams = {
        DatabaseName: 'TemperatureHistory',
        Records: [
          {
            Dimensions: [
                {
                    Name: 'ROOM', 
                    Value: event.queryStringParameters.room,
                    DimensionValueType: "VARCHAR"
                },
            ],
            MeasureName: 'TEMPERATURE',
            MeasureValue: event.queryStringParameters.temp,
            MeasureValueType: "DOUBLE",
            Time: Date.now().toString(),
            TimeUnit: "MILLISECONDS",
          },
          {
            Dimensions: [
                {
                    Name: 'ROOM', 
                    Value: event.queryStringParameters.room,
                    DimensionValueType: "VARCHAR"
                },
            ],
            MeasureName: 'HUMIDITY',
            MeasureValue: event.queryStringParameters.humidity,
            MeasureValueType: "DOUBLE",
            Time: Date.now().toString(),
            TimeUnit: "MILLISECONDS",
          },
        ],
        TableName: 'TemperatureHistory',
    };

    const coudwatchParams = {
        MetricData: [{
            MetricName: "TEMPERATURE",
            Dimensions: [{
                Name: "ROOM",
                Value: event.queryStringParameters.room
            }],
            Unit: "Count",
            Value: parseFloat(event.queryStringParameters.temp)
        },
        {
            MetricName: "HUMIDITY",
            Dimensions: [{
                Name: "ROOM",
                Value: event.queryStringParameters.room
            }],
            Unit: "Count",
            Value: parseFloat(event.queryStringParameters.humidity)
        }],
        Namespace: 'IOTX-TEMPERATURE-METRICS'
    };

    return cloudwatch.putMetricData(coudwatchParams).promise()
    .then(() => timestreamwrite.writeRecords(timestreamParams).promise())
    .then(_ => {
        return {
            'statusCode': 200,
            'body': JSON.stringify({
                message: event.queryStringParameters.temp,
            })
        }
    }).catch(e => {
        return {
            'statusCode': 500,
            'body': JSON.stringify({
                message: e,
            })
        }
    })
};