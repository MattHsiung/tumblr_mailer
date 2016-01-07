var fs = require('fs');
var ejs = require('ejs');
var tumblr = require('tumblr.js')


function generateObj(keys, values){
	var obj = {}

	for (var i = 0; i < keys.length; i++){
		obj[keys[i]] = values[i]
	}

	return obj

}

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

var template = fs.readFileSync("email_template.html", "utf8")

var csvData = csvParse("friend_list.csv")

function ejsVal(obj){
	var newObj=[]

	newObj.firstName = obj.firstName;
	newObj.numMonthsSinceContact = obj.numMonthsSinceContact;

	return newObj

}

var customizedTemplate = ejs.render(emailTemplate, ejsVal(csvData[0]));

// template.replace("FIRST_NAME", csvData[0].firstName).replace("NUM_MONTHS_SINCE_CONTACT", csvData[0].numMonthsSinceContact)

console.log(ejsVal(csvData[0]))
