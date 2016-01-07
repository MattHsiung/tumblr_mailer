var fs = require('fs');
var ejs = require('ejs');
var tumblr = require('tumblr.js')
var emailTemplate = fs.readFileSync("email_template.ejs", "utf8")
var csvData = csvParse("friend_list.csv")

var client = tumblr.createClient({
  consumer_key: 'Dio9U3J8o0MGCFOUtuntvXmCXsEKU7InIeTwknz1bOEOMSVqSV',
  consumer_secret: 'QCVu1wTG0skdjpnWRxdUFDEsZOM96fHjM2xa8lkjodcaTCjC2L',
  token: 'Kns9xAzIYGGV7RDMnZhD9TayD8Ux63slBg5uTONOlIFTjoLOVi',
  token_secret: 'I2GhfVSmGvDG6yPrW45qNwrkgXIltrqKI7v8fRGsG4RFqjLASY'
});

function csvParse(csvFile){
		//store csv file and split by lines
		var csvFile = fs.readFileSync(csvFile, "utf8").split("\n");
		//remove blank at end
		csvFile.pop()
		//create header
		var header = csvFile.shift().split(",")
		
		//splitting each line into an array 

		for(var i = 0; i< csvFile.length; i++){
			csvFile[i]= csvFile[i].split(",")
		}	

		//use function to convert array into object with properties
		for (var j = 0; j < csvFile.length; j++) {
			csvFile[j] = generateObj(header, csvFile[j] )
		};

		return csvFile
}

//create objects
function generateObj(keys, values){
	var obj = {}

	for (var i = 0; i < keys.length; i++){
		obj[keys[i]] = values[i]
	}
	
	return obj
}

//generate obj for latestPosts Array
function postVal(obj){
	var newObj ={};
	newObj.title = obj.title
	newObj.href = obj.post_url

	return newObj
}

//determine if a post was made within last 7 days
function compareDates(post){
	var currentDate = new Date()
	currentDate.setDate(currentDate.getDate() -7);

	var postDate = post.date

	if(new Date(currentDate) < new Date(postDate)){
		return true
	}else{
		return false
	}
    
}

client.posts('mhsiung.tumblr.com', function(err, blog){
	var posts = blog.posts
	var latestPosts = []

	//add to latestPosts array if post is less then 7 days old
	for (var i = 0; i < posts.length; i++) {
		if(compareDates(posts[i])){
			latestPosts.push(postVal(posts[i]))	
		}
	};

	//construct object to be passed to render
	function ejsVal(obj){
		var newObj=[]

		newObj.firstName = obj.firstName;
		newObj.numMonthsSinceContact = obj.numMonthsSinceContact;
		newObj.latestPosts = latestPosts
		return newObj

	}
	
	//render email from template for each friend on list	
	for (var x = 0; x < csvData.length; x++) {
		var customizedTemplate = ejs.render(emailTemplate, ejsVal(csvData[x]));
		console.log(customizedTemplate)
	};
	
})