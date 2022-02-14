var userFormEl = document.querySelector("#user-form");
var languageButtonsEl = document.querySelector("#language-buttons");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

var formSubmitHandler = function(event) {
    event.preventDefault();
    
    //GET VALUE FROM INPUT ELEMENT
    var username = nameInputEl.value.trim();

    if (username) {
        getUserRepos(username);
        //CLEAR OLD CONTENT
        repoContainerEl.textContent = "";
        nameInputEl.value = "";
    }   else {
        alert("Please enter a GitHub username");
    }
};

var buttonClickHandler = function(event) {
    // get the language attribute from the clicked element
    var language = event.target.getAttribute("data-language");
  
    if (language) {
      getFeaturedRepos(language);
  
      // clear old content
      repoContainerEl.textContent = "";
    }
  };

var getUserRepos = function(user) {
    // FORMAT THE GITHUB API URL
    var apiUrl = "https://api.github.com/users/" + user + "/repos";
    // MAKE THE SPECIFIC REQUEST TO THE URL AKA SERVER API
    fetch(apiUrl)
        .then(function(response) {
        //REVISE TO AN IF - ELSE TO HANDLE ERRORS
        if (response.ok) {
            console.log(response);
            response.json().then(function(data) {
                console.log(data);
                //SEND RESPONSE DATA FROM GETUSERREPOS TO DISPLAYREPOS
                displayRepos(data, user);
            });
        } else {
            alert("Error: " + response.statusText);
        }
    })
    //ADD NETWORK ERROR SOLUTION AS .CATCH CHAINED TO .THEN
    .catch(function(error) {
        alert("Unable to connect to GitHub");
    });
};

var getFeaturedRepos = function(response) {
    var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues"; 
    
    // make a get request to url
    fetch(apiUrl).then(function(response) {
        // request was successful
        if (response.ok) {
            response.json().then(function(data) {
                displayRepos(data.items, language);
            });
        } 
        else {
            alert("Error: " + response.statusText);
        }
    });
};

//FUNCTION TO DISPLAY RESPONSE FROM SERVER 
var displayRepos = function(repos,searchTerm) {
    //CHECK FOR ANY REPOS
    if (repos.length === 0){
        repoContainerEl.textContent = "No repositories found.";
        return;
    }

    //CLEAR OLD CONTENT BY ADDING STATEMENTS BELOW
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;
    //LOOP OVER REPOS
    for (var i = 0; i < repos.length; i++) {
        // FORMAT REPO NAME
        var repoName = repos[i].owner.login + "/" + repos[i].name;
        // CREATE CONTAINER FOR EACH REPO
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        //LINK THE HOMEPAGE TO THE SiNGLE-REPO PAGE AND ADD QUERY PARAMETER
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);
        // CREATE SPAN EL TO HOLD REPO NAME
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;
        //APPEND TO CONTAINER
        repoEl.appendChild(titleEl);
        //CREATE STATUS ELEMENT
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";
        
        //CHECK IF REOPOS ISSUES > 0
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML =
                "<i class='fas fa-times status-icon icon-danger'><i>" + repos[i].open_issues_count + "issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }
        //APPEND TO CONTAINER
        repoEl.appendChild(statusEl);
        //APPEND CONTAINER TO DOM
        repoContainerEl.appendChild(repoEl);
    }
};

//REPLACE TYP FUNCTION CALLBACK WITH EVENT LISTENER AS CALLBACK
userFormEl.addEventListener("submit", formSubmitHandler);

languageButtonsEl.addEventListener("click", buttonClickHandler);
