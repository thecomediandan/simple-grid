import { Component, ElementRef, Renderer2, signal, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App{
  protected readonly title = signal('simple-grid');

  @ViewChild('gridContainer') gridContainer!: ElementRef;
  @ViewChild('unionItem') unionCheckbox!: ElementRef;

  formControl: FormGroup;

  private containerWidth: number = 594;
  numberColumns = signal(4);
  numberRows = signal(4);
  union = signal(false);
  private gap: number = 4;
  private cellSize!: number;

  constructor(private renderer2: Renderer2, private formBuilder: FormBuilder) {
    // Ideal para inyecciones de dependencias pero no para lógica que dependa del DOM o de los inputs
    this.formControl = this.formBuilder.group({
    dimx: [`${this.numberColumns()}`, [Validators.required, Validators.min(1), Validators.max(10)]],
    dimy: [`${this.numberRows()}`, [Validators.required, Validators.min(1), Validators.max(10)]],
    union: [false, [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Para inicializar datos, pero no para manipular el DOM
  }

  ngAfterViewInit(): void {
    // Aquí puedes manipular el DOM después de que la vista se haya inicializado
    this.fillGridContainer();
    // this.renderer2.setStyle(this.gridContainer.nativeElement, 'background-color', '#f0f0f0');
  }

  calculateCellSize(): void {
    this.containerWidth = this.gridContainer.nativeElement.clientWidth as number;
    this.cellSize = (this.containerWidth - (this.numberColumns() - 1) * this.gap) / this.numberColumns();
  }

  fillGridContainer(): void {
    this.calculateCellSize();
    this.renderer2.setStyle(this.gridContainer.nativeElement, 'grid-template-columns', `repeat(${this.numberColumns}, ${this.cellSize}px)`);
    this.renderer2.setStyle(this.gridContainer.nativeElement, 'grid-template-rows', `repeat(${this.numberRows}, ${this.cellSize}px)`);
    this.renderer2.setStyle(this.gridContainer.nativeElement, 'gap', `${this.gap}px`);
    for (let i = 0; i < this.numberColumns() * this.numberRows(); i++) {
      const cell = this.renderer2.createElement('div');
      this.renderer2.addClass(cell, 'grid-item');
      this.renderer2.setStyle(cell, 'width', `${this.cellSize}px`);
      this.renderer2.setStyle(cell, 'height', `${this.cellSize}px`);
      // const text = this.renderer2.createText(`Elemento ${i + 1}`);
      // this.renderer2.appendChild(cell, text);
      this.renderer2.appendChild(this.gridContainer.nativeElement, cell);
    }
  }

  onsubmit(): void {
    if (this.formControl.invalid) {
      return;
    }
    this.numberColumns.set(this.formControl.value.dimx as number);
    this.numberRows.set(this.formControl.value.dimy as number);

    if (this.unionCheckbox.nativeElement.checked) {
      console.log("checked");
      this.union.set(true);
    }else {
      console.log("unchecked");
      this.union.set(false);
    }

    console.log(this.formControl.value);
  }
}
