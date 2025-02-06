import { Component } from "@angular/core";
import { ImageComponent } from "../shared/image/image.component";

@Component({
  selector: "question-answer",
  templateUrl: "./question-answer.component.html",
  styleUrls: ["./question-answer.component.scss"],
  standalone: true,
  imports: [ImageComponent]
})
export class QuestionAnswerComponent {}
