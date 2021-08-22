import { Component } from '@angular/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Plugins } from '@capacitor/core';
import { PianoService } from '../services/piano.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  userInfo = null;
  checkboxes = "";
  repeatCount = null;
  ALL_AUDIO_CLIPS = ["a3", "a4", "a5", "a-3", "a-4", "a-5",
                   "b3", "b4", "b5",
                   "c3", "c4", "c5", "c6", "c-3", "c-4", "c-5",
                   "d3", "d4", "d5", "d-3", "d-4", "d-5",
                   "e3", "e4", "e5", 
                   "f3", "f4", "f5", "f-3", "f-4", "f-5", 
                   "g3", "g4", "g5", "g-3", "g-4", "g-5" ];

  AUDIO_CLIPS = ["a3", "a4", "a5", "a-3", "a-4", "a-5",
                   "b3", "b4", "b5",
                   "c3", "c4", "c5", "c6", "c-3", "c-4", "c-5",
                   "d3", "d4", "d5", "d-3", "d-4", "d-5",
                   "e3", "e4", "e5", 
                   "f3", "f4", "f5", "f-3", "f-4", "f-5", 
                   "g3", "g4", "g5", "g-3", "g-4", "g-5"];

  constructor(private pianoService: PianoService) {
    GoogleAuth.init();
  }


  async googleSignUp() {
    const googleUser = await GoogleAuth.signIn();
    console.log('user : ', googleUser);
    this.userInfo = googleUser;

    if (this.userInfo.email) {
      this.pianoService.getPrefDataByEmail(this.userInfo.email).subscribe(res => {
        console.log("res---", res);
        let prefData = JSON.parse(res["prefdata"]);
        console.log("111", prefData.repeat);
        this.repeatCount = prefData.repeat;
      });
    
    }
  }

  

   async showNoteList() {
     console.log("showing list...");

  
    for (let i=0; i<this.ALL_AUDIO_CLIPS.length; i++) {
        this.checkboxes += '<input type="checkbox" name="notes[]" checked="checked" (change)="checkUpdates()" value="' 
        + this.ALL_AUDIO_CLIPS[i] + '">' + this.ALL_AUDIO_CLIPS[i] + '</input>';
        if (i%5 == 0) {
            this.checkboxes += '<br/>';
        }
    }
    document.getElementById("note-list").innerHTML= this.checkboxes 
    + '<br/><br/><br/><button (click)="updateAll(0)">Uncheck All</button>' 
    + '<br/><br/><button (click)="updateAll(1)">Check All</button>';

    // AUDIO_CLIPS = [];
}

  async updateAll(value) {
    console.log("update all ....");
    var notes = document.getElementsByName("notes[]");
    for (let i=0; i<notes.length; i++) {
      (<HTMLInputElement>notes[i]).checked = value == 0 ? false : true;
    }

    this.checkUpdates();
}

  async checkUpdates() {
    console.log("checkupdates ...");
    this.AUDIO_CLIPS = [];
    var checkboxes1 = document.getElementsByName("notes[]");
    for (let i=0; i<checkboxes1.length; i++) {
        if ((<HTMLInputElement>checkboxes1[i]).checked) {
            this.AUDIO_CLIPS.push((<HTMLInputElement>checkboxes1[i]).value);
        }
    }
}
              
  async playRandomNote() {
    console.log("Playing random note ..");

    document.getElementById("answer-display").textContent = "";
    var myAudio = new Audio();
    var answer = this.AUDIO_CLIPS[(Math.floor(Math.random() * this.AUDIO_CLIPS.length))];
    (<HTMLInputElement>document.getElementById("note-answer")).value = answer;
    myAudio.src = "assets/mp3_notes/" + answer + ".mp3";
    // myAudio.play();
    
    var count = (<HTMLInputElement>document.getElementById("repeat-count")).value;
    var gap = (<HTMLInputElement>document.getElementById("gap-among-notes")).value;

    for (let i=0; i< parseInt(count); i++) {
        setTimeout(() => {myAudio.play();}, i*1000*parseInt(gap));
    }
    // setTimeout(() => {myAudio.play();}, 4000)
}

  async checkAnswer() {
    (<HTMLInputElement>document.getElementById("answer-display")).textContent = (<HTMLInputElement>document.getElementById("note-answer")).value;
  }

}
