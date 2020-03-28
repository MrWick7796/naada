import { DataService } from "./../data.service";
import { ISong } from "./../song";
import { Component, OnInit, OnChanges } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireStorage } from "@angular/fire/storage";

@Component({
  selector: "list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"]
})
export class ListComponent implements OnInit {
  songs: ISong[];
  uploadIndex: number;

  constructor(
    private service: DataService,
    private db: AngularFirestore,
    private storage: AngularFireStorage
  ) {
    this.uploadIndex = 0;
  }

  ngOnInit() {
    this.service.songsAsObservable.subscribe(data => {
      this.songs = data;
    });
  }

  pushToFireBase() {
    this.db
      .collection("songs")
      .doc("song")
      .set({ ...this.songs[this.uploadIndex++] })
      .then(docRef => {
        console.log(docRef);
      })
      .catch(error => {
        console.log(error);
      });
    if (
      this.uploadIndex > 1 &&
      this.songs[this.uploadIndex - 2].image.startsWith(
        "https://firebasestorage.googleapis.com/"
      )
    ) {
      this.storage.storage
        .refFromURL(this.songs[this.uploadIndex - 2].image)
        .delete();
    }
  }

  clearQueue() {
    for (let index = this.uploadIndex; index < this.songs.length; index++) {
      if (
        this.songs[index].image.startsWith(
          "https://firebasestorage.googleapis.com/"
        )
      ) {
        this.storage.storage.refFromURL(this.songs[index].image).delete();
      }
    }
    this.songs.splice(this.uploadIndex, this.songs.length);
  }
}
