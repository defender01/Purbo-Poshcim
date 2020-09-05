const classes = [
    "বাংলাদেশ",
    "আন্তর্জাতিক",
    "অর্থনীতি",     
    "সাহিত্য",
    "ক্যাম্পাস",
    "শিক্ষা",    
    "খেলা",
    "বিজ্ঞান ও প্রযুক্তি",
    "বিনোদন",
    "উদ্ভাবন",
    "মতামত",
    "কর্মসূচী",
  ];

let checkNotNull = (val) => {
    return typeof val !== "undefined" && val !== "" && val !== null;
  }
  
function trimSpace(obj){
    Object.keys(obj).forEach(key => {
        obj[key] = obj[key].trim()
        // console.log('#'+obj[key]+'#')
    });
    return obj
}

// this function redirects to http://www.purboposhcim.com for other duplicate url
function redirectUrl(req, res, next){
  console.log('came in redirectUrl')
  console.log(req.get('Host')+req.originalUrl)

  var host = req.get('Host');
  let originalUrl = req.originalUrl

  // if (host !== 'http://www.purboposhcim.com' && host !== 'localhost:4000') {  
  //   console.log('http://www.purboposhcim.com' + originalUrl)

  //   // return res.redirect(301, 'http://www.purboposhcim.com' + originalUrl);
  //   return res.redirect('http://www.purboposhcim.com' + originalUrl);
  // }
  return next();
}

  module.exports = {
      checkNotNull,
      trimSpace,
      classes,
      redirectUrl
  }