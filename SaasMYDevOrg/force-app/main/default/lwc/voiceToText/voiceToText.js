import { LightningElement, track } from 'lwc';

export default class VoiceToText extends LightningElement {
    @track transcript = '';
    @track isRecording = false;
    @track errorMessage = '';

    recognition;
    finalTranscript = ''; // Initialize to an empty string

    connectedCallback() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if(SpeechRecognition) {
            console.log('SpeechRecognition is supported in this browser.');
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = true; // Corrected typo
            this.recognition.interimResults = true;
            // this.recognition = new webkitSpeechRecognition() || new SpeechRecognition();
            // this.recognition.lang = 'en-US';

            // Result handler
            this.recognition.onresult = (event) => {
                let interimTranscript = '';
                for (let i = event.resultIndex; i < event.result.length; ++i) {
                    if (event.result[i].isFinal) {
                        this.finalTranscript += event.result[i][0].transcript;
                    } else {
                        interimTranscript += event.result[i][0].transcript;
                    }
                }
                this.transcript = this.finalTranscript + interimTranscript;
            }

            // Error handler (moved outside onresult)
            this.recognition.onerror = (event) => {
                console.error('Error occurred in SpeechRecognition: ', event.error);
                this.errorMessage = 'Error occurred in Recognition: ' + event.error;
                this.isRecording = false;
            }
        } else {
            console.error('SpeechRecognition is not supported in this browser.');
            this.errorMessage = 'Speech recognition is not supported';
        }
    }

    startRecording() {
         console.log('Starting recording...');
        if (this.recognition && !this.isRecording) {
            this.transcript = '';
            this.finalTranscript = '';
            this.errorMessage = '';
            this.recognition.start();
            this.isRecording = true;
        }
    }

    stopRecording() {
        if (this.recognition && this.isRecording) {
            this.recognition.stop();
            this.isRecording = false;
        }
    }

    get isStopDisabled() {
        return !this.isRecording;
    }

    get isStartDisabled() {
        return this.isRecording;
    }

    get hasErrorMessage() {
        return this.errorMessage.length === 0;
    }

    get shouldShowErrorMessage() {
        return this.transcript === '' && this.errorMessage === '';
    }
   
}
