'use strict';

import _ from 'lodash';
import express from 'express';
import marked from 'marked';
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const Router = express('router');
const router = express.Router();
const request = require('request');
const apiCache = require('apicache').options({
  debug: true,
  enabled: process.env.NODE_ENV === 'production'
}).middleware;
var app = express();

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


if(process.env.NODE_ENV == 'production'){
  console.log('production environment');
}

if(process.env.NODE_ENV == 'development'){
  console.log('developing environment');
}

if(process.env.NODE_ENV == 'btc'){
  router.get('/projects', (req, res) => {
    res.send('this is the btc version');
  });
}

// router.get('/v1/projects', (req, res) => {
//   res.send('this is the version1');
// });
// router.get('/v2/projects', (req, res) => {
//   res.send('this is the btc version2');
// });

router.get('/projects', (req, res) => {
  let faqJson;
  let faqArray = [];
  let projectsJson = [];
  let bodyFaq;
  let returnObj;

  request('http://craft-haf.beresponsive.co.za/list/projects.json', (err, response, body) => {
    if(response.statusCode > 199 && response.statusCode < 300){
      const bodyJson = JSON.parse(body);
      for (var key in bodyJson){
        var dataArray = [];
        var data = bodyJson.data;
        for(var i in data) {
          var id = data[i].id;
          var name = data[i].projName;
          var location = data[i].projLocation;
          var imgUrl = data[i].projImage[0];
          var isNew = data[i].projNew;
          if(isNew==1){
            isNew=true;
          }else{
            isNew=false;
          }
          var capCurrent = data[i].projCapcurrent;
          var capMax = data[i].projCapmax;
          var couldBring = data[i].projGear;
          var childFriendly = data[i].projPg;
          var description = data[i].projInfo;
          var iosDescription = data[i].projInfo;
          iosDescription=iosDescription.replace(/<\s*br\/*>/gi, "");
          iosDescription=iosDescription.replace(/<\s*a.*href="(.*?)".*>(.*?)<\/a>/gi, "");
          iosDescription=iosDescription.replace(/<\s*\/*.+?>/ig, "");
          iosDescription=iosDescription.replace(/ {2,}/gi, " ");
          iosDescription=iosDescription.replace(/\n+\s*/gi, "");
          var lat = data[i].lat;
          var lon = data[i].lon;
          dataArray.push({
            id,name,location,imgUrl,isNew,capCurrent,capMax,couldBring,childFriendly,description,iosDescription,lat,lon
          });
        }
      }

      request('http://craft-haf.beresponsive.co.za/list/faq.json', (err, response, body) => {
        if(response.statusCode > 199 && response.statusCode < 300) {
          const bodyJson = JSON.parse(body);
          returnObj = {
            projects: dataArray,
            faq: bodyJson.data,
          }
          // return res.status(200).json(returnObj);
          return res.status(200).json(dataArray);
        }else {
          res.send("statusCode = " + res.statusCode);
        }
      });


    } else {
      return projectsJson;
      res.send("statusCode = "+res.statusCode);
    }
    });
})


router.get('/projects/:id', (req, res) => {
  const projectId = req.params.id;
  request('http://craft-haf.beresponsive.co.za/list/projects/' + projectId + '.json', (err, response, body) => {
    if(response.statusCode > 199 && response.statusCode < 300){
      const bodyJson = JSON.parse(body);
      return res.status(200).json(bodyJson);
    }else{
      res.send("statusCode = "+res.statusCode);
    }
  })
})

router.get('/faq', (req, res) => {
  request('http://craft-haf.beresponsive.co.za/list/faq.json', (err, response, body) => {
    if(response.statusCode > 199 && response.statusCode < 300){
      const bodyJson = JSON.parse(body);

      return res.status(200).json(bodyJson.data);
      // return res.status(200).json(dataArray);
    }else{
      res.send("statusCode = "+res.statusCode);
    }
  })
})


router.get('/tokens', (req, res) => {
  request('http://craft-haf.beresponsive.co.za/list/tokens.json', (err, response, body) => {
    if(response.statusCode > 199 && response.statusCode < 300){
      const bodyJson = JSON.parse(body);
      const tokenData = bodyJson.data;
      var tokenArray = [];
      for(var i in tokenData) {
        if(tokenData[i]){
          var id = tokenData[i].id;
          var firstName = tokenData[i].firstName;
          var lastName = tokenData[i].lastName;
          var campus = tokenData[i].campus;
          var project = tokenData[i].project;
          var token = tokenData[i].token;
          tokenArray.push({
            id,firstName,lastName,campus,project,token
          });

        }

      }
      return res.status(200).json(tokenArray);
    }else{
      res.send("statusCode = "+res.statusCode);
    }
  })
})

router.post('/register', (req, res) => {

  let totalUsers = 0;
  let promises = [];
  let users = [];
  let user;
  let capMax;
  let capCurrent;
  let bodyJson;
  let userJson;
  let projectName;
  let newCap;

  /**
   * Check to see if the project has capcity
   *
   * @param [projectId] Project Id
   * @returns {Promise}
   */
  const checkProjectQuota = (projectId) =>  {
    return new Promise((resolve, reject) => {
      request('http://craft-haf.beresponsive.co.za/list/projects/' + parseInt(projectId, 0) + '.json', (err, response, body) => {
        if (response.statusCode > 199 && response.statusCode < 300) {
        bodyJson = JSON.parse(body);
        capCurrent = parseInt(bodyJson.capCurrent, 0);
        capMax = parseInt(bodyJson.capMax, 0);
        projectName = bodyJson.name;
        console.log(`capCurrent: ${capCurrent}, capMax: ${capMax}`);
        if (capCurrent >= capMax) {
          console.log('cap reached');
          reject({ status: 'error', reason: 'Max Capacity Reached' });
        } else {
          console.log('can register');
          resolve(bodyJson);
        }
      } else {
        reject({ status: 'error', reason: 'Invalid Project' });
      }
      });
    });
  };

  /**
   * Add user to db
   *
   * @param [user] User object
   * @returns {Promise}
   */
  const addUser = (user) => {
    return new Promise((resolve, reject) => {
      request.post(
      'http://craft-haf.beresponsive.co.za',
      {
        form: user,
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      },
      function (error, response) {
        if (!error && response.statusCode == 200) {
          resolve(response.body);
        } else {
          resolve('error');
        }
      });
    });
  };

  /**
   * Update project current capcity
   *
   * @param [capCount] New current capcity value
   * @param [projectName] Name of the project to update
   */
  const updateProjectCap = (capCount, projectName) => {
    const form = {
      name: projectName,
      capCurrent: capCount,
    };
    request.post(
      'http://craft-haf.beresponsive.co.za/update_cap.php',
      {
        form,
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      },
      function (error, response) {
        console.log(response.body);
      });
    };

  checkProjectQuota(req.body.project).then((project) => {

    // create user object
    userJson = req.body;
    user = {
      title: userJson.firstName+' '+userJson.lastName,
      sectionId: 7,
      action: 'guestEntries/saveEntry',
      firstName: userJson.firstName,
      lastName: userJson.lastName,
      email: userJson.email,
      cellNumber: userJson.cellNumber,
      tradeSkills: userJson.tradeSkills,
      project: project.name,
      campus: userJson.campus,
      proxy: userJson.proxy,
      token: userJson.token,
    };
    users.push(user);

    // if family members create new user object and push to users array
    if (req.body.family) {
      req.body.familyMembers.forEach(function (member,index,arr) {
        var user = {
          title: member.mn+' '+req.body.lastName,
          sectionId: 7,
          action: 'guestEntries/saveEntry',
          firstName: member.mn,
          lastName: req.body.lastName,
          email: member.me,
          cellNumber: '',
          tradeSkills: '',
          project: project.name,
          campus: req.body.campus,
          proxy: req.body.firstName,
          token: req.body.token,
        }
        users.push(user);
      });
    }

    // Create promises array
    users.forEach((user) => {
      promises.push(addUser(user));
    });

    // When all promises are resolved udpate the project capacity and add users to google sheet
    Promise.all(promises).then((values) => {
      // Update project capacity
      newCap = parseInt(capCurrent, 0) + promises.length;
      updateProjectCap(newCap, projectName);

      // Add users to google sheet
      users.forEach(function (user, index, arr) {
        request.post(
          'https://script.google.com/macros/s/AKfycbwQt5CEgJp-PoZJzrFjVpFHiLl54p8olAcVO2WV-L9-6qwpLIem/exec',
          {
            headers: {
              'content-type': 'application/json'
            },
            body: JSON.stringify({
              'firstName': user.firstName,
              'lastName': user.lastName,
              'email': user.email,
              'cellNumber': user.cellNumber,
              'tradeSkills': user.tradeSkills,
              'project': user.project,
              'campus': user.campus,
              'proxy': user.proxy,
              'token': user.token
            })
          },
          function (error, response, body) {
            console.log('user added to google sheet');
          }
        );
      });
    });

    // Send success reponse
    res.status(200).json({ status: 'success', reason: 'Registration Successful' });
  }).catch((err) => {
    // Send error reponse
    res.status(400).json(err);
  });
});

// working request - returns all the projects
// router.get('/v2/projects', (req, res) => {
//   request('http://haf-craft:1339/list/projectsEnv.json', (err, response, body) => {
//     if(response.statusCode > 199 && response.statusCode < 300){
//       const bodyJson = JSON.parse(body);
//
//       return res.status(200).json(bodyJson.data);
//       // return res.status(200).json(postJson);
//     }else{
//       res.send("statusCode = "+res.statusCode);
//     }
//   })
// });
//



// router.post('/v2/projects', (req, res) => {
//
//   if(req.param){
//     console.log("has data");
//   }else{
//     console.log("empty");
//   }
//
//   // function to check if any post data is being passed for filtering and store into json array
//   // var projParams = {
//   //   location: req.param('location'),
//   //   childFriendly: req.param('childFriendly'),
//   //   days: req.param('days'),
//   // };
//   var projParams = [
//     req.param('location'),
//     req.param('childFriendly'),
//     req.param('days')
//   ];
//
//   if(true){
//     console.log("it is empty");
//     console.log(projParams);
//     res.send(projParams);
//   }else{
//     console.log("nah, you have to do the filtering");
//     console.log("array is not empty");
//     request('http://haf-craft:1339/list/projectsEnv.json', (err, response, body) => {
//       if(response.statusCode > 199 && response.statusCode < 300){
//         const bodyJson = JSON.parse(body);
//         return res.status(200).json(bodyJson.data);
//       }else{
//         res.send("statusCode = "+res.statusCode);
//       }
//     })
//   }
// });

router.post('/v2/projects', (req, res) => {

  let postParams = [];

  postParams = {
    postFilter: req.body.filter,
    postLocation: req.body.location,
    postChildFriendly: req.body.childFriendly,
    postDays: req.body.days,
    postLastID: req.body.lastId,
    postTake: req.body.take
  };

  let postFilter = req.body.filter;
  let postLocation = req.body.location;
  let postChildFriendly = req.body.childFriendly;
  let postDays = req.body.days;
  let postLastID = req.body.lastId;
  let postTake = parseInt(req.body.take);

  if(postFilter === 'false') {

    request('http://haf-craft:1339/list/projectsEnv.json', (err, response, body) => {
      if(response.statusCode > 199 && response.statusCode < 300){
        const bodyJson = JSON.parse(body);
        var entries = bodyJson.data;


        var returnProjects = [];
        var counter = 0;

        entries.forEach(function(project, index, array) {
          if(counter===postTake){ return; }
          console.log(index);


          returnProjects.push(project);
          counter++;
        });

        return res.status(200).json(returnProjects);
        // return res.status(200).json(bodyJson.data);
      }else{
        return res.send("statusCode = "+res.statusCode);
      }
    });



  }

  if(postFilter === 'true') {
    console.log('Filter='+postFilter+' <=> Locations='+postLocation+' <=> ChildFriendly='+postChildFriendly+' <=> Days='+postDays+' <=> LastID'+postLastID+' <=> Take='+postTake);
    /////////////////////////////////////////////////////////// apply filter code
    request('http://haf-craft:1339/list/projectsEnv.json', (err, response, body) => {
      // filter function
      if(response.statusCode > 199 && response.statusCode < 300){
        let entries = JSON.parse(body);
        entries = entries.data;

        let projects = [];
        let project;

        var returnProjects = [];
        var counter = 0;

        entries.forEach(function(project, index, array) {

          if(counter===postTake){ return; } // exit loop if it reaches take value

          // flatten the locations array
          let pLs = [];
          let entryLocas = project.projectLocations;
          for(var entryLoc in entryLocas) {
            pLs.push(entryLocas[entryLoc].value);
          }
          // console.log(pLs);
          //flatten the days array
          let pDs = [];
          let entryDays = project.days;
          for(var entryDay in entryDays) {
            pDs.push(entryDays[entryDay].value);
          }
          // console.log(pDs);

          // function to check if concatenated array has duplicate values
          function hasDuplicates(array) {
            return (new Set(array)).size !== array.length;
          }

          let dlocations = pLs.concat(postLocation);
          let ddays = pDs.concat(postDays);


          if((project.childFriendly == postChildFriendly) || (hasDuplicates(dlocations)) || (hasDuplicates(ddays))) {
            console.log(project.id+" has some of the filter requirements");
            projects.push(project);
          }else{
            console.log(project.id+" does not meet filter");
          }

          counter++;
        });

        return res.status(200).json(projects);
        // return res.status(200).json(entries.data);
      }else{
        res.send("statusCode = "+res.statusCode);
      }
    })
  }

//   request('http://haf-craft:1339/list/projectsEnv.json', (err, response, body) => {
//     if(response.statusCode > 199 && response.statusCode < 300){
//       const bodyJson = JSON.parse(body);
//       return res.status(200).json(bodyJson.data);
//     }else{
//       return res.send("statusCode = "+res.statusCode);
//     }
//   })
//

});


module.exports = router;
