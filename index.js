
function active() {
    var video = document.getElementById('video');
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
            video.src = window.URL.createObjectURL(stream);
            video.play();
        });
    }
}

active();

function takeSnap() {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var video = document.getElementById('video');
    context.drawImage(video, 0, 0, 640, 480);
    var base64Image = canvas.toDataURL().replace("data:image/png;base64,", "");
    var imageReady = prepareToSend(base64Image)
    var key = "AIzaSyAf6lCrJ3IvyI-vVbGYSg_kqLUg8CAs094";
    sendImage(imageReady, key)
}

function prepareToSend(image) {
    var data = {
        requests: [
            {
                image: {
                    content: image
                },
                features: [
                    {
                        type: "DOCUMENT_TEXT_DETECTION"
                    }
                ]
            }
        ]
    }
    return JSON.stringify(data);
}

function sendImage(data, key) {
    $.ajax({
        type: "POST",
        url: "https://vision.googleapis.com/v1/images:annotate?key=" + key,
        data: data,
        contentType: 'application/json',
        dataType: 'json',
        success: (data) => {
            var text=data.responses[0].fullTextAnnotation.text;
            printText(text);
        },
        error: function( error, response, body ){
            console.log(error)
        }
    });
}

function printText(text){
    $( "#textOfImage" ).append( `<p>${text}</p>` );
}

