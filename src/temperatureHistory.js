let response;

const AWS = require('aws-sdk');
const cloudwatch = new AWS.CloudWatch({apiVersion: '2010-08-01'});

exports.lambdaHandler = async (event, context) => {
    const date = new Date();
    const params = {
        EndTime:  date.toISOString(),
        StartTime: new Date( date - 1000 * 60 ),
        MetricName: "TEMPERATURE",
        Dimensions: [{Name: 'ROOM', Value: event.pathParameters.room}],
        Namespace: 'IOTX-TEMPERATURE-METRICS',
        Period: 60,
        Statistics: ['Average'],
        Unit: 'Count'
    };

    return cloudwatch.getMetricStatistics(params).promise().then(data => {
        return {
            'statusCode': 200,
            'body': JSON.stringify({
                temperature: data.Datapoints[0].Average,
                timestamp: data.Datapoints[0].Timestamp,
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