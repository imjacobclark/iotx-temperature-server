let response;

const AWS = require('aws-sdk');
const cloudwatch = new AWS.CloudWatch({apiVersion: '2010-08-01'});

exports.lambdaHandler = async (event, context) => {
    const params = {
        MetricData: [{
            MetricName: "NODEPING",
            Dimensions: [{
                Name: "ROOM",
                Value: event.queryStringParameters.room
            }],
            Unit: "Count",
            Value: 1
        }],
        Namespace: 'IOTX-TEMPERATURE-METRICS'
    };

    return cloudwatch.putMetricData(params).promise().then(_ => {
        return {
            'statusCode': 200,
            'body': JSON.stringify({
                message: "OK",
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