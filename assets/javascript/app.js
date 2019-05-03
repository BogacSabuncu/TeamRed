
$(document).ready(function () {

    //Given to you by the firebase console
    //Identifies your specific app to the DB
    var config = {
        apiKey: "AIzaSyDPTi1BfLqpqxdT1RvD-kLylgoq_JDhWlU",
        authDomain: "team-red-212d0.firebaseapp.com",
        databaseURL: "https://team-red-212d0.firebaseio.com",
        projectId: "team-red-212d0",
        storageBucket: "team-red-212d0.appspot.com",
        messagingSenderId: "1040465529140"
    };

    //Allows firebase access 
    firebase.initializeApp(config);

    //Initializes services we use
    const firebaseAuth = firebase.auth()
    const firebaseData = firebase.database();

    //Checks if you are logged in on your machine
    if (localStorage.getItem("currentUser")) {

        //gets the data stored on the path with a value equal to your email before the @ symbol.
        firebaseData.ref(localStorage.getItem("currentUser")).once("value").then(function (snapshot) {

            //console.log("display user object" + snapshot.val());
            //console.log(snapshot.val());

            if (snapshot.val().userData.username) {
                $(".login-link").text(`Welcome ${snapshot.val().userData.username}`);
            }

        });
    }


    function getPrivateJob(originalJob) {
        const job = {};
        job.location = {};

        job.title = originalJob.title;
        job.salaryMin = originalJob.salary_min;
        job.salaryMax = originalJob.salary_max;
        job.url = originalJob.redirect_url;
        job.company = originalJob.company.display_name;
        job.description = originalJob.description;
        job.location.country = originalJob.location.area[0];
        job.location.city = originalJob.location.area[1];
        job.location.lat = originalJob.latitude;
        job.location.long = originalJob.longitude;

        return job;
    }


    function privateApiCall() {
        let appId = "0cbadb14"; //app id for adzuna
        let key = "64d8e2d23b6325105d8459f517395077";//key for adzuna
        let jobTitle = "javascript developer";//job search title
        let jobLocation = "london";//job Location

        const queryParams = $.param({
            "app_id": appId,
            "app_key": key,
            "results_per_page": 50,
            "content-type": "application/json",
            "what": jobTitle,
            "where": jobLocation
        });

        let apiURL = `https://api.adzuna.com/v1/api/jobs/gb/search/1?${queryParams}`;
        //console.log(apiURL);
        $.ajax({
            url: apiURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            const jobObj = response.results.map(function (job) {
                return getPrivateJob(job);
            });

            console.log(jobObj);
            return jobObj;
        }).catch(function (err) {
            console.log(err);
        });


    }

    function jobDisplay(job) {
        return (`
    <div>
        <h2>Title: ${job.title}</h2>
        <h2> Company: ${job.company}</h2>
        <h4>location: ${job.location.country} ${job.location.city}</h4>
        <h4>Company: ${job.company}</h4>
        <h4>Salaray Min: ${job.salaryMin}</h4>
        <h4>Salaray Min:${job.salaryMax}</h4>
        <h5>Description:</h5>
        <p> ${job.description}</p>

    </div>
    <button >Yes</button>
    <button>No</button>
    `);
    }

    function normalizeJob(usajob) {
        let jobNorm = {};
        jobNorm.title = usajob.PositionTitle;
        jobNorm.company = usajob.OrganizationName;
        jobNorm.location = {
            city: usajob.PositionLocation[0].LocationName,
            country: usajob.PositionLocation[0].CountryCode,
            lat: usajob.PositionLocation[0].Longitude,
            long: usajob.PositionLocation[0].Latitude,

        }

        jobNorm.url = usajob.PositionURI;
        jobNorm.salaryMin = usajob.PositionRemuneration[0].MinimumRange;
        jobNorm.salaryMax = usajob.PositionRemuneration[0].MaximumRange;
        jobNorm.description = usajob.UserArea.Details.JobSummary;
        // jobNorm.qualification = usajob.QualificationSummary;
        // jobNorm.startDate = usajob.PublicationStartDate;
        // jobNorm.closeDate = usajob.ApplicationCloseDate;
        return jobNorm;

    }

    function govApiCall() {
        const USAJobs = [];
        const BASEURL_USAJOBS = 'https://data.usajobs.gov/api/Search?';
        $.ajax({
            headers: {
                'Authorization-Key': 'uwlmWWZmxLud+37QNF/llnaucTdMV4ldss6pQ8zjEg8='
            },
            url: BASEURL_USAJOBS,
            data: { PositionTitle: "full stack developer", location: "Atlanta", Radius: 75 },
            method: "GET"
        }).then(function (jobs) {
            console.log(jobs);
            const resultList = jobs.SearchResult.SearchResultItems.map(function (result) {
                return normalizeJob(result.MatchedObjectDescriptor);
            });
            console.log(resultList);
            $("#main").html(jobDisplay(resultList[0]));
            return resultList;
        }).catch(function (err) {
            console.log(error);
        })
    }





    $(document).ready(function () {

        //privateApiCall();
        const jobResults = govApiCall();


    })






});
