import { Subject } from 'rxjs';

const loader = new Subject();

export const LoaderService = {
    showLoader: () => loader.next(true),
    hideLoader: () => loader.next(false),
    isLoading: () => loader.asObservable()
};

// class LoaderService {

//   _subject;
  
//   constructor() {
//     this._subject = new Subject();
//   }

//   get subject() {
//     return this._subject;
//   }

//   showLoader(){
//     this.subject.next(true);
//   }

//   hideLoader() {
//     this.subject.next(false);
//   }

//   isLoading() {
//     return this.subject.asObservable();
//   }

// }

// export default LoaderService = new LoaderService();