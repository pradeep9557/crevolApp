import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { File } from '@ionic-native/file';
/*
  Generated class for the DataServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataServiceProvider {

  constructor(public http: HttpClient,private file: File) {
    console.log('Hello DataServiceProvider Provider');
  }

  checkFileDetails(){
    let url = this.file.externalRootDirectory;
    console.log('filepath',url);
    this.file.checkFile(url, 'crevol/products.txt').then(_ => {
        console.log('File exists');
      }
    ).catch(err => {
        console.log('File doesn\'t exist');
        this.file.createFile(url, 'crevol/products.txt', false);
        let d = [
          {
            "plu":"01234567895",
            "name":"Gaming DDR5 RAM 16GB",
            "price":76,
            "image":"https://www.benchmarkemail.com/images/web4/misc/abtesting-power.gif",
            "desc":"Gaming DDR5 RAM 16GB PC-128000 For x64 PC"
          },
          {
            "plu":"01234567898",
            "name":"Intel Core i7 3.3GHz",
            "price":200,
            "image":"https://prod-discovery.edx-cdn.org/media/course/image/62ef50ba-61ca-4e4d-bd12-cf6006ffd58c-57e7a7434537.small.jpg",
            "desc":"Intel Core i7 3.3GHz L2 16MB 4.6ns"
          }
        ];
        console.log('checkFileDetails ',JSON.stringify(d));
        this.file.writeFile(url, 'crevol/products.txt', JSON.stringify(d),{replace: true}).then(a=>
            console.log('Success',a)
          ).catch(b =>
            console.log('erorr',b)
          )
      }
    );
	  /*return this.http.get('assets/data/products.json')
	    // .map((response:Response)=>response.json());
	    .pipe(map((response: any) => {
      return response;
      }));*/
	}

  getListDetails(pro){
    let url = this.file.externalRootDirectory;
   this.file.readAsText(url, 'crevol/products.txt')
      .then(content=>{
        console.log(content);
      })
      .catch(err=>{
        console.log(err);
      });
  }

  saveData(product){
    console.log('Data Service',product);
    this.file.writeFile(this.file.externalRootDirectory, 'crevol/products.txt', JSON.stringify(product),{replace: true}).then(a=>
            console.log('Success',a)
          ).catch(b =>
            console.log('erorr',b)
          )
  }

}
