var express =  require('express');
var cors = require('cors');

const app = express();
app.use(cors());

app.set('port', (process.env.PORT || 5000));

app.get('/', function(request, response) {
  response.send('Hello World!')
});

app.get('/users', function(req, res) {
  // Hard coding for simplicity. Pretend this hits a real database
  res.json([
    {"id": 1,"firstName":"Bob","lastName":"Smith","email":"bob@gmail.com"},
    {"id": 2,"firstName":"Tammy","lastName":"Norton","email":"tnorton@yahoo.com"},
    {"id": 3,"firstName":"Tina","lastName":"Lee","email":"lee.tina@hotmail.com"}    
  ]);
});

app.get('/acl', function(req, res) {
  // Hard coding for simplicity. Pretend this hits a real database
  res.json([{
    "type": "Contributor",
    "labelText": "Contributors:",
    "values": [{
        "recipientId": "1551d902-25e7-411c-9144-2b6be5008470",
        "name": "Fred Jackson",
        "recipientType": "User",
        "status": "Active"
    },
    {
        "recipientId": "c67b2dce-9bc5-4df1-f13e-d9625e338544",
        "name": "IncompleteRegistration TestUser",
        "recipientType": "User",
        "status": "Active"
    },
    {
        "recipientId": "51d51930-4667-4046-8ca3-4c58b2acf75b",
        "name": "NoAddComments TestUser",
        "recipientType": "User",
        "status": "Active"
    },
    {
        "recipientId": "51d51930-4107-4046-8ca3-4c58b2aaf75b",
        "name": "NoAddEvidence TestUser",
        "recipientType": "User",
        "status": "Active"
    },
    {
        "recipientId": "51d51930-4607-3046-8ca3-4c58b1ffe75a",
        "name": "NoCaseDownload TestUser",
        "recipientType": "User",
        "status": "Active"
    },
    {
        "recipientId": "51d51930-4607-4126-8ca3-4c58b2aaf75b",
        "name": "NoCaseStatusChange TestUser",
        "recipientType": "User",
        "status": "Active"
    },
    {
        "recipientId": "51d51930-4607-3046-8ca3-4c58b1ffe75a",
        "name": "NoCaseDownload TestUser",
        "recipientType": "User",
        "status": "Active"
    },
    {
        "recipientId": "51d51930-4607-4126-8ca3-4c58b2aff75b",
        "name": "NoEditCaseDetails TestUser",
        "recipientType": "User",
        "status": "Active"
    },
    {
        "recipientId": "51d51911-4607-4046-1ca3-4c58b2abf75b",
        "name": "NoEditCaseStatus TestUser",
        "recipientType": "User",
        "status": "Active"
    },
    {
        "recipientId": "51d51930-4607-3046-8ca3-4c58b1fdd45b",
        "name": "NoEditCaseThumbnail TestUser",
        "recipientType": "User",
        "status": "Active"
    },
    {
        "recipientId": "51d51930-4607-4046-8ca3-4c58b2aaf15b",
        "name": "NoEditEvidence TestUser",
        "recipientType": "User",
        "status": "Active"
    },
    {
        "recipientId": "51d51930-4607-4126-8ca3-4c58b2afff2f",
        "name": "NoEditEvidenceLocation TestUser",
        "recipientType": "User",
        "status": "Active"
    },
    {
        "recipientId": "51d51930-4607-3046-8ca3-4c58b1ffe75b",
        "name": "NoEditEvidenceSummary TestUser",
        "recipientType": "User",
        "status": "Active"
    },
    {
        "recipientId": "51d48930-4607-4046-8ca3-4c58b2aaf75b",
        "name": "NoEditKeyWords TestUser",
        "recipientType": "User",
        "status": "Active"
    },
    {
        "recipientId": "51d51930-4607-4046-8ca3-4c58b2aaf15d",
        "name": "NoEvidenceDownload TestUser",
        "recipientType": "User",
        "status": "Active"
    },
    {
        "recipientId": "51d51933-4517-4046-8ca3-4c58b2aaf75b",
        "name": "NoNewCase TestUser",
        "recipientType": "User",
        "status": "Active"
    },
    {
        "recipientId": "51d51933-4517-4046-1ca3-4c51b2aaf73f",
        "name": "NoNewOrphanedEvidence TestUser",
        "recipientType": "User",
        "status": "Active"
    },
    {
        "recipientId": "51d51930-4107-4046-8ca3-4c58b2aaf12b",
        "name": "NoPrimaryLocationChange TestUser",
        "recipientType": "User",
        "status": "Active"
    },
    {
        "recipientId": "51d51920-4607-4046-8ca3-4c58b2abf75b",
        "name": "NoShare TestUser",
        "recipientType": "User",
        "status": "Active"
    },
    {
        "recipientId": "c67b2dce-9bc5-4df1-f13e-d9625e3fa544",
        "name": "RmsAndCad TestUser",
        "recipientType": "User",
        "status": "Active"
    },
    {
        "recipientId": "51d51910-4607-4046-8ca3-4c58b2adc12b",
        "name": "Sharer TestUser",
        "recipientType": "User",
        "status": "Active"
    },
    {
        "recipientId": "c67c4fce-9bc5-4df1-a94e-f8625e338544",
        "name": "suggestion TestUser",
        "recipientType": "User",
        "status": "Active"
    }]
},
{
    "type": "Reader",
    "labelText": "Viewers:",
    "values": []
},
{
    "type": "Deny",
    "labelText": "Deny:",
    "values": []
}]);
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port')); //eslint-disable-line no-console
});