import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Toast } from '@ionic-native/toast';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { DataServiceProvider } from '../../providers/data-service/data-service';
import { NativeStorage } from '@ionic-native/native-storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

	products: any[] = [];
	lastSyncTime:any;
	selectedProduct: any;
	barcodeCode: any;
	productFound:boolean = false;

  constructor(public navCtrl: NavController,
	  private barcodeScanner: BarcodeScanner,
	  private toast: Toast,
	  private transfer: FileTransfer, 
	  private file: File,
	  private nativeStorage: NativeStorage,
	  public dataService: DataServiceProvider) {
  		/*this.dataService.getListDetails()
		  .subscribe((response)=> {
		      this.products = response;
		      console.log('home',response);
		  });*/
		  console.log(1);
		  this.dataService.checkFileDetails();
		  const fileTransfer: FileTransferObject = this.transfer.create();	
		  this.nativeStorage.getItem('lastSyncTime')
			  .then(
			    data => {
			    	console.log(data);
			    	this.lastSyncTime=data;
			    },
			    error => console.error(error)
			  );
		 
		 
  }


ionViewDidLoad() {
	console.log(2);
	this.file.readAsText(this.file.externalRootDirectory, 'crevol/products.txt')
	      .then(content=>{
	        console.log(content);
	        this.products = JSON.parse(content);
	        })
	      .catch(err=>{
	        console.log(err);
	      });
    // Put here the code you want to execute
   
  }



  dateSync(){
  	this.lastSyncTime = new Date();
  	this.nativeStorage.setItem('lastSyncTime', this.lastSyncTime)
	  .then(
	    () => console.log('Stored item!'),
	    error => console.error('Error storing item', error)
	);
  }

  syncData(){
  	console.log(this.products.length);
  	if(this.products.length==0){
  		let url = this.file.externalRootDirectory;
	   this.file.readAsText(url, 'crevol/products.txt')
	      .then(content=>{
	        console.log(content);
	        this.products = JSON.parse(content);
	        console.log(this.products);
	        this.dateSync();
		  	this.products.forEach( r => {
		  		console.log(r);
		  		if(!r.text){
		  			r.text = 'Yes';
		  		}
		  	});
		  	this.dataService.saveData(this.products);
	      })
	      .catch(err=>{
	        console.log(err);
	      });
  	}else{
  		this.dateSync();
	  	this.products.forEach( r => {
	  		console.log(r);
	  		if(!r.text){
	  			r.text = 'Yes';
	  		}
	  	});
	  	this.dataService.saveData(this.products);
  	}
  }

  sync(){
  	this.file.checkDir(this.file.externalRootDirectory, 'crevol').then(_ => {
  			console.log('Directory exists');
  			this.syncData();
  		}
  	).catch(err => {
  			console.log('Directory doesn\'t exist');
  			this.file.createDir(this.file.externalRootDirectory, 'crevol', false);
  			this.syncData();
  		}
  	);

  	this.toast.show(`Sync Complete`, '5000', 'center').subscribe(
        toast => {
          console.log(toast);
        }
	);
  }


  scan() {
	  this.selectedProduct = {};
	  this.barcodeScanner.scan().then((barcodeData) => {
	  	console.log(barcodeData);
	  	this.barcodeCode = barcodeData.text;
	    this.selectedProduct = this.products.find(product => product.plu === barcodeData.text);
	    if(this.selectedProduct !== undefined) {
	      this.productFound = true;
	    } else {
	      this.productFound = false;
	      this.toast.show(`Product not found`, '5000', 'center').subscribe(
	        toast => {
	          console.log(toast);
	        }
	      );
	    }
	  }, (err) => {
	    this.toast.show(err, '5000', 'center').subscribe(
	      toast => {
	        console.log(toast);
	      }
	    );
	  });
	}

}
