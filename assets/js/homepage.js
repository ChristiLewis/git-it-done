var getUserRepos = function(user) {
    // FORMAT THE GITHUB API URL
    var apiUrl = "https://api.github.com/users/" + user + "/repos";
    // MAKE THE SPECIFIC REQUEST TO THE URL AKA SERVER API
    fetch(apiUrl).then(function(response) {
        response.json().then(function(data) {
          console.log(data);
        });
    });
};
console.log("outside");

getUserRepos("octocat");