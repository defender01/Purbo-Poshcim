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

  module.exports = {
      checkNotNull,
      trimSpace,
      classes
  }