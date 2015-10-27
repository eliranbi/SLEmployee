/*
within your project directory run
sudo npm install async
sudo npm install request
sudo npm install fs

*/

// Include the async package ... Make sure you add "async" to your package.json
var async = require("async");
var request = require('request');
var fs = require('fs');

var items = [];
var employeeArray = [];


//Get current employees ...
console.log(">> Getting employee list ...");
request('http://localhost:3000/api/employees', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        //console.log(body);
        items = JSON.parse(body);
        console.log(">> Going to delete [" + items.length + "] Employees");
        deleteAllEmployee(items);
     }
})


//Delete all employees 
function deleteAllEmployee(items){
    console.log(">> in deleteAllEmployee ...");
    // 1st para in async.each() is the array of items
    async.each(items,
    // 2nd param is the function that each item is passed to
    function(item, callback){
        // Call an asynchronous function, often a save() to DB        
        console.log(">> Deleting employee [" + item._id + "]");    
        request(
            { uri: 'http://localhost:3000/api/employees/' + item._id,
              method: "DELETE"    
            }, function (error, response, body) {
                // Async call is done, alert via callback        
                callback('Success ...');
                if (!error && response.statusCode == 200) {
                    //console.log(body); 
                }else{
                    console.error(error);
                }
        });                    
    },
  // 3rd param is the function to call when everything's done
  function(err){
    // All tasks are done now
        console.log(">> Deleting is done ...");    
       //doSomethingOnceAllAreDone();
       readEmployeeJsonFile();
  }
 );
}

//Open employee.json file
function readEmployeeJsonFile(){
    console.log(">> in readEmployeeJsonFile() ... : " + __dirname); 
    // Read the file and send to the callback
    fs.readFile(__dirname + '/data/employee-cache.json','utf8', handleFile)    
    function handleFile(err, data) { // --> callback function
        if (err){
            console.error(">> Error: " + err);
            return;
        }
        employeeArray = JSON.parse(data)
        uploadAllEmployees(employeeArray)
    }    
} 


function uploadAllEmployees(employeeArray){
    console.log(">> in uploadAllEmployees() Total: " + employeeArray.length)
    async.each(employeeArray,
        function(employee, callback){
            postEmployees(employee);    
            callback();
        },function(err){
            console.log(">> Finish upload all employee ...");            
        }
    );    
}

//Post each employee using the REST API
function postEmployees(employee){
    request({
        url: "http://localhost:3000/api/employees",
        method: "POST",
        json: true,   // <--Very important!!!
        body: employee 
    }, function (error, response, body){
        if (!error && response.statusCode == 200) {
            console.log(">> success upload employee id :" + body._id);
        }else{
            console.error(error);
        }        
    });
}

