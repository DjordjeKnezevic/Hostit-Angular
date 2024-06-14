import { Component } from '@angular/core';
import { LocationsService } from '../../services/locations.service';
import { Location } from '../../interfaces/location';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  locations: Location[] = [];

  constructor(private locationsService: LocationsService) { }

  ngOnInit(): void {
    this.locationsService.getLocations().subscribe(data => {
      this.locations = data;
    });
  }
}
