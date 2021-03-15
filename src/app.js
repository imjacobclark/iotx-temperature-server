let response;

const AWS = require('aws-sdk');
const cloudwatch = new AWS.CloudWatch({apiVersion: '2010-08-01'});

exports.lambdaHandler = async (event, context) => {
    const params = {
        MetricData: [{
            MetricName: "TEMPERATURE",
            Dimensions: [{
                Name: "ROOM",
                Value: event.queryStringParameters.room
            }],
            Unit: "Count",
            Value: parseFloat(event.queryStringParameters.temp)
        }],
        Namespace: 'IOTX-TEMPERATURE-METRICS'
    };

    return cloudwatch.putMetricData(params).promise().then(_ => {
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