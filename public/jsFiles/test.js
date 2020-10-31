// **DO THIS**:
//   Replace BUCKET_NAME with the bucket name.
//
var albumBucketName = 'purboposhcim';

// **DO THIS**:
//   Replace this block of code with the sample code located at:
//   Cognito -- Manage Identity Pools -- [identity_pool_name] -- Sample Code -- JavaScript
//
// Initialize the Amazon Cognito credentials provider
AWS.config.region =  'ap-south-1'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'ap-south-1:3ea2411f-48a2-4d78-a538-f6e53ce6c16a',
});

// Create a new service object
var s3 = new AWS.S3({
apiVersion: '2006-03-01',
params: {Bucket: albumBucketName}
});

// A utility function to create HTML.
function getHtml(template) {
    return template.join('\n');
}

// Show the photos that exist in an album.
function viewAlbum() {
    
    var albumPhotosKey = 'newsPhoto/ক্যাম্পাস/';
    s3.listObjects({Prefix: albumPhotosKey}, function(err, data) {
      if (err) {
        return alert('There was an error viewing your album: ' + err.message);
      }
      // 'this' references the AWS.Response instance that represents the response
      var href = this.request.httpRequest.endpoint.href;
      var bucketUrl = href + albumBucketName + '/';
      console.log({bucketUrl})
      
      var photos = data.Contents.map(function(photo) {
        var photoKey = photo.Key;
        var photoUrl = bucketUrl + encodeURIComponent(photoKey);
        console.log({photoUrl})
        console.log(photoUrl.localeCompare('https://purboposhcim.s3.ap-south-1.amazonaws.com/newsPhoto/%E0%A6%95%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%AE%E0%A7%8D%E0%A6%AA%E0%A6%BE%E0%A6%B8/newsPhoto1604039918785.jpg'))
        $('#photoId').attr('src', 'https://purboposhcim.s3.amazonaws.com/newsPhoto/%E0%A6%95%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%AE%E0%A7%8D%E0%A6%AA%E0%A6%BE%E0%A6%B8/newsPhoto1604128610438.PNG');
        // return getHtml([
        //   '<span>',
        //     '<div>',
        //       '<br/>',
        //       '<img style="width:128px;height:128px;" src="' + photoUrl + '"/>',
        //     '</div>',
        //     '<div>',
        //       '<span>',
        //         photoKey.replace(albumPhotosKey, ''),
        //       '</span>',
        //     '</div>',
        //   '</span>',
        // ]);
      });
    //   var message = photos.length ?
    //     '<p>The following photos are present.</p>' :
    //     '<p>There are no photos in this album.</p>';
    //   var htmlTemplate = [
    //     '<div>',
    //       '<button onclick="listAlbums()">',
    //         'Back To Albums',
    //       '</button>',
    //     '</div>',
    //     '<h2>',
    //       'Album: ' + albumName,
    //     '</h2>',
    //     message,
    //     '<div>',
    //       getHtml(photos),
    //     '</div>',
    //     '<h2>',
    //       'End of Album: ' + albumName,
    //     '</h2>',
    //     '<div>',
    //       '<button onclick="listAlbums()">',
    //         'Back To Albums',
    //       '</button>',
    //     '</div>',
    //   ]
    //   document.getElementById('viewer').innerHTML = getHtml(htmlTemplate);
    //   document.getElementsByTagName('img')[0].setAttribute('style', 'display:none;');
    });
  }
  

function urlToEmbed(){
    let url = $('#rawUrl').val()
    
}
