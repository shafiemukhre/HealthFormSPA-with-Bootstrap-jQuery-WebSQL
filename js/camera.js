'use strict'

const photo = document.getElementById('photo')
const errorMsgElement = document.querySelector('span#errorMsg')

const constraints = {
    audio: false,
    video: {
        width: 150, height: 150
    }
}

//access webcam
async function init() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints)
        handleSuccess(stream)
    } catch (error){
        errorMsgElement.innerHTML = `navigator.getUserMedia error:${error.toString()}`
    }
}

//if success
function handleSuccess(stream){
    window.stream = stream
    photo.srcObject = stream
}

init()