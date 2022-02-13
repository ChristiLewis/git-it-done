var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");

var displayWarning = function(repo) {
    //ADD TEXT TO WARNING CONTAINER
    limitWarningEl.textContent ="To see more than 30 issues, visit ";
    //APPEND A LINK ELEMENT W/ AN HREF ATTR THAT POINTS TO THE GITHUB SITE
    var linkEl = document.createElement("a");
    linkEl.textContent = "See More Issues on GitHub.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");

    //APPEND TO WARNING CONTAINER
    limitWarningEl.appendChild(linkEl);
};

var getRepoIssues = function(repo) {
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";

    fetch(apiUrl).then(function(response) {
        //SUCCESS
        if (response.ok) {
            response.json().then(function(data) {
                //PASS RESPONSE DATA TO DOM FUNCTION
                displayIssues(data);
                //CHECK FOR PAGINATION ISSUES
                if (response.headers.get("Link")) {
                    displayWarning(repo);
                        displayWarning.textContent = "repo has more than 30 issues";                   
                }
            });
        }
        else {
            alert("There was a problem with your request!");
        }
    });
};

// ADD FUNCTION THAT ACCEPTS A PARAMETER CALLED ISSUES
var displayIssues = function(issues) {
    //CHECK FOR NO OPEN ISSUES
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }
    //LOOP OVER THE RESPONSE DATA AND CREATE AN <a> EL FOR EACH ISSUE
    for (var i = 0; i < issues.length; i++) {
        // CREATE A LINK ELEMENT TO TAKE USERS TO THE ISSUE DIRECTLY ON GITHUB
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");

        //CREATE SPAN TO HOLD ISSUE'S TITLE DISPLAY TEXT
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        //APPEND TO CONTAINER
        issueEl.appendChild(titleEl);

        //CREATE A TYPE ELEMENT
        var typeEl =document.createElement("span");

        //CHECK IF ISSUE OR PULL REQUEST
        if (issues[i].pull_request) {
            typeEl.textContent = "(Pull request)";
        } else {
            typeEl.textContent = "(Issue)";
        }

        //APPEND TO CONTAINER
        issueEl.appendChild(typeEl);

        //CREATE AN ISSUECONTAINER AND APPEND
        issueContainerEl.appendChild(issueEl);
    }
};


getRepoIssues("facebook/react");