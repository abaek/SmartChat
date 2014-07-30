var chatApp = angular.module('chatApp', ['ui.bootstrap']);
chatApp.controller('ChatAppController', function($scope, $http, $location, $modal) {
    $scope.items = ['item1', 'item2', 'item3'];

    var modalInstance = $modal.open({
      templateUrl: 'usernamePick.html',
      controller: ModalInstanceCtrl,
      size: 'sm',
      resolve: {}
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.username = selectedItem;
    });











  //LOAD PARSE AND VOCAB
  Parse.initialize("MWRSn7VKQRGSSQ9p64iXwjuXbqifQQ5tZ12kJzFe", "Zf0XMsZyzfsosuTDlpeORc9uHa8iQVzl0LJhVRIV");
  $scope.shortcuts = [['{wait}', 'Hello customer. We are current unavailable and will get back to you as soon as possible.'], ['{vacation}', 'Hello, thank you for reaching out to us, we will be available on January 3, 2015 when our business reseumes']];
  $scope.messages = [{user: 'Andy', text: 'Welcome.'}];
  $scope.userEdit = false;
  //$http.get('src/json/'+$routeParams[user]+'vocab.json')
  
  // //$http.get('C://Users//Andy//Documents//2A//Programming//Genesys//gws-emulator-master//client//src//json//Andyvocab.json')
  //$http.get('C://Users//Andy//Documents//2A//Programming//Genesys//gws-emulator-master//client//src//json//Andyvocab.json')
  // $http.get('src/json/Andyvocab.json').then(function(res){
  //   $scope.dict = res.data;
  //   $scope.currentDict = $scope.dict;                
  // });
  // $scope.dict = {"the":{"book":{"is":{"red":{"1":null,"yo":{"6":null}},"blue":{"2":null}}},"lion":{"was":{"green":{"3":null},"orange":{"4":null,"but":{"no":{"1":null}}}}},"rain":{"is":{"snowing":{"1":null}}},"way":{"we":{"are":{"awesome":{"1":null}}}}},"hey":{"whatsup":{"4":null},"hows":{"it":{"going":{"man":{"2":null},"genesys":{"hackathon":{"1":null}}}},"life":{"2":null,"man":{"1":null}}},"hey":{"1":null},"genesys":{"hackathon":{"1":null}},"we're":{"team":{"57":{"Charles":{"1":null}}}}},"yo":{"hows":{"it":{"going":{"5":null}}},"whatsup":{"1":null,"man":{"1":null}}},"yolo":{"swag":{"man":{"1":null,"shawg":{"1":null}}}},"what":{"the":{"hell":{"1":null,"is":{"going":{"on":{"3":null}}}}}},"When":{"copying":{"an":{"array":{"in":{"javascript":{"to":{"another":{"array":{"1":null}}}}}}}},"you":{"are":{"copying":{"an":{"array":{"in":{"javascript":{"to":{"another":{"array":{"1":null}}}}}}}}}},"we":{"are":{"copying":{"an":{"array":{"in":{"javascript":{"to":{"another":{"array":{"1":null}}}}}}}}}}},"While":{"we":{"are":{"copying":{"an":{"array":{"in":{"javascript":{"to":{"another":{"array":{"1":null}}}}}}}}}}},"The":{"way":{"we":{"are":{"copying":{"an":{"array":{"in":{"javascript":{"to":{"another":{"array":{"1":null}}}}}}}}}}}},"i":{"heard":{"you":{"were":{"going":{"to":{"go":{"to":{"the":{"after":{"party":{"today":{"1":null}}}}}}}}}}}}};
  // $scope.currentDict = $scope.dict;
  $scope.dict = {};
  $scope.currentDict = {};    
  var socket = io();

  //AUTOCOMPLETE
  $scope.finishSentence = function (){
    $scope.query = $scope.suggestion;
  }

  $scope.resetAutocomplete = function(){
    $scope.currentDict = $scope.dict;
  }

  $scope.loadSentence = function(){
    var lastChar = $scope.query.slice(-1);
    if(lastChar == ' '){
      var listWords = $scope.query.split(' ');
      var string = listWords[listWords.length - 2];
      if (string in $scope.currentDict){
        $scope.currentDict = $scope.currentDict[string];
        $scope.maxFreq = 0;
        $scope.bestPath = [];
        maxDict($scope.currentDict, []);
        $scope.suggestion = $scope.query;
        for (var i = 0; i < $scope.bestPath.length; i++){
          if (i == 0){
            $scope.suggestion = $scope.suggestion + $scope.bestPath[i];
          } else {
            $scope.suggestion = $scope.suggestion + " " + $scope.bestPath[i];
          }
        }
      }
    }
  }

  function maxDict(dict, path){
    var listChildren = Object.keys(dict);
    for (var i = 0; i < listChildren.length; i++){
      if (!(isNaN(listChildren[i]))){
        if (listChildren[i] > $scope.maxFreq){
          $scope.maxFreq = listChildren[i];
          $scope.bestPath = path;
        }
      } else {
        var curPath = path.slice(0);
        curPath.push(listChildren[i]);
        maxDict(dict[listChildren[i]], curPath);
      }
    }
  }

  //add to dictionary
  $scope.addSentence = function(sentence){
    var words = sentence.split(' ');
    addAr(words, $scope.dict);
  }

  function addAr(lst, dict){
    if( lst.length == 1){
      var lastWord = lst[0];
      if (!(lastWord in dict)){
        dict[lastWord] = {1: null};
      } else {
        var listKeys = Object.keys(dict[lastWord]);
        var foundShortSentence = false;
        for (var j = 0; j < listKeys.length; j++){
          //if the short sentence exists as a number {3: null}
          if (!(isNaN(listKeys[j]))){
            var num = listKeys[j];
            delete dict[lastWord][num];
            dict[lastWord][parseInt(num)+1] = null;
            foundShortSentence = true;
          }
        }
        if (!foundShortSentence) {
          dict[lastWord][1] = null;
        }
      }
    } 
    //lots of words left
    else if (lst.length > 1) {
      var nextWord = lst[0];
      if ((dict == {}) || (!(nextWord in dict))){
        dict[nextWord] = {};
      }
      lst.shift();
      addAr(lst, dict[nextWord]);
    }
  }

  $scope.keyPress = function(eve) {
    if(eve.which === 40){
      $scope.query = $scope.suggestion;  
    } else if (eve.which === 13){
      $scope.addSentence($scope.query);
      $scope.currentDict = $scope.dict;
      $scope.suggestion = "";
      socket.emit('chat message', $scope.query);
      $scope.query = "";





    } else if (eve.which === 39){
      filterInput($scope.query);
    }
  }

  socket.on('chat message', function(msg){
    $scope.messages.push({user: "Andy", text: msg});
    $('#messages').append($('<li>').text($scope.username + ': ' + msg));
  });

  $scope.usersOnline = [];
  socket.emit('new user', 'anon');
  socket.on('new user', function(numUsers){
    //$scope.usersOnline.push();
    $scope.numUsers = numUsers;
  });

  function filterInput(sentence){
    if (sentence.indexOf("{weather}") > -1){
      $http({method: 'GET', url: 'http://api.worldweatheronline.com/free/v1/weather.ashx?q=toronto&format=json&num_of_days=1&key=309fa668804f8169624583163650d719a9f1c206'}).
      success(function(data, status, headers, config) {
        $scope.query = sentence.replace('{weather}', data.data.current_condition[0].temp_C+'C, Humidity:'+data.data.current_condition[0].humidity);
      }).
      error(function(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
    }
    for (var i = 0; i < $scope.shortcuts.length; i++){
      if (sentence.indexOf($scope.shortcuts[i][0]) > -1){
        $scope.query = sentence.replace($scope.shortcuts[i][0], $scope.shortcuts[i][1]);
      }
    }
  }

  $scope.addShortcut = function(shortcutShort, shortcutLong){
    $scope.shortcuts.push(['{'+shortcutShort+'}', shortcutLong]);
  }

  $scope.saveVocab = function(){
  //   $http({
  //   url: 'http://localhost:3000/client/src/json/Andyvocab.json',
  //   method: "POST",
  //   data: $scope.dict,
  //   headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  // }).then(function(response) {
  //       alert("success");
  //   }, 
  //   function(response) { // optional
  //       alert("failed "+response);
  //   }
  //   );


    // //$http.defaults.useXDomain = true;
    // $http.post('src/json/Andyvocab.json', $scope.dict).then(function(data) {
    //   $scope.msg = 'Data saved';
    // });

    $http.post("http://localhost:3000/dictionary", $scope.dict)
    .success(function(data) {
      alert("success");
    })

  }

  $scope.changeUsername = function(){
    $scope.userEdit = true;
  }

  $scope.setUsername = function(){
    $scope.userEdit = false;
  }

  //API'S
  $scope.getWeather = function(city){
    $http({method: 'GET', url: 'http://api.worldweatheronline.com/free/v1/weather.ashx?q='+city+'&format=json&num_of_days=1&key=309fa668804f8169624583163650d719a9f1c206'}).
    success(function(data, status, headers, config) {
      $scope.weather = data;
      deferred.resolve(''+$scope.weather.data.current_condition[0].temp_C+'°C, Humidity:'+$scope.weather.data.current_condition[0].humidity);
    }).
    error(function(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
  }

  $scope.getUrl = function(){
    $http({method: 'POST', url: 'https://www.googleapis.com/urlshortener/v1/url?longUrl=http://www.google.com/'}).
    success(function(data, status, headers, config) {
      $scope.urlShort = data;
    }).
    error(function(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
  }

  $scope.getWolfram = function(expression){
    var xmlhttp=new XMLHttpRequest();
    xmlhttp.open("GET",'http://api.wolframalpha.com/v2/query?appid=E964LQ-J9PT3XGUJK&input=3%2B5&format=plaintext.xml',true);
    xmlhttp.send();
    var u = xmlhttp.responseText;
    var i = 0;

    // $http.get('http://api.wolframalpha.com/v2/query?appid=E964LQ-J9PT3XGUJK&input=3%2B5&format=plaintext').then(function(response) {
    //   var xml = x2js.xml_str2json(response.data);
    // // $http({method: 'GET', url: 'http://api.wolframalpha.com/v2/query?appid=E964LQ-J9PT3XGUJK&input=3%2B5&format=minput'}).
    // //   success(function(data, status, headers, config) {
    // //   var xml = x2js.xml_str2json(data);

    //   var result = xml.queryresult.pod[3].subpod.plaintext;
    //   $scope.wolframresult = result;
    // });
  }




});

chatApp.controller('LoginController', function($scope, $http, $location) {
  //LOGIN and REGISTER
  Parse.initialize("MWRSn7VKQRGSSQ9p64iXwjuXbqifQQ5tZ12kJzFe", "Zf0XMsZyzfsosuTDlpeORc9uHa8iQVzl0LJhVRIV");
  $scope.insertUser = function(username, email, password, password2){
    if (validateForm(email, password, password2)){
      var user = new Parse.User();
      user.set("username", username);
      user.set("password", password);
      user.set("email", email);

      user.signUp(null, {
        success: function(user) {
          alert("Signup successful " + user.get('username'));
          $scope.username = user.get("username");
          window.location.href = 'schat.html';
          //window.location.href = 'http://localhost:8888/client/index2.html?user=' + $scope.username;
      },
        error: function(user, error) {
      // Show the error message somewhere and let the user try again.
      alert("Error: " + error.code + " " + error.message);
    }
  });
    }
  }

  function validateForm(email, pass1, pass2) {
    if (pass1 != pass2){
      alert('Passwords do not match.'); 
      return false;
    }
    else if (email == "") { 
      alert('Email address is required.'); 
      return false; 
    }
    else if (email.indexOf("@") < 1 || email.indexOf(".") < 1) { 
      alert('Please enter a valid email address.'); 
      return false; 
    }
    return true;
  }

  $scope.login = function(username, password){
    Parse.initialize("MWRSn7VKQRGSSQ9p64iXwjuXbqifQQ5tZ12kJzFe", "Zf0XMsZyzfsosuTDlpeORc9uHa8iQVzl0LJhVRIV");
    Parse.User.logIn(username, password, {
      success: function(user) {
        $scope.username = user.get("username");
        $location.path('schat.html')
          //window.location.href = 'http://localhost:8888/client/index2.html?user='+$scope.username;    
        },
      error: function(user, error) {
        // The login failed. Check error to see why.
        alert('Incorrect credentials'); 
      }
    });
  }

  $scope.logout = function(){
    Parse.User.logOut();
  }
});






// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

var ModalInstanceCtrl = function ($scope, $modalInstance) {
  $scope.selected = {
    username: ''
  };
  $scope.ok = function () {
    $modalInstance.close($scope.selected.username);
  };
}