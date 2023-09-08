import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {

  videoHtml: string='';

  /* Aca estan las variables de los pokemones */
  listCategorys: any[] = [];
  listPokemones: any[] = [];
  listPokemonesOriginal: any[] =[];
  searchTerm: string = ''; // Define la barra de busqueda para los pokemones

  /* Aca estan las variables de la camara */
  receivedImageSource: any;
  receivedTitulo: string = '';
  receivedDescripcion: string = '';
  reciveSelectedRating: number = 0;
  reciveCoordinates: string = '';

  constructor(public http: HttpClient, private router: Router, private route: ActivatedRoute) {}

  navigate(value: any) {
    let id = JSON.stringify(value);
    this.router.navigate(['./detail-noticia', { id }]);
    localStorage.setItem('NotisDetail', JSON.stringify(value));
  }

  ngOnInit() {
    /* Aca se resiven las variables de pokemon */
    this.http.get('../../assets/noticias/pokemones.json').subscribe(data => {
      this.listCategorys = JSON.parse(JSON.stringify(data))[0].pokemones.categorys;
      this.listPokemones = JSON.parse(JSON.stringify(data))[0].detailPokemones;
      this.listPokemonesOriginal = JSON.parse(JSON.stringify(data))[0].detailPokemones;
    });

    /*Aca se reciven las variables de la camara */
    this.route.queryParams.subscribe((params) => {
      this.receivedImageSource = params['imageSource'];
      this.receivedTitulo = params['titulo'];
      this.receivedDescripcion = params['Descripcion'];
      this.reciveSelectedRating = params['calificacion'];
      this.reciveCoordinates = params ['direction'];
    });
  }

  // Método para filtrar los pokemones
  filterPokemones(searchTerm: string): void {
    if (!searchTerm.trim()) {
      // Si el término de búsqueda está vacío, muestra todas las tarjetas nuevamente.
      this.listPokemones = this.listPokemonesOriginal; 
    } else {
      // Filtra los pokemones que coincidan con el término de búsqueda.
      this.listPokemones = this.listPokemonesOriginal.filter(pokemon =>
        pokemon.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pokemon.categoria.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }

  /* Aca esta el funcionamiento de la camara */
  irDetalle() {this.router.navigate(['/detalle-photo'], {
    queryParams: {
      receivedImageSource: this.receivedImageSource,
      receivedTitulo: this.receivedTitulo,
      receivedDescripcion: this.receivedDescripcion,
      },
    });
  }

  /* Aca esta la calificacion por estrellas */
  rate(selectedValue: number) {
    this.reciveSelectedRating = selectedValue;
  }
  getStarsArray(rating: number): number[] {
    const starsArray = new Array(Math.max(1, rating));
    console.log('Stars Array:', starsArray);
    return starsArray;
  }

  limpiar(){
    this.receivedImageSource = '';
    this.receivedTitulo = '';
    this.receivedDescripcion = '';
    this.reciveSelectedRating = 0;
  }
  
  irFormulario(){ this.router.navigate(['./formulario'])};
  salir() {    this.router.navigate(['./login'])};
}

/*
paso 1: npm install
paso 2: npm install -g @ionic/cli
paso 3: ionic integrations enable capacitor
paso 4: ionic build
paso 5: npm install @capacitor/camera
paso 6: npm install @ionic/pwa-elements
paso 7: npx cap add android / npx cap add ios
*/