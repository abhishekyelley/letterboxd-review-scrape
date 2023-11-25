const inputURLField = document.querySelector("#inputURLField");
const submitURLBtn = document.querySelector("#submitURLBtn");

const H_filmName = document.querySelector("#filmName");
const H_filmYear = document.querySelector("#filmYear");
const H_reviewerName = document.querySelector("#reviewerName");
const H_reviewRating = document.querySelector("#reviewRating");
const H_reviewContent = document.querySelector("#reviewContent");

const req = new XMLHttpRequest();
const checkArr = ["https:", "", "letterboxd.com", "username", "film", "moviename"];

const PROXY_URL = "https://cors-anywhere.herokuapp.com/";
var INPUT_URL = "";

inputURLField.addEventListener("keypress", (event)=>{
    if (event.key === "Enter") {
        event.preventDefault();
        submitURLBtn.click();
    }
});

submitURLBtn.addEventListener("click", ()=>{
    INPUT_URL = inputURLField.value;
    INPUT_URL = INPUT_URL.trim();
    // console.log(INPUT_URL);
    var isBadURL = validURL(INPUT_URL.split('/'));
    if(!isBadURL){
        req.open("GET", PROXY_URL + INPUT_URL, true);
        req.responseType = "document";
        req.send(null);
    }
    else{
        window.alert("Bad URL!");
    }
    
});


function validURL(splitten){
    var n = Math.min(checkArr.length, splitten.length);
    for(var i=0; i<n; i+=1){
        if(i==3 || i==5){
            continue;
        }
        if(checkArr[i] != splitten[i]){
            return true;
        }
    }
    return false;
}


req.onload = ()=>{
    if(req.readyState === req.DONE && req.status === 200){
        const res = req.responseXML;

        var reviewContent = "";
        var reviewContentHelp = res.querySelector(".review.body-text.-prose.-hero");

        if(reviewContentHelp.querySelector(".contains-spoilers")){
            reviewContentHelp = reviewContentHelp.querySelector(".show-review.hidden-spoilers").querySelectorAll("p");
        }
        else{
            reviewContentHelp = reviewContentHelp.querySelector("div").querySelector("div").querySelectorAll("p")
        }
        // write content into reviewContent
        reviewContentHelp.forEach(item => {
            reviewContent += item.innerText;
        });

        const reviewStarsHelp = res.querySelector(".headline-2.prettify").querySelectorAll("span");
        // write stars into reviewStars
        const reviewStars = reviewStarsHelp[reviewStarsHelp.length-1].innerText;
        
        const reviewerName = res.querySelector(".title-4").querySelector("a").querySelector("span").innerText;
        const filmName = res.querySelector(".film-title-wrapper").querySelector("a").innerText;
        const filmYear = res.querySelector(".film-title-wrapper").querySelector("small").innerText;
        
        console.log(reviewerName);
        console.log(reviewStars);
        console.log(reviewContent);
        console.log(filmName);
        console.log(filmYear);
        H_reviewContent.textContent = reviewContent;
        H_reviewRating.textContent = reviewStars;
        H_reviewerName.textContent = "Reviewer: " + reviewerName;
        H_filmYear.textContent = filmYear;
        H_filmName.textContent = filmName;
    }
    else{
        console.log(req.status, req.statusText);
    }
};


// chinna animation
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const inputURLLabel = document.querySelector("#inputURLLabel");
var funnyAnimation = null;
var initWidthBox = inputURLField.style.minWidth
inputURLLabel.addEventListener("click", async ()=>{
    clearInterval(funnyAnimation);
    var pos = 1;
    var incr = true;
    const startPos = 80;
    const endPos = 85;
    inputURLField.style.minWidth = startPos;
    
    funnyAnimation = setInterval(moveBox, 10);
    function moveBox(){
        if(pos == 0){
            clearInterval(funnyAnimation);
        }
        else if(pos == endPos-startPos)
            incr = false;
        if(incr)
            pos++;
        else
            pos--;
        inputURLField.style.minWidth = startPos+pos+"vh";
    }
    // await sleep(250);
    // inputURLField.style.minWidth = "80vh";
});