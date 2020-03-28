import { Injectable } from "@angular/core";
import { ISong } from "./song";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class DataService {
  private songs: ISong[];
  private dataSource = new BehaviorSubject<ISong[]>([]);
  songsAsObservable = this.dataSource.asObservable();
  private fileReader: FileReader;
  constructor() {
    this.songs = [];
    this.fileReader = new FileReader();
  }

  addSong(song: ISong) {
    this.songs.push(song);
    this.dataSource.next(this.songs);
  }

  getSongs(): ISong[] {
    return this.songs;
  }

  getReader(): FileReader {
    return this.fileReader;
  }
}
