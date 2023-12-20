const inputURLField = document.querySelector("#inputURLField");
const submitURLBtn = document.querySelector("#submitURLBtn");

const H_filmName = document.querySelector("#filmName");
const H_filmYear = document.querySelector("#filmYear");
const H_reviewerName = document.querySelector("#reviewerName");
const H_reviewRating = document.querySelector("#reviewRating");
const H_reviewContent = document.querySelector("#reviewContent");

const BASE_URL = "https://letterboxd-review-api-abhishekyelleys-projects.vercel.app";
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
    const obj = validURL(INPUT_URL.split('/'));
    if(obj.valid){
        const uid = obj.uid;
        const fid = obj.fid;
        const vid = obj.vid;
        scraper(`${BASE_URL}/review?uid=${uid}&fid=${fid}&vid=${vid}`);
    }
    else{
        boxDance();
        // window.alert("Bad URL!");
        inputURLField.value = "Bad URL!";
    }
    
});


function validURL(splitten){
    var obj = {valid: false, uid: null, fid: null, vid: 0};
    for(var i=0; i<splitten.length; i++){
        if(splitten[i] == "letterboxd.com"){
            if(i+3<splitten.length){
                obj.uid = splitten[i+1];
                obj.fid = splitten[i+3];
                if(i+4<splitten.length && splitten[i+4])
                    obj.vid = splitten[i+4];
                obj.valid = true;
            }
            break;
        }
    }
    return obj;
}

function scraper(url) {
    fetch(url, { method: 'GET' })
    .then((response) => {
        if(response.ok){
            console.log(response.url);
            return response.json();
        }
        return Promise.reject(response);
    })
    .then((res) => {
        const reviewerName = res.reviewerName;
        const reviewRating = res.reviewRating;
        const reviewDesc = res.reviewDesc;
        const reviewContent = res.reviewContent;
        const filmName = res.filmName;
        const filmYear = res.filmYear;

        const star = "★";
        const half = "½";
        var reviewStars = "";
        for(var i=0; i<Math.floor(reviewRating); i++)
            reviewStars += star;
        if(reviewRating-Math.floor(reviewRating) > 0)
            reviewStars += half;
        H_reviewContent.textContent = reviewContent;
        H_reviewRating.textContent = reviewStars;
        H_reviewRating.title = reviewRating;
        H_reviewerName.textContent = "Reviewer: " + reviewerName;
        H_filmYear.textContent = filmYear;
        H_filmName.textContent = filmName;
    })
    .catch((error) => {
        error.json().then((res) => console.error(res));
    });
}

// chinna animation
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const inputURLLabel = document.querySelector("#inputURLLabel");
inputURLLabel.addEventListener("click", boxDance);
async function boxDance(){
    const startPos = 80;
    var x = startPos;
    inputURLField.style.minWidth = startPos+"vh";
    for(var i=1; i<=10; i++){
        inputURLField.style.minWidth = x-1+"vh";
        x -= 1;
        await sleep(6);
    }
    /*
    // jitter animation
    var minusPlus = -2;
    for(var i=1; i<=20; i++){

        inputURLField.style.minWidth = x+minusPlus+"vh";
        minusPlus *= -1;
        await sleep(1);
    }
    */
    await sleep(30);
    for(var i=1; i<=20; i++){
        inputURLField.style.minWidth = x+1+"vh";
        x += 1;
        await sleep(6);
    }
    for(var i=1; i<=10; i++){
        inputURLField.style.minWidth = x-1+"vh";
        x -= 1;
        await sleep(12);
    }
    for(var i=1; i<=5; i++){
        inputURLField.style.minWidth = x+1+"vh";
        x += 1;
        await sleep(18);
    }
    for(var i=1; i<=5; i++){
        inputURLField.style.minWidth = x-1+"vh";
        x -= 1;
        await sleep(21);
    }
    inputURLField.style.minWidth = startPos+"vh";
}