const video = document.getElementById("myvideo");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let trackButton = document.getElementById("trackbutton");
let updateNote = document.getElementById("updatenote");


let imgindex = 1
let isVideo = false;
let model = null;
let videoInterval = 100;

// video.width = 500
// video.height = 400

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }


//Model parameters for video
const modelParams = {
    flipHorizontal: true, // flip e.g for video  
    maxNumBoxes: 1, // maximum number of boxes to detect
    iouThreshold: 0.5, // ioU threshold for non-max suppression
    scoreThreshold: 0.6, // confidence threshold for predictions.
}

/*
defaultParameters = {
    flipHorizontal: false,
    outputStride: 16,
    imageScaleFactor: 1,
    maxNumBoxes: 20,
    iouThreshold: 0.2,
    scoreThreshold: 0.6,
    modelType: "ssd320fpnlite",
    modelSize: "large",
    bboxLineWidth: "2",
    fontSize: 17,
};
*/


//Function for starting video and referencing detection function
function startVideo() {
    window.alert(String.fromCodePoint(0x270A) + " Fist - Play/Pause \n"+String.fromCodePoint(0x1F590)+"Palm - Next \n"+String.fromCodePoint(0x261D)+"Point - Previous\n"+String.fromCodePoint(0x1F44C)+"Pinch - Volume")
    handTrack.startVideo(video).then(function (status) {
        console.log("video started", status);
        if (status) {
            updateNote.innerText = "Now tracking"
            isVideo = true
            runDetection()
        } else {
            updateNote.innerText = "Please enable video"
        }
    });
}


//Video On/Off
function toggleVideo() {
    if (!isVideo) {
        updateNote.innerText = "Starting video"
        startVideo();
    } else {
        updateNote.innerText = "Stopping video"
        handTrack.stopVideo(video)
        isVideo = false;
        updateNote.innerText = "Video stopped"
        video.style.backgroundColor = "black";
    }
}


trackButton.addEventListener("click", function () {toggleVideo();});


//Detect gestures in video
function runDetection() {
    model.detect(video).then(predictions => {
        // console.log("Predictions: ", predictions);
        // get the middle x value of the bounding box and map to paddle location
        model.renderPredictions(predictions, canvas, context, video);
        if (predictions[0]) {
            let pos = predictions[0].label;
            updateProgress(pos)
            console.log('Predictions: ', pos);

        }
        if (isVideo) {
            setTimeout(() => {
                runDetection(video)
            }, videoInterval);
        }
    });
}


// Load the model.
handTrack.load(modelParams).then(lmodel => {
    // detect objects in the image.
    model = lmodel
    model.detect(video).then(predictions => {
    console.log('Predictions: ', predictions)
    model.renderPredictions(predictions, canvas, context, video);
        if (predictions[0]) {
            let pos = predictions[0].label;
            updateProgress(pos)
            console.log('Predictions: ', pos);

        }
        if (isVideo) {
            setTimeout(() => {
                runDetection(video)
            }, videoInterval);
        }
    }); 

    updateNote.innerText = "Model Loaded!"
    updateNote.style.backgroundColor = "#8B0000"
    trackButton.disabled = false
});


let x = 0;

//Mapping gestures to functions
function updateProgress(pos)
{
    if(pos=="closed") //Pause/Play
    {
        if(audioElement.paused || audioElement.currentTime<=0){
            audioElement.play();
            masterPlay.classList.remove('fa-play-circle');
            masterPlay.classList.add('fa-pause-circle');
            gif.style.opacity = 1;
        }
        else{
            audioElement.pause();
            masterPlay.classList.remove('fa-pause-circle');
            masterPlay.classList.add('fa-play-circle');
            gif.style.opacity = 0;
        }
    }

    else if(pos=="open") //Next
    {
        if(songIndex>=9){
            songIndex = 0
        }
        else{
            songIndex += 1;
        }
        audioElement.src = `songs/${songIndex+1}.mp3`;
        masterSongName.innerText = songs[songIndex].songName;
        audioElement.currentTime = 0;
        audioElement.play();
        masterPlay.classList.remove('fa-play-circle');
        masterPlay.classList.add('fa-pause-circle');
        
    }

    else if(pos=="point") //Previous
    {
        if(songIndex<=0){
            songIndex = 0
        }
        else{
            songIndex -= 1;
        }
        audioElement.src = `songs/${songIndex+1}.mp3`;
        masterSongName.innerText = songs[songIndex].songName;
        audioElement.currentTime = 0;
        audioElement.play();
        masterPlay.classList.remove('fa-play-circle');
        masterPlay.classList.add('fa-pause-circle');
    }

    
    else if(pos=="pinch") //Volume control
    {
        if(x%2==0)
        {
            audioElement.volume+=0.1;
            x+=1; 
        }
        else if(x%2!=0)
        {
            audioElement.volume+=0.1;
            x+=1;
        }
        
    }
}


